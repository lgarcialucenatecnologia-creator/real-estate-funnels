export type LeadStage =
  | "captured"
  | "progress_viewed"
  | "whatsapp_joined"
  | "registered";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneE164: string;
  stage: LeadStage;
  createdAt: string;
}

export interface CreateLeadResponse {
  lead: Lead;
  nextStep: {
    progressPercentage: number;
    whatsappGroupUrl: string;
  };
}

export interface CreateLeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  dialCode: string;
  phoneNumber: string;
  tracking?: Record<string, string>;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
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
      : (body?.message ?? "Ocurrió un error inesperado. Inténtalo de nuevo.");

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export const createLead = (payload: CreateLeadPayload) =>
  request<CreateLeadResponse>("/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateLeadStage = (id: string, stage: LeadStage) =>
  request<Lead>(`/leads/${id}/stage`, {
    method: "PATCH",
    body: JSON.stringify({ stage }),
  });
