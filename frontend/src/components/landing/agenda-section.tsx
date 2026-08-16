import { AGENDA, WEBINAR_TIME, WEBINAR_TIMEZONE } from "@/lib/webinar";
import { CtaLink } from "@/components/ui/cta-link";
import { Reveal } from "@/components/ui/reveal";

import { SectionHeading } from "./section-heading";

export function AgendaSection() {
  return (
    <Reveal as="section" className="mt-20 sm:mt-28">
      <SectionHeading
        title="Guarda las fechas de transmisión"
        highlight="en tu zona horaria"
      />

      <p className="font-body mt-4 text-center text-sm text-graphite">
        Ambos días a las {WEBINAR_TIME} · {WEBINAR_TIMEZONE}
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {AGENDA.map((item, index) => (
          <Reveal key={item.badge} delay={index * 80} className="h-full">
            <article className="surface-card h-full p-6 sm:p-8">
              <p className="font-body text-xs tracking-[0.24em] text-gold uppercase">
                {item.badge}
              </p>
              <h3 className="font-display mt-2 text-2xl font-black text-ivory italic uppercase [font-stretch:condensed] sm:text-3xl">
                {item.day}
              </h3>
              <p className="font-heading mt-5 text-base font-bold text-gold">
                {item.title}
              </p>
              <p className="font-body mt-3 text-sm leading-relaxed text-ivory/70">
                {item.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <CtaLink href="#registro">
          👉 ¡Quiero mi cupo gratis a la clase online!
        </CtaLink>
      </div>
    </Reveal>
  );
}
