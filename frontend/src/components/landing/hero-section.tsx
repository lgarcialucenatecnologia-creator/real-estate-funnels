import { LuiferPortrait } from "@/components/brand/luifer-portrait";
import { LeadForm } from "@/components/funnel/lead-form";
import { heroDatesLine, WEBINAR_DATES } from "@/lib/webinar";

import { HeadlineWithPortrait } from "./headline-with-portrait";

export function HeroSection() {
  return (
    <section className="grid items-start gap-8 lg:grid-cols-[1.25fr_0.95fr] lg:gap-10 xl:gap-14">
      {/* 1) Copy — primero en mobile */}
      <div className="animate-fade-up order-1 min-w-0 lg:flex lg:flex-col lg:justify-between lg:self-stretch">
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-gold/30 bg-gold/8 px-4 py-2 font-body text-xs tracking-[0.24em] text-gold uppercase lg:px-5 lg:py-2.5 lg:text-sm">
          Clase online gratuita · {WEBINAR_DATES}
        </span>

        <HeadlineWithPortrait />

        <h2 className="font-heading mt-5 max-w-xl text-base leading-snug font-bold text-balance text-gold sm:text-lg lg:mt-6 lg:text-xl">
          Deja de mandar plata para que se esfume en gastos diarios o de pagar
          &quot;precio de extranjero&quot;.
        </h2>

        <p className="font-body mt-3 max-w-lg text-sm leading-relaxed text-ivory/75 text-pretty sm:text-base lg:mt-4 lg:max-w-xl lg:text-lg">
          Descubre cómo encontrar, analizar y negociar propiedades en Colombia
          desde Estados Unidos con números claros para asegurar el futuro de tu
          familia.
        </p>
      </div>

      {/* 2) Formulario — segundo en mobile */}
      <div
        id="registro"
        className="surface-card order-2 scroll-mt-8 min-w-0 p-6 sm:p-8 [animation:fade-up_0.6s_ease-out_150ms_both] lg:self-center"
      >
        <p className="font-heading text-xl font-bold text-ivory">
          Reserva tu cupo gratuito
        </p>
        <p className="font-body mt-1 text-sm text-graphite">
          Completa tus datos y te enviamos el acceso por WhatsApp.
        </p>
        <div className="mt-6">
          <LeadForm />
        </div>

        <p className="font-body mt-5 flex items-start justify-center gap-2 text-center text-[11px] leading-snug text-ivory/70 sm:text-xs">
          <span aria-hidden="true">🔒</span>
          <span>{heroDatesLine}</span>
        </p>
      </div>

      {/* 3) Imagen — solo mobile, al final */}
      <div className="order-3 flex justify-center [animation:fade-up_0.6s_ease-out_250ms_both] lg:hidden">
        <LuiferPortrait priority size="hero" />
      </div>
    </section>
  );
}
