import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { PixelPageView } from "@/components/analytics/pixel-page-view";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const metadata: Metadata = {
  /*
    WhatsApp y Facebook necesitan og:image absoluta. Sin metadataBase, Next
    resuelve la imagen de `opengraph-image.png` contra localhost y el preview
    del enlace se cae. Esta variante se despliega en su propio host, así que el
    dominio se define con NEXT_PUBLIC_SITE_URL; el valor por defecto queda solo
    como respaldo para que el preview nunca apunte a localhost.
  */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      "https://webinar.garciainversiones.com",
  ),
  title: {
    default: "Invierte tus dólares en Colombia · Clase gratuita | Luifer García",
    template: "%s · Luifer García",
  },
  description:
    "Aprende a comprar inmuebles en Colombia de 20 a 40 millones por debajo del mercado desde Estados Unidos. Clase online gratuita de 2 días con el Método OPORTUNO de Luifer García.",
  openGraph: {
    title:
      "Invierte tus dólares en Colombia · Clase gratuita | Luifer García",
    description:
      "Encuentra, analiza y negocia propiedades en Colombia desde Estados Unidos con números claros, sin pagar precio de extranjero.",
    type: "website",
    locale: "es_LA",
    url: "/",
    siteName: "Luifer García · Inversión Inmobiliaria",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Invierte tus dólares en Colombia · Clase gratuita | Luifer García",
    description:
      "Encuentra, analiza y negocia propiedades en Colombia desde Estados Unidos con números claros, sin pagar precio de extranjero.",
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
            <PixelPageView />
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
