import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum LeadStage {
  Captured = 'captured',
  ProgressViewed = 'progress_viewed',
  WhatsappJoined = 'whatsapp_joined',
  Registered = 'registered',
}

export type LeadDocument = HydratedDocument<Lead>;

/**
 * Una entrada por cada vez que el lead envió el formulario. Como la identidad
 * del lead es el correo, aquí queda registrado el teléfono y la campaña de
 * *ese* envío: si vuelve con otro número o por otra pauta, no se pierde.
 */
@Schema({ _id: false })
export class LeadSubmission {
  @Prop({ required: true })
  at: Date;

  /** Teléfono usado en ese envío, en E.164. */
  @Prop()
  phoneE164?: string;

  /** UTM y cookies del pixel de ese envío. */
  @Prop({ type: Object, default: {} })
  tracking: Record<string, string>;
}

export const LeadSubmissionSchema =
  SchemaFactory.createForClass(LeadSubmission);

@Schema({ timestamps: true, collection: 'leads' })
export class Lead {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  /** Identidad del lead: un correo, una ficha. El índice único está abajo. */
  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  /** Código ISO del país seleccionado, por ejemplo CO, US, VE. */
  @Prop({ required: true, uppercase: true })
  countryCode: string;

  /** Prefijo telefónico internacional incluyendo el signo, por ejemplo +57. */
  @Prop({ required: true })
  dialCode: string;

  /** Número nacional sin prefijo ni separadores. */
  @Prop({ required: true })
  phoneNumber: string;

  /** Número completo normalizado en formato E.164, por ejemplo +573001112233. */
  @Prop({ required: true, index: true })
  phoneE164: string;

  @Prop({
    type: String,
    enum: Object.values(LeadStage),
    default: LeadStage.Captured,
    index: true,
  })
  stage: LeadStage;

  @Prop({ type: Object, default: {} })
  tracking: Record<string, string>;

  /**
   * Cuántas veces envió el formulario. Un valor alto es señal de interés: el
   * mismo correo volviendo a inscribirse.
   *
   * Sin `default` a propósito: el upsert de `create()` lo maneja con `$inc`, y
   * un default aquí chocaría con ese operador en el mismo update (Mongo lo
   * rechaza como conflicto de ruta).
   */
  @Prop({ index: true })
  submissionCount: number;

  /** Fecha del último envío. `createdAt` sigue siendo la del primero. */
  @Prop()
  lastSubmittedAt?: Date;

  /**
   * Historial completo, uno por envío. `default: undefined` cancela el `[]`
   * que Mongoose pondría por su cuenta, que también entraría en conflicto con
   * el `$push` del upsert.
   */
  @Prop({ type: [LeadSubmissionSchema], default: undefined })
  submissions?: LeadSubmission[];

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  whatsappJoinedAt?: Date;

  @Prop()
  registeredAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

/*
  El correo identifica al lead. Antes la llave única era `email + phoneE164`,
  con lo que la misma persona volviendo con otro número abría una ficha nueva y
  su interés quedaba repartido en dos filas. El teléfono de cada envío se
  conserva en `submissions`.

  Al desplegar hay que borrar el índice viejo `email_1_phoneE164_1`: Mongoose
  crea los índices nuevos pero nunca elimina los que dejaron de declararse. Lo
  hace `npm run leads:merge-by-email`.
*/
LeadSchema.index({ email: 1 }, { unique: true });
LeadSchema.index({ createdAt: -1 });
