import { Reveal } from "@/components/ui/reveal";

import { SectionHeading } from "./section-heading";

export function AudienceSection() {
  return (
    <Reveal as="section" className="mt-20 sm:mt-28">
      <SectionHeading
        title="¿Para quién es esta"
        highlight="clase en vivo de 2 días?"
      />

      <p className="font-body mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-ivory/75 text-pretty sm:text-lg">
        Este{" "}
        <span className="font-heading font-bold text-ivory">
          ENTRENAMIENTO EN VIVO
        </span>{" "}
        es para ti si estás cansado de ver cómo la plata en el banco no rinde y
        quieres invertir en propiedades seguras que te den tranquilidad. Aquí no
        venimos a hablarte de teoría de libros ni fórmulas mágicas: te voy a
        enseñar a mirar los números reales de cualquier propiedad en{" "}
        <span className="font-heading font-bold text-gold">15 MINUTOS</span>{" "}
        para que sepas si es un buen negocio, compres barato y asegures tu
        ganancia desde el primer día.
      </p>

      <h3 className="font-heading mt-10 text-center text-sm tracking-[0.22em] text-gold uppercase">
        ¿Quién debería asistir?
      </h3>

      <p className="font-body mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-ivory/70 text-pretty">
        Cualquier persona que tenga ahorros o capacidad de pago y no quiera
        seguir arriesgando su plata por comprar con emoción o por creerle
        ciegamente a los precios inflados de las salas de ventas y páginas de
        internet.
      </p>
    </Reveal>
  );
}
