import { LEARNINGS, learningsDatesLine } from "@/lib/webinar";
import { Reveal } from "@/components/ui/reveal";

import { SectionHeading } from "./section-heading";

export function LearningsSection() {
  return (
    <Reveal as="section" className="mt-20 sm:mt-28">
      <SectionHeading
        title="Lo que aprenderás en estos"
        highlight="2 días (100% online)"
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:gap-5">
        <aside className="surface-card flex flex-col justify-center border-gold/30 bg-gold/5 p-6 sm:p-8">
          <p className="font-heading text-xs tracking-[0.22em] text-gold uppercase">
            Fechas de transmisión
          </p>
          <p className="font-body mt-4 text-base leading-relaxed text-ivory/80">
            {learningsDatesLine}
          </p>
        </aside>

        <div className="grid gap-4 sm:grid-cols-2">
          {LEARNINGS.map((item, index) => (
            <Reveal key={item.title} delay={index * 80} className="h-full">
              <article className="surface-card h-full p-5 sm:p-6">
                <span className="font-display text-2xl font-black text-gold italic">
                  0{index + 1}
                </span>
                <h3 className="font-heading mt-3 text-base font-bold text-ivory">
                  {item.title}
                </h3>
                <p className="font-body mt-2 text-sm leading-relaxed text-ivory/70">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <p className="font-heading mt-10 text-center text-base font-bold text-ivory/90 sm:text-lg">
        Aprende el{" "}
        <span className="text-gold-gradient">Método OPORTUNO</span> y pon a
        rendir el sudor de tu trabajo en Estados Unidos con inversiones refugio.
      </p>
    </Reveal>
  );
}
