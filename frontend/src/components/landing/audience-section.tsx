import { Reveal } from "@/components/ui/reveal";

import { SectionHeading } from "./section-heading";

export function AudienceSection() {
  return (
    <Reveal as="section" className="mt-20 sm:mt-28">
      <SectionHeading
        title="¿Para quién es"
        highlight="este webinar en vivo?"
      />

      <p className="font-body mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-ivory/75 text-pretty sm:text-lg">
        Este <span className="font-heading font-bold text-ivory">WEBINAR EN VIVO</span>{" "}
        de{" "}
        <span className="font-heading font-bold text-gold">2 DÍAS</span> es
        para ti si estás listo para dejar de improvisar con tus ahorros y
        aprender a estructurar un portafolio de inversión inmobiliaria seguro.
        Aprenderás a aplicar la metodología técnica de Meta OPORTUNO para tomar
        decisiones con números fríos, ahorrándote años de incertidumbre,
        evitando errores costosos y asegurando tu ganancia desde el primer día.
      </p>

      <h3 className="font-heading mt-10 text-center text-sm tracking-[0.22em] text-gold uppercase">
        ¿Quién debería asistir?
      </h3>

      <p className="font-body mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-ivory/70 text-pretty">
        Todo aquel que sienta incertidumbre sobre si su patrimonio está bien
        gestionado y que siga dependiendo del modelo tradicional de
        &quot;comprar y arrendar&quot; o de las promesas de la sala de ventas.
      </p>
    </Reveal>
  );
}
