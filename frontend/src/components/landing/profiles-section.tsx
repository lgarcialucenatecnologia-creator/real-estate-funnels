import { PROFILES } from "@/lib/webinar";
import { Reveal } from "@/components/ui/reveal";

import { SectionHeading } from "./section-heading";

export function ProfilesSection() {
  return (
    <Reveal as="section" className="mt-20 sm:mt-28">
      <SectionHeading title="Mapa de perfiles" eyebrow="Identifícate" />

      <div className="relative mx-auto mt-12 max-w-4xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 hidden size-3 scale-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold opacity-0 shadow-[0_0_40px_8px_var(--color-gold)] transition-[opacity,transform] duration-700 delay-300 group-data-[state=visible]:scale-100 group-data-[state=visible]:opacity-100 lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[18%] top-1/2 hidden h-px -translate-y-1/2 scale-x-0 bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 transition-[opacity,transform] duration-700 delay-150 group-data-[state=visible]:scale-x-100 group-data-[state=visible]:opacity-100 lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-[18%] left-1/2 hidden w-px -translate-x-1/2 scale-y-0 bg-gradient-to-b from-transparent via-gold/40 to-transparent opacity-0 transition-[opacity,transform] duration-700 delay-150 group-data-[state=visible]:scale-y-100 group-data-[state=visible]:opacity-100 lg:block"
        />

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {PROFILES.map((profile, index) => (
            <Reveal key={profile.title} delay={index * 80} className="h-full">
              <article className="surface-card relative h-full p-5 sm:p-6">
                <span className="font-display absolute top-4 right-5 text-2xl font-black text-gold/25 italic">
                  0{index + 1}
                </span>
                <h3 className="font-heading pr-10 text-lg font-bold text-ivory">
                  {profile.title}
                </h3>
                <p className="font-body mt-3 text-sm leading-relaxed text-ivory/70">
                  {profile.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
