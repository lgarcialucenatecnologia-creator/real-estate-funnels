"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import portrait from "@/assets/images/luifer-garcia.png";

/**
 * El PNG trae 97px de 590 transparentes sobre la cabeza. El marco se escala
 * descontando ese margen para que la parte visible —no la caja— cubra el alto
 * del titular, y se sube con margen negativo para que la cabeza quede a la
 * altura de la primera línea.
 */
const PORTRAIT_HEAD_OFFSET = 97 / 590;

export function HeadlineWithPortrait() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const node = headingRef.current;
    if (!node) return;

    const update = () => setHeight(node.getBoundingClientRect().height);

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const boxHeight =
    height > 0 ? Math.round(height / (1 - PORTRAIT_HEAD_OFFSET)) : 0;
  const headOffset = boxHeight - height;

  return (
    <div className="mt-5 flex items-start gap-4 xl:gap-5">
      {/*
        El ancho es fijo por breakpoint a propósito: derivarlo del alto medido
        del titular realimenta el ancho disponible del <h1>, y con el retrato
        ampliado ese bucle no converge (la misma página resolvía a 6 u 8 líneas
        según la corrida). Con el ancho fijo el titular se mide una sola vez.
      */}
      <div
        className="relative hidden w-[175px] shrink-0 overflow-hidden lg:block xl:w-[190px]"
        style={
          height > 0
            ? { height: `${boxHeight}px`, marginTop: `-${headOffset}px` }
            : { height: "1px", opacity: 0 }
        }
        aria-hidden={height <= 0}
      >
        <Image
          src={portrait}
          alt="Luis Fernando García, mentor del Método OPORTUNO"
          fill
          priority
          sizes="(min-width: 1280px) 190px, 175px"
          className="object-cover object-top drop-shadow-[0_16px_32px_rgba(0,0,0,0.45)]"
        />
      </div>

      <h1
        ref={headingRef}
        className="font-display min-w-0 flex-1 text-3xl leading-[0.95] font-black text-balance break-words text-ivory italic uppercase lg:text-pretty [font-stretch:condensed] min-[400px]:text-4xl sm:text-5xl lg:text-[2.7rem] lg:leading-[0.94] xl:text-[3.1rem]"
      >
        Aprende a invertir en{" "}
        <span className="text-gold-gradient">bienes raíces</span> para hacer
        crecer tu dinero y construir tu propio{" "}
        <span className="text-gold-gradient">plan B</span>.
      </h1>
    </div>
  );
}
