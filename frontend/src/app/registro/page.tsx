"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ProgressBar } from "@/components/funnel/progress-bar";
import { FunnelShell } from "@/components/layout/funnel-shell";
import { GoldButton } from "@/components/ui/gold-button";
import { WhatsappIcon } from "@/components/ui/whatsapp-icon";
import { updateLeadStage } from "@/lib/api";
import { useFunnelSession } from "@/lib/use-funnel-session";

export default function RegistroPage() {
  const router = useRouter();
  const { session, isReady } = useFunnelSession();

  useEffect(() => {
    if (!isReady) return;

    if (!session) {
      router.replace("/");
      return;
    }

    void updateLeadStage(session.leadId, "registered").catch(() => undefined);
  }, [isReady, session, router]);

  if (!session) {
    return (
      <FunnelShell width="narrow">
        <p className="font-body text-center text-graphite">Cargando...</p>
      </FunnelShell>
    );
  }

  return (
    <FunnelShell width="narrow">
      <div className="animate-fade-up surface-card p-6 sm:p-10">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-light shadow-[0_0_40px_-10px_var(--color-gold)]">
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="size-7 fill-none stroke-obsidian"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 8.5 3.5 3.5L13 5" />
            </svg>
          </span>
          <div>
            <p className="font-body text-xs tracking-[0.28em] text-gold uppercase">
              Paso 3 de 3
            </p>
            <h1 className="font-display mt-1 text-3xl leading-none font-black break-words text-ivory italic uppercase [font-stretch:condensed] min-[380px]:text-4xl sm:text-5xl">
              Registro completado
            </h1>
          </div>
        </div>

        <p className="font-body mt-5 text-base text-ivory/70">
          Listo, {session.firstName}. Tu cupo quedó confirmado y ya formas parte
          de la comunidad de inversionistas.
        </p>

        <div className="mt-8">
          <ProgressBar value={100} label="Registro completado" />
        </div>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          <SummaryItem
            label="Nombre"
            value={`${session.firstName} ${session.lastName}`}
          />
          <SummaryItem label="Celular" value={session.phoneE164} />
          <SummaryItem
            label="Correo"
            value={session.email}
            className="sm:col-span-2"
          />
        </dl>

        {session.whatsappGroupUrl && (
          <div className="mt-10">
            <GoldButton
              variant="outline"
              onClick={() =>
                window.open(
                  session.whatsappGroupUrl,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <WhatsappIcon />
              Abrir el grupo de WhatsApp
            </GoldButton>
          </div>
        )}
      </div>
    </FunnelShell>
  );
}

function SummaryItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/5 bg-obsidian/40 px-4 py-3 ${className}`}
    >
      <dt className="font-heading text-[0.65rem] tracking-[0.2em] text-graphite uppercase">
        {label}
      </dt>
      <dd className="font-body mt-1 truncate text-sm text-ivory">{value}</dd>
    </div>
  );
}
