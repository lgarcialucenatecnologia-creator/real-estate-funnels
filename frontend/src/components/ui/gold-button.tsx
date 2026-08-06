import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "solid" | "outline";
}

export function GoldButton({
  children,
  loading = false,
  variant = "solid",
  className = "",
  disabled,
  ...props
}: GoldButtonProps) {
  const base =
    "relative inline-flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl px-6 font-heading text-sm font-bold tracking-[0.14em] uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

  const styles =
    variant === "solid"
      ? "bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian shadow-[0_12px_40px_-14px_var(--color-gold)] hover:shadow-[0_16px_50px_-12px_var(--color-gold)] hover:brightness-110 active:scale-[0.99]"
      : "border border-gold/40 bg-transparent text-gold hover:border-gold hover:bg-gold/10";

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${styles} ${className}`}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
