import type { InputHTMLAttributes, Ref } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({ label, error, id, ref, ...props }: TextFieldProps) {
  const inputId = id ?? props.name;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className="font-heading text-xs font-semibold tracking-[0.18em] text-ivory/70 uppercase"
      >
        {label}
      </label>

      <input
        {...props}
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-13 w-full rounded-xl border bg-nocturne/60 px-4 font-body text-base text-ivory outline-none transition-colors placeholder:text-graphite/70 focus:border-gold focus:ring-2 focus:ring-gold/25 ${
          error ? "border-gold/70" : "border-white/10 hover:border-white/20"
        }`}
      />

      {error && (
        <p id={errorId} className="font-body text-sm text-gold-light">
          {error}
        </p>
      )}
    </div>
  );
}
