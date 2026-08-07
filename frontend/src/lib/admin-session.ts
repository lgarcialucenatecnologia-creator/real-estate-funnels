export const ADMIN_SESSION_KEY = "luifer-admin-session";

const listeners = new Set<() => void>();

/** Notifica a los hooks suscritos: `sessionStorage` no emite eventos en la misma pestaña. */
const notify = () => listeners.forEach((listener) => listener());

export function subscribeToAdminSession(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function saveAdminToken(token: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, token);
  notify();
}

export function readAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY);
}

export function clearAdminToken() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  notify();
}
