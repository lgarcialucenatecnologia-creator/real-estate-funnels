/**
 * Copy y datos editables del webinar.
 * Cambia la hora con NEXT_PUBLIC_WEBINAR_TIME (ej. "11:00 a.m.").
 */
export const WEBINAR_TIME =
  process.env.NEXT_PUBLIC_WEBINAR_TIME?.trim() || "11:00 a.m.";

/**
 * Fechas que se muestran en la insignia del hero.
 * Cámbialas con NEXT_PUBLIC_WEBINAR_DATES (ej. "14 y 15 de agosto").
 * Si la variable no está definida se cae al copy genérico anterior, para que
 * la landing nunca quede anunciando una fecha vacía.
 */
export const WEBINAR_DATES =
  process.env.NEXT_PUBLIC_WEBINAR_DATES?.trim() || "2 días en vivo";

export const webinarDatesLine = `Recuerda estas fechas: ${WEBINAR_DATES} a las ${WEBINAR_TIME} (Hora Colombia)`;

export const learningsDatesLine = `Estos son los aprendizajes clave que obtendrás al asistir a las 2 clases el ${WEBINAR_DATES} a las ${WEBINAR_TIME} (hora Colombia).`;

export const PROFILES = [
  {
    title: "Profesionales y Empresarios",
    description:
      "Que tienen ahorros o capital estancado y quieren protegerlo contra la inflación construyendo un patrimonio sólido sin especular.",
  },
  {
    title: "Inversionistas Principiantes",
    description:
      "Que cuentan con capacidad de pago o crédito pero no saben cómo filtrar oportunidades ni calcular la utilidad neta real.",
  },
  {
    title: "Compradores de Finca Raíz",
    description:
      "Que van a adquirir su próxima propiedad y buscan un sistema para negociar entre un 10% y un 20% por debajo del mercado real.",
  },
  {
    title: "Personas que Buscan Tranquilidad",
    description:
      "Que quieren dejar de improvisar en inversiones que no entienden para construir un legado blindado y seguro para su familia.",
  },
] as const;

export const LEARNINGS = [
  {
    title: "Diagnóstico Financiero y Liquidez",
    description:
      "Aprende a determinar tu presupuesto máximo, tu liquidez de seguridad y evita comprometer dinero en propiedades que después no puedas sostener.",
  },
  {
    title: "El Filtro de 15 Minutos",
    description:
      "Descubre cómo investigar comparables, detectar publicaciones infladas y evaluar si una preventa o cesión de derechos es un negocio real o solo marketing.",
  },
  {
    title: "Negociación con Números Fríos",
    description:
      "Domina el mapa de concesiones y los guiones para presentar ofertas estructuradas que te aseguren mínimo un 15% de descuento en la mesa.",
  },
  {
    title: "Expediente de Riesgos y Blindaje",
    description:
      "Identifica alertas jurídicas, físicas y financieras antes de entregar cualquier anticipo o firmar la promesa de compraventa.",
  },
] as const;

export const FILTER_MATRIX = [
  {
    no: 'Prefieres seguir comprando inmuebles por emoción o por lo bonito del "apartamento modelo", arriesgando los ahorros de tu vida.',
    yes: "Tienes ahorros o capacidad de inversión y estás listo para construir un portafolio sólido que te dé tranquilidad.",
  },
  {
    no: "Buscas fórmulas de dinero rápido, especulación inmobiliaria o rentabilidades milagrosas sin metodología.",
    yes: "Estás cansado de opciones sospechosas y quieres aprender a identificar verdaderas inversiones refugio.",
  },
  {
    no: "No estás dispuesto a dedicar 2 horas a aprender a leer números fríos y prefieres dejar tu utilidad en el bolsillo del vendedor.",
    yes: "Quieres aprender a negociar como un profesional para ganarte mínimo un 15% de descuento al momento de comprar.",
  },
  {
    no: "Te conformas con dejar tu dinero perdiendo valor en el banco por miedo a cometer un error al invertir.",
    yes: "Eres profesional, independiente o empresario y buscas un método claro para proteger tu patrimonio y a tu familia.",
  },
] as const;

/** Cifras de autoridad, derivadas del copy real de MENTOR_POINTS abajo. */
export const MENTOR_STATS = [
  { value: 15, suffix: "", label: "Años de trayectoria" },
  { value: 75, suffix: "+", label: "Operaciones de compraventa" },
  { value: 7, suffix: "+", label: "Inversiones patrimoniales" },
] as const;

export const MENTOR_POINTS = [
  "Inversionista inmobiliario activo, mentor financiero y creador del Método OPORTUNO.",
  "He ejecutado más de 75 operaciones de compraventa y más de 7 inversiones patrimoniales personales en los últimos 15 años.",
  "Quebré dos veces. Pasé de vender 5.000 ensaladas de frutas al mes sin tener para una hamburguesa y lavar carros en la calle, a desarrollar un método técnico para no volver a perder dinero.",
  "He acompañado a cientos de personas y empresas a estructurar decisiones financieras inteligentes.",
] as const;

export const AGENDA = [
  {
    badge: "Clase 1",
    day: "Jueves 13 de agosto",
    title: "Diagnóstico Financiero y Filtro de Oportunidades",
    description:
      "Cómo ordenar tu dinero, calcular tu liquidez de seguridad y aplicar el filtro de 15 minutos para descartar malas ofertas.",
  },
  {
    badge: "Clase 2",
    day: "Viernes 14 de agosto",
    title: "Negociación Estratégica y Blueprint Patrimonial",
    description:
      "El sistema para ganarte el 15% en la mesa de negociación, revisar riesgos legales y trazar tu plan de inversión a 90 días.",
  },
] as const;
