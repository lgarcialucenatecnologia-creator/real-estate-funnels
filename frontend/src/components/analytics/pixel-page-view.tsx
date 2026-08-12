"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { trackEvent } from "@/lib/pixel";

/**
 * El base code del pixel dispara el PageView de la primera carga y nada más:
 * las navegaciones del funnel son client-side, así que Next no vuelve a
 * ejecutar ese script. Sin esto Meta solo ve una vista por sesión y los pasos
 * `/procesando` y `/registro` quedan invisibles.
 */
export function PixelPageView() {
  const pathname = usePathname();
  // El primer render ya lo cubrió el base code; no hay que duplicarlo.
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    trackEvent("PageView");
  }, [pathname]);

  return null;
}
