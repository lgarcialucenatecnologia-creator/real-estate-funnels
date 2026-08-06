interface SectionHeadingProps {
  title: string;
  highlight?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  highlight,
  eyebrow,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      {eyebrow && (
        <p className="font-body mb-3 text-xs tracking-[0.28em] text-gold uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl leading-[0.95] font-black text-balance text-ivory italic uppercase [font-stretch:condensed] sm:text-4xl lg:text-5xl">
        {title}
        {highlight ? (
          <>
            {" "}
            <span className="text-gold-gradient">{highlight}</span>
          </>
        ) : null}
      </h2>
    </div>
  );
}
