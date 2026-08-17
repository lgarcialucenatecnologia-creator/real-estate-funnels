import { API_URL, ApiError, request } from "./api";
import type { LeadStage } from "./api";

/**
 * `GET /leads` devuelve el documento crudo de Mongo (no el `Lead` reducido
 * que usa el flujo público de captura), incluye todo lo que guarda el
 * schema del backend.
 */
/**
 * Grupo de WhatsApp al que se envió al lead. Como el enlace se cambia cada
 * semana, identifica la cohorte de captación.
 */
export interface WhatsappGroup {
  code: string;
  label: string;
}

/** Una entrada por cada vez que el lead envió el formulario. */
export interface LeadSubmission {
  at: string;
  phoneE164?: string;
  tracking?: Record<string, string>;
  whatsappGroup?: WhatsappGroup;
}

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
  /**
   * Opcionales: los leads capturados antes de que existiera el historial no
   * los traen hasta que corre la migración `leads:merge-by-email`.
   */
  submissionCount?: number;
  lastSubmittedAt?: string;
  submissions?: LeadSubmission[];
  /** Último grupo al que entró; el filtro usa el historial, no este campo. */
  whatsappGroup?: WhatsappGroup;
  createdAt: string;
  updatedAt: string;
}

/** Un lead sin `submissionCount` es de antes del contador: cuenta como 1. */
export const submissionCountOf = (lead: AdminLead): number =>
  lead.submissionCount ?? 1;

export interface LeadsPage {
  items: AdminLead[];
  total: number;
  page: number;
  limit: number;
}

export interface CampaignSummary {
  campaign: string;
  count: number;
  lastSeenAt: string;
}

/** `submissions` = los que más veces se inscribieron primero. */
export type LeadSort = "recent" | "submissions";

export interface LeadFilters {
  /** `null`/`undefined` = todas las campañas, sin filtrar por campaña. */
  campaign?: string | null;
  /** Fecha "YYYY-MM-DD"; vacío = sin límite. */
  dateFrom?: string;
  dateTo?: string;
  /** Deja solo los leads que se inscribieron más de una vez. */
  onlyReturning?: boolean;
  sort?: LeadSort;
  /** Código del grupo de WhatsApp; `NO_GROUP` = los que no tienen ninguno. */
  whatsappGroup?: string | null;
}

/** Valor del filtro para los leads capturados antes del etiquetado. */
export const NO_GROUP = "sin-grupo";

/** Arma el querystring de filtros, omitiendo lo que no venga definido. */
function filtersToQuery(filters: LeadFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.campaign) params.set("campaign", filters.campaign);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.onlyReturning) params.set("onlyReturning", "true");
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.whatsappGroup) params.set("whatsappGroup", filters.whatsappGroup);
  return params.toString();
}

export const adminLogin = (password: string) =>
  request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });

export const fetchLeads = (
  token: string,
  page: number,
  limit: number,
  filters: LeadFilters = {},
) =>
  request<LeadsPage>(
    `/leads?page=${page}&limit=${limit}&${filtersToQuery(filters)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

export const fetchAllLeadsForExport = (
  token: string,
  filters: LeadFilters = {},
) =>
  request<{ items: AdminLead[] }>(`/leads/export?${filtersToQuery(filters)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchCampaigns = (token: string) =>
  request<{ items: CampaignSummary[] }>("/leads/campaigns", {
    headers: { Authorization: `Bearer ${token}` },
  });

export interface WhatsappGroupSummary extends WhatsappGroup {
  count: number;
  lastSeenAt: string;
}

/** Cohortes semanales. `active` es el grupo del .env, que se preselecciona. */
export const fetchWhatsappGroups = (token: string) =>
  request<{
    items: WhatsappGroupSummary[];
    withoutGroup: number;
    active: WhatsappGroup | null;
  }>("/leads/whatsapp-groups", {
    headers: { Authorization: `Bearer ${token}` },
  });

/** Total sin filtrar, para comparar contra el total filtrado en pantalla. */
export const fetchStats = (token: string) =>
  request<{
    total: number;
    byStage: Record<string, number>;
    /** Leads que enviaron el formulario más de una vez. */
    returning: number;
  }>("/leads/stats", { headers: { Authorization: `Bearer ${token}` } });

/**
 * A diferencia del resto de este archivo, no usa `request()`: la respuesta
 * es un binario (.xlsx), no JSON, así que necesita su propio manejo.
 */
export async function exportLeadsXlsx(
  token: string,
  columns: string[],
  rows: string[][],
  filename: string,
): Promise<Blob> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/leads/export/xlsx`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ columns, rows, filename }),
    });
  } catch {
    throw new ApiError(
      "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
      0,
    );
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(body?.message)
      ? body.message[0]
      : (body?.message ?? "No se pudo generar el archivo Excel.");

    throw new ApiError(message, response.status);
  }

  return response.blob();
}
