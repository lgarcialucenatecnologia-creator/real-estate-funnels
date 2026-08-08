import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { fontVariables } from "@/lib/fonts";
import "./globals.css";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const metadata: Metadata = {
  /*
    WhatsApp y Facebook necesitan og:image absoluta. Sin metadataBase, Next
    resuelve la imagen de `opengraph-image.png` contra localhost y el preview
    del enlace se cae. Va fijo al dominio de producción a propósito: es el único
    host desde el que se comparte el enlace.
  */
  metadataBase: new URL("https://webinar.garciainversiones.com"),
  title: {
    default: "Método OPORTUNO · Webinar gratuito | Luifer García",
    template: "%s · Luifer García",
  },
  description:
    "Aprende a invertir en bienes raíces para hacer crecer tu dinero y construir tu propio plan B. Webinar en vivo de 2 días con el Método OPORTUNO de Luifer García.",
  openGraph: {
    title: "Método OPORTUNO · Webinar gratuito | Luifer García",
    description:
      "Aprende a analizar, comparar y negociar inmuebles con números fríos antes de entregar el primer peso.",
    type: "website",
    locale: "es_LA",
    url: "/",
    siteName: "Luifer García · Inversión Inmobiliaria",
  },
  twitter: {
    card: "summary_large_image",
    title: "Método OPORTUNO · Webinar gratuito | Luifer García",
    description:
      "Aprende a analizar, comparar y negociar inmuebles con números fríos antes de entregar el primer peso.",
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
      <body className="min-h-dvh antialiased">
        {META_PIXEL_ID ? (
          <>
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${META_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
