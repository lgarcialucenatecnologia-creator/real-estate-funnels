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
          title="¿Por qué esta clase es tu mejor"
          highlight="herramienta desde USA?"
          className="relative"
        />

        <p className="font-body relative mx-auto mt-6 max-w-3xl text-base leading-relaxed text-ivory/75 text-pretty sm:text-lg">
          Apenas en Colombia se enteran de que vives en el exterior, te quieren
          cobrar más caro o venderte ilusiones. Yo sé lo que cuesta ganarse un
          peso porque me ha tocado empezar desde cero y quebrarme dos veces. No
          te voy a enseñar teoría: te voy a dar las herramientas prácticas para
          que revises ofertas en Colombia en 15 minutos, negocies con fuerza y
          asegures entre{" "}
          <span className="font-heading font-bold text-gold">
            20 a 40 millones de ganancia
          </span>{" "}
          al momento de comprar.
        </p>

        <div className="relative mx-auto mt-8 max-w-md">
          <CtaLink href="#registro" className="w-full">
            👉 ¡Reservar mi cupo gratis ahora!
          </CtaLink>
        </div>
      </div>
    </Reveal>
  );
}
