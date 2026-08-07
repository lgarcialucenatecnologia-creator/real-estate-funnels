import type { CreateLeadResponse } from "./api";

export const FUNNEL_SESSION_KEY = "luifer-funnel-session";

export interface FunnelSession {
  leadId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneE164: string;
  progressPercentage: number;
  whatsappGroupUrl: string;
}

export const toFunnelSession = (
  response: CreateLeadResponse,
): FunnelSession => ({
  leadId: response.lead.id,
  firstName: response.lead.firstName,
  lastName: response.lead.lastName,
  email: response.lead.email,
  phoneE164: response.lead.phoneE164,
  progressPercentage: response.nextStep.progressPercentage,
  whatsappGroupUrl: response.nextStep.whatsappGroupUrl,
});

const listeners = new Set<() => void>();

/** Notifica a los hooks suscritos: `sessionStorage` no emite eventos en la misma pestaña. */
const notify = () => listeners.forEach((listener) => listener());

export function subscribeToFunnelSession(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function saveFunnelSession(session: FunnelSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(FUNNEL_SESSION_KEY, JSON.stringify(session));
  notify();
}

export function parseFunnelSession(raw: string | null): FunnelSession | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as FunnelSession;
  } catch {
    return null;
  }
}

export function readFunnelSession(): FunnelSession | null {
  if (typeof window === "undefined") return null;
  return parseFunnelSession(window.sessionStorage.getItem(FUNNEL_SESSION_KEY));
}

export function clearFunnelSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(FUNNEL_SESSION_KEY);
  notify();
}

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
];

export function readTrackingParams(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return TRACKING_KEYS.reduce<Record<string, string>>((acc, key) => {
    const value = params.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});
}
