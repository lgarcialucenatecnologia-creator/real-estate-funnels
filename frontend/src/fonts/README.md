# Tipografías de marca

El sistema tipográfico definitivo es:

| Uso           | Fuente real                   | Variable CSS     | Sustituto actual        |
| ------------- | ----------------------------- | ---------------- | ----------------------- |
| Títulos       | Molde Condensed Heavy Italic  | `--font-display` | Archivo (wdth 62, 900i) |
| Subtítulos    | Neue Plak Bold                | `--font-heading` | Inter                   |
| Descripciones | Coolvetica Regular            | `--font-body`    | Jost                    |

## Cómo activar las fuentes con licencia

1. Copiar los archivos `.woff2` en esta carpeta:
   - `Molde-CondensedHeavyItalic.woff2`
   - `NeuePlak-Bold.woff2`
   - `Coolvetica-Regular.woff2`
2. Reemplazar el contenido de `src/lib/fonts.ts` por declaraciones con
   `next/font/local`, manteniendo los mismos nombres de variable CSS:

```ts
import localFont from "next/font/local";

export const displayFont = localFont({
  src: "../fonts/Molde-CondensedHeavyItalic.woff2",
  variable: "--font-display",
  display: "swap",
});
```

No hace falta tocar `globals.css` ni los componentes: todos consumen las
variables `--font-display`, `--font-heading` y `--font-body`.
