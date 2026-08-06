"use client";

import { useCountUp } from "@/lib/use-count-up";

interface ProgressBarProps {
  /** Valor final al que debe llegar la animación. */
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const displayed = useCountUp(value, { duration: 2200, initialDisplay: "zero" });

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-4">
        <span className="font-heading text-xs font-semibold tracking-[0.2em] text-ivory/70 uppercase">
          {label ?? "Progreso"}
        </span>
        <span className="font-display text-4xl leading-none font-black text-gold italic [font-stretch:condensed] tabular-nums">
          {displayed}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={displayed}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progreso del registro"}
        className="relative mt-3 h-3 w-full overflow-hidden rounded-full border border-white/10 bg-nocturne"
      >
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-gold via-gold-light to-gold transition-[width] duration-300 ease-out"
          style={{ width: `${displayed}%` }}
        >
          <span className="animate-progress-shine absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
        </div>
      </div>
    </div>
  );
}
