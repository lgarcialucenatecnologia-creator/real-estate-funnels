interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="leading-none">
      <p className="font-display text-lg font-black tracking-[0.16em] text-ivory uppercase [font-stretch:condensed] sm:text-xl">
        Luisfer García
      </p>
      {!compact && (
        <p className="mt-1 font-body text-[0.7rem] tracking-[0.32em] text-gold uppercase">
          Inversión inmobiliaria
        </p>
      )}
    </div>
  );
}
