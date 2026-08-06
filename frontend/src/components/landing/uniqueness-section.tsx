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
          title="¿Por qué este evento es"
          highlight="único?"
          className="relative"
        />

        <p className="font-body relative mx-auto mt-6 max-w-3xl text-base leading-relaxed text-ivory/75 text-pretty sm:text-lg">
          El mercado inmobiliario cambió y seguir comprando por emoción o
          intuición te puede costar miles de dólares. Este evento no se basa en
          teoría de libros: está diseñado desde la experiencia real de más de{" "}
          <span className="font-heading font-bold text-gold">
            75 operaciones de compraventa
          </span>{" "}
          y un método práctico que elimina las trampas comerciales de la sala
          de ventas.
        </p>

        <div className="relative mx-auto mt-8 max-w-md">
          <CtaLink href="#registro" className="w-full">
            ¡Quiero participar en vivo!
          </CtaLink>
        </div>
      </div>
    </Reveal>
  );
}
