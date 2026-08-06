import type { ReactNode } from "react";

import { BrandMark } from "@/components/brand/brand-mark";

interface FunnelShellProps {
  children: ReactNode;
  /** Ancho máximo del contenido central. */
  width?: "narrow" | "wide";
  /** Landing larga: el main no se centra en vertical. */
  variant?: "funnel" | "landing";
}

export function FunnelShell({
  children,
  width = "wide",
  variant = "funnel",
}: FunnelShellProps) {
  const isLanding = variant === "landing";

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-obsidian">
      <BackgroundDecoration />

      <div
        className={`relative z-10 mx-auto flex min-h-dvh w-full flex-col px-5 py-8 sm:px-8 lg:py-10 ${
          isLanding ? "max-w-6xl" : "max-w-6xl"
        }`}
      >
        <header className="flex items-center justify-between gap-4">
          <BrandMark />
          <span className="hidden font-body text-xs tracking-[0.28em] text-graphite uppercase sm:block">
            Webinar en vivo · Cupos limitados
          </span>
        </header>

        <main
          className={`flex min-w-0 flex-1 flex-col ${
            isLanding ? "py-8 sm:py-12" : "justify-center py-10"
          } ${width === "narrow" ? "mx-auto w-full max-w-2xl" : ""}`}
        >
          {children}
        </main>

        <footer className="border-t border-white/5 pt-6 font-body text-xs text-graphite">
          <p>
            © {new Date().getFullYear()} Luisfer García. Todos los derechos
            reservados. Este sitio no está afiliado a Meta Platforms, Inc.
          </p>
        </footer>
      </div>
    </div>
  );
}

function BackgroundDecoration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 -left-32 size-[32rem] rounded-full bg-nocturne blur-[120px]" />
      <div className="animate-pulse-glow absolute top-1/4 -right-24 size-[26rem] rounded-full bg-gold/12 blur-[130px]" />
      <div className="absolute top-[70%] -left-20 size-[28rem] rounded-full bg-tech-blue/12 blur-[140px]" />
      <div className="absolute -bottom-40 left-1/3 size-[30rem] rounded-full bg-gold/8 blur-[140px]" />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,241,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,235,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 90% 50% at 50% 10%, black 15%, transparent 70%)",
        }}
      />
    </div>
  );
}
