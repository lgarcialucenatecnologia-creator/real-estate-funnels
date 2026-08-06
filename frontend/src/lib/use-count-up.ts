"use client";

import { useEffect, useState } from "react";

export interface UseCountUpOptions {
  /** Duración de la animación en ms. */
  duration?: number;
  /** Si es `false`, el conteo no arranca (para esperar a que entre en pantalla). */
  trigger?: boolean;
  /**
   * Qué mostrar antes de que el conteo arranque. "target" es lo correcto para
   * contenido que debe verse bien aunque el JS falle o tarde en hidratar (el
   * HTML del servidor ya muestra la cifra final). "zero" reproduce el efecto
   * clásico de barra de progreso, pensado para pantallas que ya dependen de JS.
   */
  initialDisplay?: "target" | "zero";
}

/** Cuenta de 0 (o del valor final) hasta `value` con desaceleración easeOutCubic. */
export function useCountUp(
  value: number,
  {
    duration = 2200,
    trigger = true,
    initialDisplay = "target",
  }: UseCountUpOptions = {},
): number {
  const [displayed, setDisplayed] = useState(
    initialDisplay === "target" ? value : 0,
  );

  useEffect(() => {
    if (!trigger) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      if (reduceMotion) {
        setDisplayed(value);
        return;
      }

      const elapsed = Math.min((now - start) / duration, 1);
      // easeOutCubic: avanza rápido y desacelera al acercarse al objetivo.
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplayed(Math.round(value * eased));

      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, trigger, duration]);

  return displayed;
}
