import type { ButtonHTMLAttributes, ReactNode } from "react";

interface CtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "solid" | "outline";
}

/** CTA con Dorado Inversión / Oro Luminoso de la paleta de marca. */
export function CtaButton({
  children,
  loading = false,
  variant = "solid",
  className = "",
  disabled,
  ...props
}: CtaButtonProps) {
  const base =
    "group relative inline-flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl px-6 py-3 font-heading text-sm font-bold tracking-[0.08em] uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

  const styles =
    variant === "solid"
      ? "bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian shadow-[0_12px_40px_-14px_var(--color-gold)] hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-12px_var(--color-gold)] hover:brightness-110 active:translate-y-0 active:scale-[0.99]"
      : "border border-gold/40 bg-transparent text-gold hover:border-gold hover:bg-gold/10";

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${styles} ${className}`}
    >
      {variant === "solid" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:[animation:progress-shine_0.9s_ease-in-out]"
        />
      )}
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
