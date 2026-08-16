import { Reveal } from "@/components/ui/reveal";

import { SectionHeading } from "./section-heading";

export function AudienceSection() {
  return (
    <Reveal as="section" className="mt-20 sm:mt-28">
      <SectionHeading
        title="¿Para quién es este"
        highlight="entrenamiento virtual de 2 días?"
      />

      <p className="font-body mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-ivory/75 text-pretty sm:text-lg">
        Esta{" "}
        <span className="font-heading font-bold text-ivory">
          CLASE ONLINE EN VIVO
        </span>{" "}
        es para ti si estás en Estados Unidos trabajando duro, pasando frío y
        metiendo turnos largos, y quieres que cada dólar que mandes a Colombia
        se convierta en{" "}
        <span className="font-heading font-bold text-gold">RESPALDO REAL</span>{" "}
        y no en plata de bolsillo que desaparece. Te voy a enseñar a negociar en
        Colombia a distancia como si estuvieras allá parado, para que compres
        barato, multipliques tu esfuerzo y armes un piso firme para cuando
        decidas regresar.
      </p>

      <h3 className="font-heading mt-10 text-center text-sm tracking-[0.22em] text-gold uppercase">
        ¿Quién debería asistir?
      </h3>

      <p className="font-body mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-ivory/70 text-pretty">
        Todo colombiano en el exterior que quiera dejar de comprar a ciegas por
        fotos bonitas de WhatsApp y busque un método simple para comprar
        propiedades con descuento real y hacer rendir su dinero con total
        tranquilidad.
      </p>
    </Reveal>
  );
}
