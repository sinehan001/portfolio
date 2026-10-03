import { hero, skillGroups } from "@/lib/content";

const mask = "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)";

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`marquee overflow-hidden ${reverse ? "marquee-reverse" : ""}`}
      style={{ WebkitMaskImage: mask, maskImage: mask }}
    >
      <div className="marquee-track" aria-hidden="true">
        {doubled.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className={`mx-5 flex items-center gap-10 whitespace-nowrap font-semibold tracking-tight ${
              reverse ? "text-base text-muted/70" : "text-2xl text-muted md:text-3xl"
            }`}
          >
            {t}
            <span className="text-accent2 text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const second = skillGroups.flatMap((g) => g.items).filter((s) => !hero.marquee.includes(s));
  return (
    <div className="space-y-4 border-y border-line py-6">
      <Row items={hero.marquee} />
      <Row items={second} reverse />
    </div>
  );
}
