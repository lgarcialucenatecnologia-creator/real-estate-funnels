import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { exportLeadsXlsx, type AdminLead } from "./admin-api";
import { EXPORT_COLUMNS, toExportRow } from "./admin-leads";

const todayStamp = () => new Date().toISOString().slice(0, 10);

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toCsvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Sin librería: el CSV es texto plano, no vale la pena una dependencia para esto. */
export function downloadLeadsCsv(leads: AdminLead[]) {
  const lines = [
    EXPORT_COLUMNS.map(toCsvCell).join(","),
    ...leads.map((lead) => toExportRow(lead).map(toCsvCell).join(",")),
  ];

  // El BOM al inicio es para que Excel abra los acentos como UTF-8, no como Latin-1.
  const blob = new Blob(["﻿" + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  triggerDownload(blob, `leads-${todayStamp()}.csv`);
}

/** El .xlsx real se construye en el backend; aquí solo se manda la data y se descarga la respuesta. */
export async function downloadLeadsXlsx(leads: AdminLead[], token: string) {
  const rows = leads.map(toExportRow);
  const filename = `leads-${todayStamp()}.xlsx`;
  const blob = await exportLeadsXlsx(token, EXPORT_COLUMNS, rows, filename);
  triggerDownload(blob, filename);
}

export function downloadLeadsPdf(leads: AdminLead[]) {
  const doc = new jsPDF({ orientation: "landscape" });

  autoTable(doc, {
    head: [EXPORT_COLUMNS],
    body: leads.map((lead) => toExportRow(lead)),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [215, 167, 46] },
  });

  doc.save(`leads-${todayStamp()}.pdf`);
}
