import Image from "next/image";

import portrait from "@/assets/images/luisfer-garcia.png";
import mentorPortrait from "@/assets/images/luisfer-mentor.png";

interface LuisferPortraitProps {
  className?: string;
  priority?: boolean;
  size?: "hero" | "mentor" | "headline";
}

/** Retrato en PNG transparente (mejor para fotos que un SVG). */
export function LuisferPortrait({
  className = "",
  priority = false,
  size = "hero",
}: LuisferPortraitProps) {
  if (size === "headline") {
    return (
      <div className={`relative h-full min-h-0 w-full ${className}`}>
        <div
          aria-hidden="true"
          className="animate-float-slow pointer-events-none absolute inset-x-[10%] bottom-0 h-[35%] rounded-full bg-gold/25 blur-2xl"
        />
        <Image
          src={portrait}
          alt="Luis Fernando García, mentor del Método OPORTUNO"
          width={406}
          height={590}
          priority={priority}
          sizes="220px"
          className="relative z-10 h-full w-full select-none object-contain object-bottom drop-shadow-[0_16px_32px_rgba(0,0,0,0.45)]"
          draggable={false}
        />
      </div>
    );
  }

  // El retrato del mentor es un plano de busto propio, para no repetir la
  // misma foto del hero. Su recorte inferior lleva un degradado a transparente,
  // así que no necesita el resplandor dorado bajo los pies.
  const isMentor = size === "mentor";
  const source = isMentor ? mentorPortrait : portrait;

  const sizes = isMentor
    ? "w-full max-w-[320px] lg:max-w-[380px]"
    : "w-full max-w-[280px] sm:max-w-[320px]";

  return (
    <div className={`relative mx-auto ${sizes} ${className}`}>
      {!isMentor && (
        <div
          aria-hidden="true"
          className="animate-float-slow pointer-events-none absolute inset-x-[8%] bottom-[0%] h-[32%] rounded-full bg-gold/28 blur-3xl"
        />
      )}
      <Image
        src={source}
        alt="Luis Fernando García, mentor del Método OPORTUNO"
        priority={priority}
        sizes={isMentor ? "(max-width: 1024px) 320px, 380px" : "320px"}
        className="relative z-10 mx-auto h-auto w-full select-none object-contain object-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
        draggable={false}
      />
    </div>
  );
}
