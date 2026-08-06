import type { AnchorHTMLAttributes, ReactNode } from "react";

interface CtaLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

/**
 * Ancla de CTA dorada compartida por las secciones de cierre de la landing.
 * El brillo reutiliza el keyframe `progress-shine` que ya existe en
 * globals.css (mismo usado en la barra de progreso del registro).
 */
export function CtaLink({ children, className = "", ...props }: CtaLinkProps) {
  return (
    <a
      {...props}
      className={`group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold px-8 font-heading text-sm font-bold tracking-[0.08em] text-obsidian uppercase shadow-[0_12px_40px_-14px_var(--color-gold)] transition-[transform,filter] duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:[animation:progress-shine_0.9s_ease-in-out]"
      />
      <span className="relative">{children}</span>
    </a>
  );
}
