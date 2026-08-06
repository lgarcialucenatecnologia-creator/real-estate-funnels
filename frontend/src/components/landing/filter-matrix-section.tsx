import { FILTER_MATRIX } from "@/lib/webinar";
import { CtaLink } from "@/components/ui/cta-link";
import { Reveal } from "@/components/ui/reveal";

import { SectionHeading } from "./section-heading";

export function FilterMatrixSection() {
  return (
    <Reveal as="section" className="mt-20 sm:mt-28">
      <SectionHeading
        title="¿Para quién es"
        highlight="este entrenamiento?"
      />

      <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
        <div className="grid sm:grid-cols-2">
          <div className="border-b border-white/10 bg-graphite/20 px-5 py-4 sm:border-r sm:border-b-0">
            <p className="font-heading text-sm font-bold tracking-wide text-ivory uppercase">
              Esto NO es para ti si…
            </p>
          </div>
          <div className="bg-tech-blue/20 px-5 py-4">
            <p className="font-heading text-sm font-bold tracking-wide text-ivory uppercase">
              Esto es para ti SÍ…
            </p>
          </div>
        </div>

        {FILTER_MATRIX.map((row, index) => (
          <Reveal key={row.no} as="div" delay={index * 80}>
            <div className="grid border-t border-white/10 sm:grid-cols-2">
              <div className="border-b border-white/10 bg-obsidian/40 px-5 py-5 sm:border-r sm:border-b-0">
                <p className="font-body text-sm leading-relaxed text-ivory/70">
                  {row.no}
                </p>
              </div>
              <div className="bg-nocturne/40 px-5 py-5">
                <p className="font-body text-sm leading-relaxed text-ivory/80">
                  {row.yes}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center">
        <CtaLink href="#registro">¡Sí, quiero mi cupo gratuito!</CtaLink>
      </div>
    </Reveal>
  );
}
