"use client";

import { useInView } from "@/lib/use-in-view";
import { useCountUp } from "@/lib/use-count-up";

interface MentorStatProps {
  value: number;
  suffix: string;
  label: string;
}

/** Cifra con conteo al entrar en pantalla. Arranca mostrando el valor final. */
export function MentorStat({ value, suffix, label }: MentorStatProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const displayed = useCountUp(value, { trigger: inView });

  return (
    <div ref={ref} className="surface-card h-full p-4 text-center">
      <p className="font-display text-3xl font-black text-gold italic [font-stretch:condensed] sm:text-4xl">
        {displayed}
        {suffix}
      </p>
      <p className="font-body mt-1 text-xs leading-snug text-ivory/70">
        {label}
      </p>
    </div>
  );
}
