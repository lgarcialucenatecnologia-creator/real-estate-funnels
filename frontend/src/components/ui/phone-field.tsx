"use client";

import type { InputHTMLAttributes, Ref } from "react";

import { COUNTRIES, findCountry } from "@/lib/countries";

interface PhoneFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  countryCode: string;
  onCountryChange: (code: string) => void;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

export function PhoneField({
  label,
  countryCode,
  onCountryChange,
  error,
  ref,
  ...props
}: PhoneFieldProps) {
  const country = findCountry(countryCode);
  const errorId = "phoneNumber-error";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="phoneNumber"
        className="font-heading text-xs font-semibold tracking-[0.18em] text-ivory/70 uppercase"
      >
        {label}
      </label>

      <div
        className={`flex h-13 w-full items-stretch overflow-hidden rounded-xl border bg-nocturne/60 transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/25 ${
          error ? "border-gold/70" : "border-white/10 hover:border-white/20"
        }`}
      >
        <div className="relative flex items-center gap-2 border-r border-white/10 pr-3 pl-4">
          <span aria-hidden="true" className="text-lg leading-none">
            {country.flag}
          </span>
          <span className="font-body text-base whitespace-nowrap text-ivory">
            {country.dialCode}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 12 8"
            className="size-3 fill-none stroke-graphite"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m1 1.5 5 5 5-5" />
          </svg>

          <select
            aria-label="Código de país"
            value={countryCode}
            onChange={(event) => onCountryChange(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          >
            {COUNTRIES.map((option) => (
              <option key={option.code} value={option.code}>
                {option.flag} {option.name} ({option.dialCode})
              </option>
            ))}
          </select>
        </div>

        <input
          {...props}
          id="phoneNumber"
          ref={ref}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder={country.placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="h-full min-w-0 flex-1 bg-transparent px-4 font-body text-base text-ivory outline-none placeholder:text-graphite/70"
        />
      </div>

      {error && (
        <p id={errorId} className="font-body text-sm text-gold-light">
          {error}
        </p>
      )}
    </div>
  );
}
