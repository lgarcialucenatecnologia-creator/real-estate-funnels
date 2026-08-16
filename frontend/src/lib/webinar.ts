/**
 * Copy y datos editables del webinar — variante para colombianos en el exterior.
 * Cambia la hora con NEXT_PUBLIC_WEBINAR_TIME (ej. "11:00 a.m.").
 */
export const WEBINAR_TIME =
  process.env.NEXT_PUBLIC_WEBINAR_TIME?.trim() || "11:00 a.m.";

/**
 * Fechas que se muestran en la insignia del hero.
 * Cámbialas con NEXT_PUBLIC_WEBINAR_DATES (ej. "14 y 15 de agosto").
 * Va en minúscula porque se intercala dentro de frases; los sitios que la
 * muestran como titulillo ya aplican `uppercase` por CSS.
 */
export const WEBINAR_DATES =
  process.env.NEXT_PUBLIC_WEBINAR_DATES?.trim() || "próximo jueves y viernes";

/**
 * La audiencia de esta landing está repartida entre husos horarios, así que la
 * hora siempre se anuncia con su referencia. Cámbiala con
 * NEXT_PUBLIC_WEBINAR_TIMEZONE si la transmisión se ancla a otra zona.
 */
export const WEBINAR_TIMEZONE =
  process.env.NEXT_PUBLIC_WEBINAR_TIMEZONE?.trim() ||
  "Hora Colombia / Este de EE.UU.";

export const heroDatesLine = `Clase 100% online y gratuita | ${WEBINAR_DATES} a las ${WEBINAR_TIME} (${WEBINAR_TIMEZONE})`;

export const webinarDatesLine = `Guarda estas fechas: ${WEBINAR_DATES} a las ${WEBINAR_TIME} (${WEBINAR_TIMEZONE})`;

export const learningsDatesLine = `Aprende a invertir en Colombia desde cualquier lugar de EE.UU. el ${WEBINAR_DATES} a las ${WEBINAR_TIME} (${WEBINAR_TIMEZONE}).`;

export const PROFILES = [
  {
    title: "Colombianos con Ahorros en Dólares",
    description:
      "Que quieren aprovechar el poder del dólar en Colombia para comprar propiedades seguras sin intermediarios que les inflen los precios.",
  },
  {
    title: "Los que Sueñan con Regresar a Colombia",
    description:
      'Que llevan años diciendo "voy por dos años y me devuelvo" y necesitan construir una base económica sólida para volver a vivir tranquilos con su familia.',
  },
  {
    title: "Los que Envían Remesas Constantemente",
    description:
      "Que quieren cambiar la dinámica de solo mandar plata para gastos de consumo y prefieren dejarle a su familia activos y techos propios que de verdad renten.",
  },
  {
    title: "Inversionistas a Distancia que Exigen Seguridad",
    description:
      "Que necesitan aprender a revisar papeles, deudas y contratos en Colombia sin tener que viajar, para no caer en trampas ni perder su capital.",
  },
] as const;

export const LEARNINGS = [
  {
    title: "Convierte tus dólares en respaldo real",
    description:
      "Cómo presupuestar tus envíos de dinero sin descapitalizarte en Estados Unidos, asegurando siempre una reserva intocable de seguridad.",
  },
  {
    title: 'Detecta el "Precio de Extranjero" y las Cesiones',
    description:
      "Cómo comparar precios reales de cualquier ciudad de Colombia por internet y encontrar cesiones urgentes de personas que necesitan vender ya mismo con descuentos gigantes.",
  },
  {
    title: "Negocia a distancia como si estuvieras en Colombia",
    description:
      "Aprende los guiones y condiciones exactas para negociar con constructoras o propietarios y ganarte de 20 a 40 millones en la mesa de compra.",
  },
  {
    title: "Blindaje legal y revisión sin viajar",
    description:
      "Los documentos claves (certificados, paz y salvos, escrituras) que debes exigir antes de transferir un solo dólar para que tu inversión esté 100% protegida.",
  },
] as const;

export const FILTER_MATRIX = [
  {
    no: "Estás cómodo mandando dólares a Colombia para que se gasten en mercado y cosas que no dejan nada a futuro.",
    yes: "Quieres que el sacrificio de tus jornadas en Estados Unidos se convierta en propiedades reales a tu nombre.",
  },
  {
    no: "Prefieres comprar a ciegas lo primero que te ofrezca un conocido o pagar el sobreprecio que le ponen al que vive afuera.",
    yes: "Quieres aprender a revisar los números reales de cualquier propiedad en Colombia y negociar con fuerza.",
  },
  {
    no: "Buscas negocios mágicos por internet o promesas de hacerte millonario sin entender en qué estás metiendo tu plata.",
    yes: "Buscas inversiones refugio, sencillas y seguras, de esas que te dejan dormir tranquilo por las noches.",
  },
  {
    no: "Te resignaste a pasar toda la vida en Estados Unidos trabajando sin armar un plan para volver a tu tierra.",
    yes: "Tienes la meta clara de regresar a Colombia a vivir bien, estar con tu familia y tener respaldo financiero.",
  },
] as const;

/** Cifras de autoridad, derivadas del copy real de MENTOR_POINTS abajo. */
export const MENTOR_STATS = [
  { value: 15, suffix: "", label: "Años comprando y vendiendo" },
  { value: 75, suffix: "+", label: "Operaciones reales de compraventa" },
  { value: 20, suffix: "-40M", label: "De ganancia al momento de comprar" },
] as const;

export const MENTOR_POINTS = [
  "Inversionista inmobiliario en Colombia, mentor y creador del Método OPORTUNO.",
  "Más de 75 operaciones reales de compra y venta de inmuebles en los últimos 15 años.",
  "Conozco el valor del trabajo duro: me quebré dos veces, vendí 5.000 ensaladas de frutas al mes sin tener para comer y lavé carros en la calle antes de entender cómo funciona el dinero de verdad.",
  "He ayudado a decenas de colombianos en el exterior a invertir con cabeza fría en su país sin dejarse tumbar.",
] as const;

export const AGENDA = [
  {
    badge: "Clase 1",
    day: "Próximo Jueves",
    title: "Filtro Antiextranjero y Oportunidades Ocultas",
    description:
      "Cómo buscar en Colombia desde USA, descartar precios inflados y encontrar cesiones urgentes con números fríos.",
  },
  {
    badge: "Clase 2",
    day: "Próximo Viernes",
    title: "El Secreto para Comprar Barato y Plan de Retorno",
    description:
      "Cómo negociar a distancia para ganarte de 20 a 40 millones al comprar y estructurar tus inversiones para volver a vivir sabroso.",
  },
] as const;
