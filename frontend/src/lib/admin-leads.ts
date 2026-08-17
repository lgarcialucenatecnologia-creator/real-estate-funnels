import { COUNTRIES } from "./countries";
import { submissionCountOf, type AdminLead } from "./admin-api";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/** Encabezados en el mismo orden que las columnas de la tabla en pantalla. */
export const EXPORT_COLUMNS = [
  "Fecha",
  "Grupo",
  "Inscripciones",
  "Última inscripción",
  "Nombre",
  "Apellido",
  "Correo",
  "Teléfono",
  "País",
  ...UTM_KEYS,
];

export const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "short",
  timeStyle: "short",
});

export const countryName = (code: string) =>
  COUNTRIES.find((country) => country.code === code)?.name ?? code;

/**
 * Misma fecha/país/teléfono que ya se ve en pantalla. A diferencia de la
 * tabla, los UTM vacíos quedan como cadena vacía (no "—"): en una hoja de
 * cálculo un guion no es lo mismo que una celda vacía para filtrar/ordenar.
 */
export function toExportRow(lead: AdminLead): string[] {
  return [
    dateFormatter.format(new Date(lead.createdAt)),
    lead.whatsappGroup?.label ?? "",
    String(submissionCountOf(lead)),
    lead.lastSubmittedAt
      ? dateFormatter.format(new Date(lead.lastSubmittedAt))
      : "",
    lead.firstName,
    lead.lastName,
    lead.email,
    `${lead.dialCode} ${lead.phoneNumber}`,
    countryName(lead.countryCode),
    ...UTM_KEYS.map((key) => lead.tracking?.[key] ?? ""),
  ];
}
