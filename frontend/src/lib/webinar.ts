/**
 * Copy y datos editables del webinar.
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

export const heroDatesLine = `Evento 100% online y gratuito | ${WEBINAR_DATES} a las ${WEBINAR_TIME} (Hora Colombia)`;

export const webinarDatesLine = `Guarda estas fechas: ${WEBINAR_DATES} a las ${WEBINAR_TIME} (Hora Colombia)`;

export const learningsDatesLine = `Esto es exactamente lo que te voy a enseñar paso a paso el ${WEBINAR_DATES} a las ${WEBINAR_TIME} (Hora Colombia).`;

export const PROFILES = [
  {
    title: "Profesionales e Independientes con Ahorros",
    description:
      "Tienen un capital guardado y quieren ponerlo en inversiones seguras que no les quiten el sueño ni se devalúen.",
  },
  {
    title: "Compradores que Quieren Invertir Seguro",
    description:
      "Tienen capacidad de crédito o cuota mensual, pero les da miedo equivocarse, meterse en un mal negocio o pagar de más.",
  },
  {
    title: "Cazadores de Oportunidades y Cesiones",
    description:
      "Quieren aprender a encontrar personas o constructoras con necesidad de vender rápido para comprar con descuentos de 20 a 40 millones.",
  },
  {
    title: "Personas que Buscan Tranquilidad y Respaldo",
    description:
      "Quieren dejar de inventar en cosas raras que no entienden y asegurar el techo y el futuro de su familia con propiedades reales.",
  },
] as const;

export const LEARNINGS = [
  {
    title: "Ordena tu plata y define tu límite",
    description:
      "Aprende a calcular exactamente cuánto dinero puedes comprometer sin quedar ahogado, dejando siempre una plata de seguridad intocable para dormir en paz.",
  },
  {
    title: "El Filtro de 15 Minutos para descartar engaños",
    description:
      "Cómo revisar los precios de la zona, detectar si un apartamento está sobrevalorado y saber en minutos si una preventa o cesión de derechos vale la pena o es una trampa.",
  },
  {
    title: "Negociación para ganar al comprar",
    description:
      "Los guiones y argumentos exactos para hacer ofertas por debajo de la mesa y lograr que el vendedor te baje entre 20 y 40 millones sin pelear ni ofenderlo.",
  },
  {
    title: "Revisa antes de soltar un solo peso",
    description:
      "La lista de papeles, deudas y riesgos que debes revisar antes de firmar cualquier promesa o entregar un anticipo para que nunca te estafen.",
  },
] as const;

export const FILTER_MATRIX = [
  {
    no: "Prefieres seguir comprando inmuebles por emoción o porque la sala de ventas se ve bonita, arriesgando los ahorros de tu vida.",
    yes: "Tienes ahorros o capacidad de pago y quieres meter tu plata en inversiones refugio que te den tranquilidad.",
  },
  {
    no: "Buscas fórmulas mágicas de hacerte rico de la noche a la mañana o meterte en negocios raros que no entiendes.",
    yes: "Quieres aprender un método simple y comprobado para comprar inmuebles baratos con números claros sobre la mesa.",
  },
  {
    no: "Te da pena negociar y prefieres pagar el precio completo que te pide el vendedor en internet.",
    yes: "Quieres aprender a pararte firme en la mesa para sacarle entre 20 a 40 millones de descuento a tu próxima compra.",
  },
  {
    no: "Prefieres dejar tu plata perdiendo valor quieta en el banco por miedo a dar el paso.",
    yes: "Eres una persona decidida que quiere aprender a invertir sobre seguro para respaldar el futuro de su familia.",
  },
] as const;

/** Cifras de autoridad, derivadas del copy real de MENTOR_POINTS abajo. */
export const MENTOR_STATS = [
  { value: 15, suffix: "", label: "Años comprando y vendiendo" },
  { value: 75, suffix: "+", label: "Operaciones reales de compraventa" },
  { value: 20, suffix: "-40M", label: "De descuento en tu próxima compra" },
] as const;

export const MENTOR_POINTS = [
  "Inversionista inmobiliario activo y creador del Método OPORTUNO.",
  "He realizado más de 75 operaciones de compra y venta de inmuebles en los últimos 15 años.",
  "Me quebré dos veces. Pasé de vender 5.000 ensaladas de frutas al mes sin tener un peso en el bolsillo y lavar carros en la calle, a entender que la tranquilidad financiera se construye con cosas básicas y seguras.",
  "He acompañado a cientos de personas a tomar decisiones inteligentes con su dinero sin enredos técnicos.",
] as const;

export const AGENDA = [
  {
    badge: "Clase 1",
    day: "Próximo Jueves",
    title: "Diagnóstico y Filtro de Oportunidades",
    description:
      "Cómo ordenar tus cuentas, calcular tu plata de seguridad y aplicar el filtro de 15 minutos para encontrar propiedades baratas y descartar malas opciones.",
  },
  {
    badge: "Clase 2",
    day: "Próximo Viernes",
    title: "El Secreto para Comprar Barato y Negociar",
    description:
      "El paso a paso para negociar de 20 a 40 millones de descuento, blindar tus contratos y trazar tu plan para ejecutar con seguridad.",
  },
] as const;
