import { FILTER_MATRIX } from "@/lib/webinar";
import { CtaLink } from "@/components/ui/cta-link";
import { Reveal } from "@/components/ui/reveal";

import { SectionHeading } from "./section-heading";

interface FilterGroupProps {
  title: string;
  items: readonly string[];
  tone: "no" | "yes";
}

/**
 * Versión apilada para móvil: en una sola columna la matriz de dos columnas
 * pierde su encabezado, así que cada lado se muestra como su propia tarjeta
 * etiquetada con su marca (✕ / ✓).
 */
function FilterGroup({ title, items, tone }: FilterGroupProps) {
  const isYes = tone === "yes";

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        isYes ? "border-gold/25" : "border-white/10"
      }`}
    >
      <div
        className={`flex items-center gap-2 px-5 py-4 ${
          isYes ? "bg-tech-blue/25" : "bg-graphite/20"
        }`}
      >
        <span
          aria-hidden="true"
          className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            isYes ? "bg-gold text-obsidian" : "bg-white/10 text-ivory/70"
          }`}
        >
          {isYes ? "✓" : "✕"}
        </span>
        <p className="font-heading text-sm font-bold tracking-wide text-ivory uppercase">
          {title}
        </p>
      </div>

      <ul>
        {items.map((item) => (
          <li
            key={item}
            className={`flex gap-3 border-t border-white/10 px-5 py-4 ${
              isYes ? "bg-nocturne/40" : "bg-obsidian/40"
            }`}
          >
            <span
              aria-hidden="true"
              className={`font-heading mt-0.5 shrink-0 text-xs ${
                isYes ? "text-gold" : "text-ivory/35"
              }`}
            >
              {isYes ? "✓" : "✕"}
            </span>
            <p
              className={`font-body text-sm leading-relaxed ${
                isYes ? "text-ivory/80" : "text-ivory/65"
              }`}
            >
              {item}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FilterMatrixSection() {
  const noItems = FILTER_MATRIX.map((row) => row.no);
  const yesItems = FILTER_MATRIX.map((row) => row.yes);

  return (
    <Reveal as="section" className="mt-20 sm:mt-28">
      <SectionHeading
        title="¿Esta clase es para ti?"
        highlight="Léelo con claridad"
      />

      {/* Móvil: dos bloques apilados, cada uno con su propio encabezado. */}
      <div className="mt-10 space-y-6 sm:hidden">
        <FilterGroup title="Esto SÍ es para ti si…" items={yesItems} tone="yes" />
        <FilterGroup title="Esto NO es para ti si…" items={noItems} tone="no" />
      </div>

      {/* sm+: matriz de dos columnas enfrentadas. */}
      <div className="mt-10 hidden overflow-hidden rounded-2xl border border-white/10 sm:block">
        <div className="grid grid-cols-2">
          <div className="border-r border-white/10 bg-graphite/20 px-5 py-4">
            <p className="font-heading text-sm font-bold tracking-wide text-ivory uppercase">
              Esto NO es para ti si…
            </p>
          </div>
          <div className="bg-tech-blue/20 px-5 py-4">
            <p className="font-heading text-sm font-bold tracking-wide text-ivory uppercase">
              Esto SÍ es para ti si…
            </p>
          </div>
        </div>

        {FILTER_MATRIX.map((row, index) => (
          <Reveal key={row.no} as="div" delay={index * 80}>
            <div className="grid grid-cols-2 border-t border-white/10">
              <div className="border-r border-white/10 bg-obsidian/40 px-5 py-5">
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
        <CtaLink href="#registro">
          👉 ¡Quiero mi cupo gratis a la clase online!
        </CtaLink>
      </div>
    </Reveal>
  );
}
