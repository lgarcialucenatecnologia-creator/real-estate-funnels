"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ApiError } from "@/lib/api";
import {
  fetchAllLeadsForExport,
  fetchCampaigns,
  fetchLeads,
  fetchStats,
  type AdminLead,
  type CampaignSummary,
} from "@/lib/admin-api";
import {
  countryName,
  dateFormatter,
  EXPORT_COLUMNS as COLUMNS,
  UTM_KEYS,
} from "@/lib/admin-leads";
import { clearAdminToken } from "@/lib/admin-session";
import {
  downloadLeadsCsv,
  downloadLeadsPdf,
  downloadLeadsXlsx,
} from "@/lib/leads-export";
import { useAdminSession } from "@/lib/use-admin-session";

type ExportFormat = "csv" | "xlsx" | "pdf";
type PageLimit = 25 | 50 | 100 | "all";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { token, isReady } = useAdminSession();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<PageLimit>(25);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(
    null,
  );

  const [campaigns, setCampaigns] = useState<CampaignSummary[] | null>(null);
  // null = "todas las campañas" (el default).
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(
    null,
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  /** Total sin filtrar, para comparar contra `total` (que sí respeta el filtro). */
  const [grandTotal, setGrandTotal] = useState<number | null>(null);

  const hasActiveFilter =
    selectedCampaign !== null || dateFrom !== "" || dateTo !== "";

  useEffect(() => {
    if (!isReady) return;
    if (!token) router.replace("/admin/login");
  }, [isReady, token, router]);

  useEffect(() => {
    if (!token) return;

    fetchCampaigns(token)
      .then(({ items }) => setCampaigns(items))
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) {
          clearAdminToken();
          router.replace("/admin/login");
          return;
        }
        // Si falla la lista de campañas no bloqueamos el dashboard: el filtro
        // simplemente queda sin opciones para elegir.
        setCampaigns([]);
      });
  }, [token, router]);

  useEffect(() => {
    if (!token) return;

    fetchStats(token)
      .then(({ total: statsTotal }) => setGrandTotal(statsTotal))
      .catch(() => {
        // No es crítico para la pantalla: sin esto solo no se muestra la
        // comparación "de X en total", el resto sigue funcionando igual.
      });
  }, [token]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const load = () => {
      setIsLoading(true);
      setError(null);

      const filters = { campaign: selectedCampaign, dateFrom, dateTo };
      const request =
        limit === "all"
          ? fetchAllLeadsForExport(token, filters).then(({ items }) => ({
              items,
              total: items.length,
            }))
          : fetchLeads(token, page, limit, filters);

      request
        .then((data) => {
          if (cancelled) return;
          setLeads(data.items);
          setTotal(data.total);
        })
        .catch((err: unknown) => {
          if (cancelled) return;

          if (err instanceof ApiError && err.status === 401) {
            clearAdminToken();
            router.replace("/admin/login");
            return;
          }

          setError(
            err instanceof ApiError
              ? err.message
              : "Ocurrió un error inesperado. Inténtalo de nuevo.",
          );
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [token, page, limit, selectedCampaign, dateFrom, dateTo, router]);

  const handleLogout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  const handleCampaignChange = (value: string) => {
    setSelectedCampaign(value === "" ? null : value);
    setPage(1);
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    setPage(1);
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    setPage(1);
  };

  const handleLimitChange = (value: string) => {
    setLimit(value === "all" ? "all" : (Number(value) as PageLimit));
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCampaign(null);
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const handleExport = async (format: ExportFormat) => {
    if (!token || exportingFormat) return;

    setExportingFormat(format);
    setError(null);

    try {
      const { items } = await fetchAllLeadsForExport(token, {
        campaign: selectedCampaign,
        dateFrom,
        dateTo,
      });

      if (format === "csv") downloadLeadsCsv(items);
      else if (format === "pdf") downloadLeadsPdf(items);
      else await downloadLeadsXlsx(items, token);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAdminToken();
        router.replace("/admin/login");
        return;
      }

      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo generar el archivo. Inténtalo de nuevo.",
      );
    } finally {
      setExportingFormat(null);
    }
  };

  if (!isReady || !token) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-obsidian">
        <p className="font-body text-graphite">Cargando...</p>
      </div>
    );
  }

  const totalPages =
    limit === "all" ? 1 : Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-dvh bg-obsidian px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4">
          <BrandMark compact />
          <button
            type="button"
            onClick={handleLogout}
            className="font-heading text-xs font-semibold tracking-[0.18em] text-graphite uppercase transition-colors hover:text-ivory"
          >
            Cerrar sesión
          </button>
        </header>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-black text-ivory italic uppercase [font-stretch:condensed] sm:text-3xl">
              Leads del funnel
            </h1>
            <p className="font-body mt-1 text-sm text-graphite">
              {total} lead{total === 1 ? "" : "s"}
              {hasActiveFilter ? " con los filtros aplicados" : " capturados en total"}
              {hasActiveFilter && grandTotal !== null ? ` (de ${grandTotal} en total)` : ""}
              .
            </p>
          </div>

          <div className="flex gap-2">
            {(["csv", "xlsx", "pdf"] as const).map((format) => (
              <button
                key={format}
                type="button"
                disabled={exportingFormat !== null}
                onClick={() => handleExport(format)}
                className="rounded-lg border border-gold/40 px-4 py-2 font-heading text-xs font-bold text-gold uppercase transition-colors hover:border-gold hover:bg-gold/10 disabled:opacity-40"
              >
                {exportingFormat === format
                  ? "Generando..."
                  : `Exportar ${format.toUpperCase()}`}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="campaign-filter"
              className="font-heading text-xs font-semibold tracking-[0.18em] text-ivory/70 uppercase"
            >
              Campaña
            </label>
            <select
              id="campaign-filter"
              value={selectedCampaign ?? ""}
              onChange={(event) => handleCampaignChange(event.target.value)}
              className="h-11 rounded-lg border border-white/10 bg-nocturne/60 px-3 font-body text-sm text-ivory outline-none focus:border-gold/50"
            >
              <option value="">Todas las campañas</option>
              {(campaigns ?? []).map((item) => (
                <option key={item.campaign} value={item.campaign}>
                  {item.campaign} ({item.count})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="date-from"
              className="font-heading text-xs font-semibold tracking-[0.18em] text-ivory/70 uppercase"
            >
              Desde
            </label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(event) => handleDateFromChange(event.target.value)}
              className="h-11 rounded-lg border border-white/10 bg-nocturne/60 px-3 font-body text-sm text-ivory outline-none focus:border-gold/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="date-to"
              className="font-heading text-xs font-semibold tracking-[0.18em] text-ivory/70 uppercase"
            >
              Hasta
            </label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(event) => handleDateToChange(event.target.value)}
              className="h-11 rounded-lg border border-white/10 bg-nocturne/60 px-3 font-body text-sm text-ivory outline-none focus:border-gold/50"
            />
          </div>

          <button
            type="button"
            onClick={handleClearFilters}
            className="h-11 rounded-lg border border-white/10 px-4 font-heading text-xs font-bold text-graphite uppercase transition-colors hover:border-white/20 hover:text-ivory"
          >
            Limpiar filtros
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 font-body text-sm text-ivory"
          >
            {error}
          </div>
        )}

        <div className="surface-card mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10">
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 font-heading text-xs font-bold tracking-[0.08em] text-gold whitespace-nowrap uppercase"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-8 text-center font-body text-sm text-graphite"
                  >
                    Cargando leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-8 text-center font-body text-sm text-graphite"
                  >
                    Todavía no hay leads.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 font-body text-sm whitespace-nowrap text-ivory/80">
                      {dateFormatter.format(new Date(lead.createdAt))}
                    </td>
                    <td className="px-4 py-3 font-body text-sm whitespace-nowrap text-ivory">
                      {lead.firstName}
                    </td>
                    <td className="px-4 py-3 font-body text-sm whitespace-nowrap text-ivory">
                      {lead.lastName}
                    </td>
                    <td className="px-4 py-3 font-body text-sm whitespace-nowrap text-ivory/80">
                      {lead.email}
                    </td>
                    <td className="px-4 py-3 font-body text-sm whitespace-nowrap text-ivory/80">
                      {lead.dialCode} {lead.phoneNumber}
                    </td>
                    <td className="px-4 py-3 font-body text-sm whitespace-nowrap text-ivory/80">
                      {countryName(lead.countryCode)}
                    </td>
                    {UTM_KEYS.map((key) => (
                      <td
                        key={key}
                        className="px-4 py-3 font-body text-sm whitespace-nowrap text-ivory/70"
                      >
                        {lead.tracking?.[key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="font-body text-xs text-graphite">
              Página {page} de {totalPages}
            </p>
            <select
              value={limit}
              onChange={(event) => handleLimitChange(event.target.value)}
              className="h-9 rounded-lg border border-white/10 bg-nocturne/60 px-2 font-body text-xs text-ivory outline-none focus:border-gold/50"
            >
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
              <option value="all">Todos</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-white/10 px-4 py-2 font-heading text-xs font-bold text-ivory uppercase transition-colors hover:border-white/20 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-white/10 px-4 py-2 font-heading text-xs font-bold text-ivory uppercase transition-colors hover:border-white/20 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
