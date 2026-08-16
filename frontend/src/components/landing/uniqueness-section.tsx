import { CtaLink } from "@/components/ui/cta-link";
import { Reveal } from "@/components/ui/reveal";

import { SectionHeading } from "./section-heading";

export function UniquenessSection() {
  return (
    <Reveal as="section" className="mt-20 sm:mt-28">
      <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-nocturne via-obsidian to-nocturne px-6 py-12 text-center sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full bg-gold/15 blur-[90px]"
        />

        <SectionHeading
          title="¿Por qué esta clase es"
          highlight="completamente distinta?"
          className="relative"
        />

        <p className="font-body relative mx-auto mt-6 max-w-3xl text-base leading-relaxed text-ivory/75 text-pretty sm:text-lg">
          Comprar finca raíz por emoción o por lo bonito del apartamento modelo
          te puede costar los ahorros de toda tu vida. Yo me quebré dos veces en
          la vida por no saber hacer números básicos. Esta clase está construida
          desde la calle, después de hacer más de{" "}
          <span className="font-heading font-bold text-gold">
            75 compras y ventas reales
          </span>
          , para mostrarte exactamente cómo negociar de frente y comprar barato
          sin caer en trampas.
        </p>

        <div className="relative mx-auto mt-8 max-w-md">
          <CtaLink href="#registro" className="w-full">
            👉 ¡Reservar mi cupo en vivo ahora!
          </CtaLink>
        </div>
      </div>
    </Reveal>
  );
}
