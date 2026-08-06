"use client";

import type { ElementType, ReactNode, Ref } from "react";

import { useInView } from "@/lib/use-in-view";

interface RevealProps {
  as?: ElementType;
  variant?: "up" | "fade" | "scale";
  /** Retraso en ms, para escalonar tarjetas dentro de una misma grilla. */
  delay?: number;
  className?: string;
  children: ReactNode;
}

const HIDDEN_CLASSES: Record<NonNullable<RevealProps["variant"]>, string> = {
  up: "opacity-0 translate-y-4",
  fade: "opacity-0",
  scale: "opacity-0 scale-95",
};

/**
 * Revela su contenido con una transición al entrar en pantalla. Arranca
 * visible (ver use-in-view.ts) y se marca a sí mismo con `group` +
 * `data-state` para que hijos estáticos puedan animarse en cascada con
 * `group-data-[state=visible]:*` sin que Reveal necesite tocar `children`.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay,
  className = "",
  children,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <Tag
      ref={ref as Ref<never>}
      data-state={inView ? "visible" : "hidden"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`group transition-[opacity,transform] duration-700 ease-out ${
        inView ? "translate-y-0 scale-100 opacity-100" : HIDDEN_CLASSES[variant]
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
