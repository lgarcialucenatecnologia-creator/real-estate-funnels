"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ProgressBar } from "@/components/funnel/progress-bar";
import { FunnelShell } from "@/components/layout/funnel-shell";
import { GoldButton } from "@/components/ui/gold-button";
import { WhatsappIcon } from "@/components/ui/whatsapp-icon";
import { updateLeadStage } from "@/lib/api";
import {
  EVENT_CONTENT_NAME,
  newEventId,
  trackCustomEvent,
  trackEvent,
} from "@/lib/pixel";
import { useFunnelSession } from "@/lib/use-funnel-session";

const CHECKLIST = [
  { label: "Datos recibidos y verificados", done: true },
  { label: "Perfil de inversionista creado", done: true },
  { label: "Acceso al grupo privado de WhatsApp", done: false },
];

export default function ProcessingPage() {
  const router = useRouter();
  const { session, isReady } = useFunnelSession();
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    if (!session) {
      router.replace("/");
      return;
    }

    void updateLeadStage(session.leadId, "progress_viewed").catch(
      () => undefined,
    );
  }, [isReady, session, router]);

  const handleJoin = async () => {
    if (!session) return;
    setIsJoining(true);

    /*
      `Lead` ("Cliente potencial" en Events Manager) es el evento por el que el
      trafficker optimiza la campaña: tiene que ser el estándar, no un custom.
      `WhatsAppJoin` se queda además para ver el paso exacto del funnel.

      El backend repite `Lead` por la Conversions API con este mismo eventId
      para que Meta cuente uno solo, no dos.
    */
    const leadEventId = newEventId();
    trackEvent("Lead", { content_name: EVENT_CONTENT_NAME }, leadEventId);
    trackCustomEvent("WhatsAppJoin", {}, newEventId());

    // Va antes del await a propósito: después el navegador ya no lo trata como
    // gesto del usuario y bloquea la pestaña nueva.
    if (session.whatsappGroupUrl) {
      window.open(session.whatsappGroupUrl, "_blank", "noopener,noreferrer");
    }

    await updateLeadStage(session.leadId, "whatsapp_joined", {
      eventId: leadEventId,
      eventSourceUrl: window.location.href,
    }).catch(() => undefined);
    router.push("/registro");
  };

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
        <p className="font-body text-xs tracking-[0.28em] text-gold uppercase">
          Paso 2 de 3
        </p>

        <h1 className="font-display mt-4 text-3xl leading-[0.95] font-black break-words text-ivory italic uppercase [font-stretch:condensed] min-[380px]:text-4xl sm:text-5xl">
          {session.firstName}, tu registro está casi listo
        </h1>

        <p className="font-body mt-4 text-base text-ivory/70">
          Estamos reservando tu cupo. Para completar el{" "}
          <span className="font-heading font-bold text-gold">100%</span> solo
          falta que entres al grupo privado donde se entrega el acceso.
        </p>

        <div className="mt-8">
          <ProgressBar
            value={session.progressPercentage}
            label="Registro completado"
          />
        </div>

        <ul className="mt-8 flex flex-col gap-3">
          {CHECKLIST.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-obsidian/40 px-4 py-3"
            >
              {item.done ? (
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold/15">
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="size-3 fill-none stroke-gold"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 8.5 3.5 3.5L13 5" />
                  </svg>
                </span>
              ) : (
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-dashed border-graphite/60">
                  <span className="size-1.5 animate-pulse rounded-full bg-graphite" />
                </span>
              )}
              <span
                className={`font-body text-sm ${
                  item.done ? "text-ivory/75" : "text-graphite"
                }`}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <GoldButton onClick={handleJoin} loading={isJoining}>
            <WhatsappIcon />
            Unirme al grupo y registrarme
          </GoldButton>
        </div>

        <p className="font-body mt-4 text-center text-xs text-graphite">
          Se abrirá WhatsApp en una pestaña nueva. Los cupos del grupo son
          limitados.
        </p>
      </div>
    </FunnelShell>
  );
}
