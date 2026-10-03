import { hero } from "@/lib/content";

export default function Marquee() {
  const items = [...hero.marquee, ...hero.marquee];
  return (
    <div
      className="marquee overflow-hidden border-y border-line py-5"
      aria-label="Technologies I work with"
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
      }}
    >
      <div className="marquee-track" aria-hidden="true">
        {items.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="mx-6 flex items-center gap-12 whitespace-nowrap text-lg font-medium text-muted"
          >
            {t}
            <span className="text-accent2">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
