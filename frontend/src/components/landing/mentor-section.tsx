import { LuiferPortrait } from "@/components/brand/luifer-portrait";
import { Reveal } from "@/components/ui/reveal";
import { MENTOR_POINTS, MENTOR_STATS } from "@/lib/webinar";

import { MentorStat } from "./mentor-stat";
import { SectionHeading } from "./section-heading";

export function MentorSection() {
  return (
    <section className="mt-20 sm:mt-28">
      <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal as="div" variant="scale" className="order-2 lg:order-1">
          <LuiferPortrait size="mentor" className="mx-auto lg:mx-0" />
        </Reveal>

        <Reveal as="div" className="order-1 min-w-0 lg:order-2">
          <SectionHeading
            title="¿Quién es Luis Fernando García"
            highlight="(Luifer)?"
            align="left"
          />

          <ul className="mt-8 flex flex-col gap-5">
            {MENTOR_POINTS.map((point) => (
              <li
                key={point}
                className="border-l-2 border-gold/50 pl-4 font-body text-base leading-relaxed text-ivory/80"
              >
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {MENTOR_STATS.map((stat) => (
              <MentorStat key={stat.label} {...stat} />
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal as="div" className="surface-card mt-10 p-6 sm:p-8">
        <h3 className="font-heading text-xl font-bold text-gold uppercase sm:text-2xl">
          Mi compromiso contigo es esto:
        </h3>
        <p className="font-body mt-4 text-base leading-relaxed text-ivory/75 text-pretty sm:text-lg">
          Yo sé lo que cuesta estar lejos de la tierra y de los tuyos. Por eso
          no te voy a hablar con palabras técnicas ni promesas infladas. Te voy
          a enseñar el método exacto y simple para que tus dólares compren
          barato en Colombia, asegures de 20 a 40 millones por negocio y
          construyas la tranquilidad que tú y tu familia se merecen.
        </p>
      </Reveal>
    </section>
  );
}
