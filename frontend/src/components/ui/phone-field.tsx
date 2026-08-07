"use client";

import type { InputHTMLAttributes, Ref } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { COUNTRIES, findCountry, type Country } from "@/lib/countries";

interface PhoneFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  countryCode: string;
  onCountryChange: (code: string) => void;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

/** Quita acentos para que "mexico" encuentre "México". */
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function filterCountries(countries: Country[], query: string): Country[] {
  const trimmed = query.trim();
  if (!trimmed) return countries;

  const normalizedQuery = normalize(trimmed);
  const digitsQuery = trimmed.replace(/\D/g, "");

  return countries.filter((country) => {
    if (normalize(country.name).includes(normalizedQuery)) return true;
    return (
      digitsQuery.length > 0 &&
      country.dialCode.replace(/\D/g, "").includes(digitsQuery)
    );
  });
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

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterCountries(COUNTRIES, query), [query]);

  /** Cierra por selección o Escape: además devuelve el foco al disparador. */
  const close = () => {
    setIsOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;

    // Cierra sin robarle el foco a lo que se haya clicado afuera.
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) searchRef.current?.focus();
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="phoneNumber"
        className="font-heading text-xs font-semibold tracking-[0.18em] text-ivory/70 uppercase"
      >
        {label}
      </label>

      <div
        className={`flex h-13 w-full items-stretch rounded-xl border bg-nocturne/60 transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/25 ${
          error ? "border-gold/70" : "border-white/10 hover:border-white/20"
        }`}
      >
        <div
          ref={containerRef}
          className="relative flex items-center gap-2 border-r border-white/10 pr-3 pl-4"
        >
          <button
            ref={triggerRef}
            type="button"
            aria-label="Código de país"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              {country.flag}
            </span>
            <span className="font-body text-base whitespace-nowrap text-ivory">
              {country.dialCode}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 12 8"
              className={`size-3 fill-none stroke-graphite transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m1 1.5 5 5 5-5" />
            </svg>
          </button>

          {isOpen && (
            <div
              role="listbox"
              aria-label="Lista de países"
              className="surface-card absolute top-full left-0 z-30 mt-2 w-64 p-2 shadow-2xl sm:w-72"
            >
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.stopPropagation();
                    close();
                  } else if (event.key === "Enter") {
                    event.preventDefault();
                    if (filtered[0]) {
                      onCountryChange(filtered[0].code);
                      close();
                    }
                  }
                }}
                placeholder="Buscar país o código..."
                className="w-full rounded-lg border border-white/10 bg-obsidian/60 px-3 py-2 font-body text-sm text-ivory outline-none placeholder:text-graphite/70 focus:border-gold/50"
              />

              <ul className="mt-2 max-h-64 overflow-y-auto">
                {filtered.length === 0 && (
                  <li className="px-3 py-4 text-center font-body text-sm text-graphite">
                    Sin resultados
                  </li>
                )}
                {filtered.map((option) => {
                  const isSelected = option.code === countryCode;
                  return (
                    <li key={option.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onCountryChange(option.code);
                          close();
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left font-body text-sm transition-colors hover:bg-white/5 ${
                          isSelected ? "bg-gold/15 text-gold" : "text-ivory"
                        }`}
                      >
                        <span aria-hidden="true" className="text-base leading-none">
                          {option.flag}
                        </span>
                        <span className="w-12 shrink-0 font-heading font-bold tabular-nums">
                          {option.dialCode}
                        </span>
                        <span className="truncate">{option.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
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
          className="h-full min-w-0 flex-1 rounded-r-xl bg-transparent px-4 font-body text-base text-ivory outline-none placeholder:text-graphite/70"
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
