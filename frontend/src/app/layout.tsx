import type { Metadata, Viewport } from "next";

import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Método OPORTUNO · Webinar gratuito | Luisfer García",
    template: "%s · Luisfer García",
  },
  description:
    "Gánate mínimo un 15% en la mesa de negociación en los próximos 90 días. Webinar en vivo de 2 días con el Método OPORTUNO de Luisfer García.",
  openGraph: {
    title: "Método OPORTUNO · Webinar gratuito | Luisfer García",
    description:
      "Aprende a analizar, comparar y negociar inmuebles con números fríos antes de entregar el primer peso.",
    type: "website",
    locale: "es_LA",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0C0812",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={fontVariables}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
