"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ApiError } from "@/lib/api";
import { fetchLeads, type AdminLead } from "@/lib/admin-api";
import { clearAdminToken } from "@/lib/admin-session";
import { COUNTRIES } from "@/lib/countries";
import { useAdminSession } from "@/lib/use-admin-session";

const LIMIT = 25;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const COLUMNS = [
  "Fecha",
  "Nombre",
  "Apellido",
  "Correo",
  "Teléfono",
  "País",
  ...UTM_KEYS,
];

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "short",
  timeStyle: "short",
});

const countryName = (code: string) =>
  COUNTRIES.find((country) => country.code === code)?.name ?? code;

export default function AdminDashboardPage() {
  const router = useRouter();
  const { token, isReady } = useAdminSession();

  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!token) router.replace("/admin/login");
  }, [isReady, token, router]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const load = () => {
      setIsLoading(true);
      setError(null);

      fetchLeads(token, page, LIMIT)
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
  }, [token, page, router]);

  const handleLogout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  if (!isReady || !token) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-obsidian">
        <p className="font-body text-graphite">Cargando...</p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

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

        <h1 className="font-display mt-6 text-2xl font-black text-ivory italic uppercase [font-stretch:condensed] sm:text-3xl">
          Leads del funnel
        </h1>
        <p className="font-body mt-1 text-sm text-graphite">
          {total} lead{total === 1 ? "" : "s"} capturados en total.
        </p>

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

        <div className="mt-4 flex items-center justify-between">
          <p className="font-body text-xs text-graphite">
            Página {page} de {totalPages}
          </p>
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
