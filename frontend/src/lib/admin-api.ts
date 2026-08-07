import { request } from "./api";
import type { LeadStage } from "./api";

/**
 * `GET /leads` devuelve el documento crudo de Mongo (no el `Lead` reducido
 * que usa el flujo público de captura), incluye todo lo que guarda el
 * schema del backend.
 */
export interface AdminLead {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  dialCode: string;
  phoneNumber: string;
  phoneE164: string;
  stage: LeadStage;
  tracking: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsPage {
  items: AdminLead[];
  total: number;
  page: number;
  limit: number;
}

export const adminLogin = (password: string) =>
  request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });

export const fetchLeads = (token: string, page: number, limit: number) =>
  request<LeadsPage>(`/leads?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
