/*
  Wrapper del pixel de Meta. El base code vive en `app/layout.tsx`; aquí solo
  se disparan eventos. Todo es no-op si el pixel no cargó (ID sin configurar,
  bloqueador de anuncios), porque `window.fbq` simplemente no existe.
*/

/**
 * Eventos estándar de Meta que usa el funnel. Son los únicos que el trafficker
 * puede elegir como objetivo de optimización sin crear una conversión
 * personalizada en Events Manager — de ahí que `Lead` sea obligatorio.
 */
export type StandardEvent = "PageView" | "Lead" | "CompleteRegistration";

/**
 * Debe coincidir con EVENT_CONTENT_NAME del backend: si el navegador y la
 * Conversions API mandan parámetros distintos para el mismo evento, Events
 * Manager reporta discrepancia entre pixel y servidor.
 */
export const EVENT_CONTENT_NAME = "Webinar Método OPORTUNO";

/** ID compartido con el evento gemelo de la Conversions API, para que Meta deduplique. */
export function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // `randomUUID` exige contexto seguro; en http:// (pruebas en LAN) no existe.
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

const fire = (
  method: "track" | "trackCustom",
  name: string,
  params: Record<string, unknown>,
  eventId?: string,
) => {
  if (typeof window === "undefined" || !window.fbq) return;

  const args: unknown[] = [method, name, params];
  if (eventId) args.push({ eventID: eventId });
  window.fbq(...args);
};

export function trackEvent(
  name: StandardEvent,
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  fire("track", name, params, eventId);
}

export function trackCustomEvent(
  name: string,
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  fire("trackCustom", name, params, eventId);
}

const readCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
};

/**
 * Cookies que planta el propio pixel: `_fbp` identifica el navegador y `_fbc`
 * guarda el clic del anuncio con su timestamp real. Se mandan al backend para
 * que la Conversions API pueda emparejar el evento con la persona; sin ellas
 * Meta reporta calidad de emparejamiento baja.
 */
export function readMetaCookies(): Record<string, string> {
  const fbp = readCookie("_fbp");
  const fbc = readCookie("_fbc");

  return {
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
  };
}
