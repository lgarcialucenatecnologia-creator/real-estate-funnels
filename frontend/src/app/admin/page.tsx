"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ApiError } from "@/lib/api";
import {
  fetchAllLeadsForExport,
  fetchCampaigns,
  fetchLeads,
  fetchStats,
  fetchWhatsappGroups,
  submissionCountOf,
  NO_GROUP,
  type AdminLead,
  type CampaignSummary,
  type LeadSort,
  type WhatsappGroupSummary,
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
  const [onlyReturning, setOnlyReturning] = useState(false);
  const [groups, setGroups] = useState<WhatsappGroupSummary[]>([]);
  const [groupsWithout, setGroupsWithout] = useState(0);
  /*
    `undefined` = todavía no sabemos cuál es el grupo activo, así que aún no se
    piden leads: evita cargar la lista completa y luego reemplazarla por la
    filtrada. `""` = todos los grupos.
  */
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    undefined,
  );
  const [sort, setSort] = useState<LeadSort>("recent");
  /** Fila cuyo historial de inscripciones está desplegado, si hay alguna. */
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  /** Total sin filtrar, para comparar contra `total` (que sí respeta el filtro). */
  const [grandTotal, setGrandTotal] = useState<number | null>(null);
  /** Cuántos leads se inscribieron más de una vez, sin filtrar. */
  const [returningTotal, setReturningTotal] = useState<number | null>(null);

  const hasActiveFilter =
    selectedCampaign !== null ||
    dateFrom !== "" ||
    dateTo !== "" ||
    onlyReturning ||
    Boolean(selectedGroup);

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

    fetchWhatsappGroups(token)
      .then(({ items, withoutGroup, active }) => {
        setGroups(items);
        setGroupsWithout(withoutGroup);
        // El grupo del .env es el de la semana en curso: arranca filtrado por
        // él. Si no hay ninguno configurado, se muestran todos.
        setSelectedGroup(active?.code ?? "");
      })
      .catch(() => {
        // Sin la lista de grupos el dashboard sigue sirviendo: simplemente
        // arranca sin filtrar por cohorte.
        setSelectedGroup("");
      });
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetchStats(token)
      .then(({ total: statsTotal, returning }) => {
        setGrandTotal(statsTotal);
        setReturningTotal(returning);
      })
      .catch(() => {
        // No es crítico para la pantalla: sin esto solo no se muestra la
        // comparación "de X en total", el resto sigue funcionando igual.
      });
  }, [token]);

  useEffect(() => {
    if (!token || selectedGroup === undefined) return;

    let cancelled = false;

    const load = () => {
      setIsLoading(true);
      setError(null);

      const filters = {
        campaign: selectedCampaign,
        dateFrom,
        dateTo,
        onlyReturning,
        sort,
        whatsappGroup: selectedGroup,
      };
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
  }, [
    token,
    page,
    limit,
    selectedCampaign,
    dateFrom,
    dateTo,
    onlyReturning,
    sort,
    selectedGroup,
    router,
  ]);

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
    setOnlyReturning(false);
    setSelectedGroup("");
    setPage(1);
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setPage(1);
  };

  const handleOnlyReturningChange = (value: boolean) => {
    setOnlyReturning(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value === "submissions" ? "submissions" : "recent");
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
        onlyReturning,
        sort,
        whatsappGroup: selectedGroup,
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
            {returningTotal !== null && returningTotal > 0 && (
              <button
                type="button"
                onClick={() => {
                  handleOnlyReturningChange(true);
                  handleSortChange("submissions");
                }}
                className="font-body mt-1 text-sm text-gold underline-offset-4 transition-colors hover:underline"
              >
                {returningTotal} se {returningTotal === 1 ? "inscribió" : "inscribieron"}{" "}
                más de una vez →
              </button>
            )}
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
              htmlFor="group-filter"
              className="font-heading text-xs font-semibold tracking-[0.18em] text-ivory/70 uppercase"
            >
              Grupo de WhatsApp
            </label>
            <select
              id="group-filter"
              value={selectedGroup ?? ""}
              onChange={(event) => handleGroupChange(event.target.value)}
              className="h-11 min-w-[15rem] rounded-lg border border-white/10 bg-nocturne/60 px-3 font-body text-sm text-ivory outline-none focus:border-gold/50"
            >
              <option value="">Todos los grupos</option>
              {groups.map((group) => (
                <option key={group.code} value={group.code}>
                  {group.label} ({group.count})
                </option>
              ))}
              {groupsWithout > 0 && (
                <option value={NO_GROUP}>Sin grupo ({groupsWithout})</option>
              )}
            </select>
          </div>

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

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sort-order"
              className="font-heading text-xs font-semibold tracking-[0.18em] text-ivory/70 uppercase"
            >
              Ordenar por
            </label>
            <select
              id="sort-order"
              value={sort}
              onChange={(event) => handleSortChange(event.target.value)}
              className="h-11 rounded-lg border border-white/10 bg-nocturne/60 px-3 font-body text-sm text-ivory outline-none focus:border-gold/50"
            >
              <option value="recent">Más recientes</option>
              <option value="submissions">Más inscripciones</option>
            </select>
          </div>

          <label className="flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-4 font-body text-sm text-ivory/80 transition-colors hover:border-white/20">
            <input
              type="checkbox"
              checked={onlyReturning}
              onChange={(event) =>
                handleOnlyReturningChange(event.target.checked)
              }
              className="size-4 accent-gold"
            />
            Solo reinscritos
          </label>

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
          <table className="w-full min-w-[1220px] border-collapse text-left">
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
                leads.map((lead) => {
                  const submissions = submissionCountOf(lead);
                  const isReturning = submissions > 1;
                  const isExpanded = expandedLeadId === lead._id;
                  const history = lead.submissions ?? [];

                  return (
                  <Fragment key={lead._id}>
                  <tr
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 font-body text-sm whitespace-nowrap text-ivory/80">
                      {dateFormatter.format(new Date(lead.createdAt))}
                    </td>
                    <td className="px-4 py-3 font-body text-sm whitespace-nowrap text-ivory/70">
                      {lead.whatsappGroup?.label ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {/*
                        El contador es el gancho para ver el detalle, pero solo
                        se vuelve botón si hay historial que mostrar: los leads
                        anteriores a la migración no lo tienen.
                      */}
                      {history.length > 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedLeadId(isExpanded ? null : lead._id)
                          }
                          aria-expanded={isExpanded}
                          title="Ver el detalle de cada inscripción"
                          className={`flex min-w-9 items-center justify-center gap-1 rounded-full px-2.5 py-1 font-heading text-xs font-bold transition-colors ${
                            isReturning
                              ? "bg-gold text-obsidian hover:brightness-110"
                              : "border border-white/15 text-ivory/70 hover:border-white/30"
                          }`}
                        >
                          {submissions}
                          <span aria-hidden="true" className="text-[9px]">
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </button>
                      ) : (
                        <span
                          className={`flex min-w-9 items-center justify-center rounded-full px-2.5 py-1 font-heading text-xs font-bold ${
                            isReturning
                              ? "bg-gold text-obsidian"
                              : "border border-white/15 text-ivory/70"
                          }`}
                        >
                          {submissions}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-body text-sm whitespace-nowrap text-ivory/80">
                      {lead.lastSubmittedAt
                        ? dateFormatter.format(new Date(lead.lastSubmittedAt))
                        : "—"}
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
                    {UTM_KEYS.map((key) => {
                      const value = lead.tracking?.[key];

                      return (
                        <td
                          key={key}
                          className="px-4 py-3 font-body text-sm text-ivory/70"
                        >
                          {/* Los UTM de Meta traen valores muy largos (ids de
                              anuncio, nombres de creativo). Sin recorte empujan
                              utm_content y utm_term fuera de la pantalla. */}
                          <span
                            title={value}
                            className="block max-w-[18ch] truncate"
                          >
                            {value ?? "—"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {isExpanded && (
                    <tr className="border-b border-white/5 bg-obsidian/60">
                      <td colSpan={COLUMNS.length} className="px-4 py-4">
                        <p className="font-heading text-xs tracking-[0.18em] text-gold uppercase">
                          Historial de inscripciones
                        </p>
                        <ol className="mt-3 flex flex-col gap-2">
                          {history.map((submission, index) => (
                            <li
                              key={`${submission.at}-${index}`}
                              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-l-2 border-gold/40 pl-3 font-body text-sm text-ivory/75"
                            >
                              <span className="font-heading text-xs text-gold">
                                #{index + 1}
                              </span>
                              <span className="whitespace-nowrap">
                                {dateFormatter.format(new Date(submission.at))}
                              </span>
                              {submission.phoneE164 && (
                                <span className="text-ivory/60">
                                  {submission.phoneE164}
                                </span>
                              )}
                              <span className="text-ivory/60">
                                {submission.tracking?.utm_campaign ??
                                  "sin campaña"}
                              </span>
                              {submission.whatsappGroup && (
                                <span className="rounded-full border border-gold/30 px-2 text-xs text-gold">
                                  {submission.whatsappGroup.label}
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </td>
                    </tr>
                  )}
                  </Fragment>
                  );
                })
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
