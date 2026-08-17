/**
 * Migración a "un correo = un lead".
 *
 * Antes la llave única era `email + phoneE164`, así que la misma persona
 * volviendo con otro número abría una ficha nueva. Este script deja una sola
 * ficha por correo, reconstruye el historial de inscripciones de los leads que
 * ya existían y cambia el índice único.
 *
 * Uso (desde backend/):
 *   npm run leads:merge-by-email          # simulación, no escribe nada
 *   npm run leads:merge-by-email -- --apply
 *
 * Lee MONGODB_URI del .env (vía `node --env-file`, sin dotenv). Es idempotente:
 * volver a ejecutarlo sobre una base ya migrada no cambia nada.
 */
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const OLD_INDEX = 'email_1_phoneE164_1';

interface Submission {
  at: Date;
  phoneE164?: string;
  tracking?: Record<string, string>;
}

interface LeadDoc {
  _id: mongoose.Types.ObjectId;
  email: string;
  phoneE164?: string;
  stage?: string;
  tracking?: Record<string, string>;
  submissionCount?: number;
  submissions?: Submission[];
  lastSubmittedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Orden real del funnel. Al fusionar se conserva la etapa más avanzada de
 * todas las fichas: si una llegó a WhatsApp, ese lead llegó a WhatsApp.
 */
const STAGE_ORDER = [
  'captured',
  'progress_viewed',
  'whatsapp_joined',
  'registered',
];

const stageRank = (stage?: string) => {
  const index = STAGE_ORDER.indexOf(stage ?? '');
  return index === -1 ? 0 : index;
};

/**
 * Historial de un documento que nunca pasó por el código nuevo: se reconstruye
 * a partir de lo único que se sabe, su fecha de creación y su tracking.
 */
const submissionsOf = (lead: LeadDoc): Submission[] => {
  if (lead.submissions?.length) return lead.submissions;
  return [
    {
      at: lead.createdAt,
      phoneE164: lead.phoneE164,
      tracking: lead.tracking ?? {},
    },
  ];
};

/**
 * Host y base de la conexión, sin usuario ni contraseña, para imprimirlos.
 * El proyecto tiene más de una base (la de pruebas y la que usa el servidor de
 * producción), y el `.env` local no siempre apunta a la que uno cree.
 */
const describeTarget = (uri: string): string => {
  try {
    const parsed = new URL(uri);
    const database = parsed.pathname.replace(/^\//, '') || '(sin especificar)';
    return `${parsed.host} · base "${database}"`;
  } catch {
    return '(cadena de conexión ilegible)';
  }
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Falta MONGODB_URI en el .env');

  console.log(
    APPLY
      ? '\n⚠️  MODO APLICAR: se van a escribir cambios en la base.'
      : '\n🔍 SIMULACIÓN: no se escribe nada. Añade --apply para ejecutar.',
  );
  console.log(`📍 Destino: ${describeTarget(uri)}\n`);

  await mongoose.connect(uri);
  const leads = mongoose.connection.collection<LeadDoc>('leads');

  /*
    Antes de escribir se muestra el tamaño de la colección. Si el número no
    coincide con el que sale en /admin, la conexión apunta a otra base y hay
    que abortar (Ctrl+C) en vez de migrar la equivocada.
  */
  if (APPLY) {
    const found = await leads.countDocuments();
    console.log(
      `La colección tiene ${found} leads. Si no cuadra con /admin, corta ahora (Ctrl+C).`,
    );
    console.log('Continuando en 5 segundos...\n');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  /*
    El índice viejo se borra ANTES de fusionar, no después. Mientras exista,
    darle al superviviente el teléfono del envío más reciente choca contra la
    ficha que todavía lo tiene y Mongo aborta con E11000. Borrarlo no destruye
    datos: se reemplaza por el índice único de correo al final.
  */
  const indexesBefore = await leads.indexes();
  if (indexesBefore.some((index) => index.name === OLD_INDEX)) {
    console.log(`Índice viejo ${OLD_INDEX}: presente`);
    if (APPLY) {
      await leads.dropIndex(OLD_INDEX);
      console.log(`  → eliminado (se recrea como email_1 al final).`);
    }
  }

  const all = await leads.find({}).sort({ createdAt: 1 }).toArray();
  console.log(`Leads en la colección: ${all.length}`);

  // 1) Agrupar por correo normalizado.
  const byEmail = new Map<string, LeadDoc[]>();
  for (const lead of all) {
    const key = (lead.email ?? '').trim().toLowerCase();
    if (!key) continue;
    byEmail.set(key, [...(byEmail.get(key) ?? []), lead]);
  }

  const duplicated = [...byEmail.entries()].filter(
    ([, docs]) => docs.length > 1,
  );
  const pendingBackfill = all.filter((lead) => lead.submissionCount == null);

  console.log(`Correos con ficha duplicada: ${duplicated.length}`);
  console.log(
    `Fichas sin historial que hay que inicializar: ${pendingBackfill.length}\n`,
  );

  // 2) Fusionar cada grupo duplicado en su ficha más antigua.
  for (const [email, docs] of duplicated) {
    const ordered = [...docs].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
    const [survivor, ...absorbed] = ordered;
    const newest = ordered[ordered.length - 1];

    /*
      Se deduplica por fecha+teléfono para que el script sea idempotente: si
      una corrida anterior se cortó después de consolidar el superviviente pero
      antes de borrar las absorbidas, repetirla no duplica el historial.
    */
    const seen = new Set<string>();
    const submissions = ordered
      .flatMap(submissionsOf)
      .filter((submission) => {
        const key = `${new Date(submission.at).getTime()}|${submission.phoneE164 ?? ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

    const stage = ordered.reduce(
      (best, lead) =>
        stageRank(lead.stage) > stageRank(best) ? (lead.stage ?? best) : best,
      'captured',
    );

    console.log(
      `· ${email}: ${docs.length} fichas → 1 (${submissions.length} inscripciones, etapa "${stage}")`,
    );

    if (!APPLY) continue;

    await leads.updateOne(
      { _id: survivor._id },
      {
        $set: {
          // Los datos de contacto ganadores son los del envío más reciente.
          firstName: (newest as unknown as { firstName: string }).firstName,
          lastName: (newest as unknown as { lastName: string }).lastName,
          countryCode: (newest as unknown as { countryCode: string })
            .countryCode,
          dialCode: (newest as unknown as { dialCode: string }).dialCode,
          phoneNumber: (newest as unknown as { phoneNumber: string })
            .phoneNumber,
          phoneE164: newest.phoneE164,
          tracking: newest.tracking ?? {},
          stage,
          submissions,
          submissionCount: submissions.length,
          lastSubmittedAt: submissions[submissions.length - 1].at,
        },
      },
    );

    await leads.deleteMany({ _id: { $in: absorbed.map((doc) => doc._id) } });
  }

  // 3) Inicializar historial en las fichas que nunca pasaron por el código nuevo.
  if (APPLY) {
    for (const lead of pendingBackfill) {
      // Puede haber sido borrada en el paso anterior al fusionarse.
      const current = await leads.findOne({ _id: lead._id });
      if (!current || current.submissionCount != null) continue;

      const submissions = submissionsOf(current);
      await leads.updateOne(
        { _id: current._id },
        {
          $set: {
            submissions,
            submissionCount: submissions.length,
            lastSubmittedAt: submissions[submissions.length - 1].at,
          },
        },
      );
    }
  }

  /*
    4) El índice único de correo se crea al final, ya sin duplicados: crearlo
    antes de fusionar fallaría justamente por los duplicados que venimos a
    resolver.
  */
  const indexes = await leads.indexes();
  const hasNew = indexes.some((index) => index.name === 'email_1');
  console.log(`\nÍndice único email_1: ${hasNew ? 'presente' : 'ausente'}`);

  if (APPLY && !hasNew) {
    await leads.createIndex({ email: 1 }, { unique: true });
    console.log('Índice único email_1 creado.');
  }

  const remaining = await leads.countDocuments();
  console.log(
    APPLY
      ? `\n✅ Listo. Leads tras la fusión: ${remaining}\n`
      : '\n🔍 Simulación terminada. Nada se modificó.\n',
  );

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error('\n❌ La migración falló:', error);
  process.exitCode = 1;
  void mongoose.disconnect();
});
