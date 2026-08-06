import { Archivo, Inter, Jost } from "next/font/google";

/**
 * Las tipografías de marca (Molde Condensed Heavy Italic, Neue Plak Bold y
 * Coolvetica Regular) son comerciales y no se distribuyen por CDN. Mientras no
 * estén los archivos con licencia en `src/fonts/`, se usan estos sustitutos con
 * métricas muy cercanas. Ver `src/fonts/README.md` para el reemplazo.
 */

/** Sustituto de Molde Condensed Heavy Italic — títulos de alto impacto. */
export const displayFont = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

/** Sustituto de Neue Plak Bold — subtítulos y estructura. */
export const headingFont = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

/** Sustituto de Coolvetica Regular — descripciones y cuerpo de texto. */
export const bodyFont = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const fontVariables = [
  displayFont.variable,
  headingFont.variable,
  bodyFont.variable,
].join(" ");
