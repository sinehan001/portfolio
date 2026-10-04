import type { ReactNode } from "react";
import { doom, stark } from "@/lib/content";
import ScrambleText from "./ScrambleText";
import WordsReveal from "./WordsReveal";
import Ornament from "./doom/Ornament";

const ROMAN: Record<string, string> = {
  about: "I",
  skills: "II",
  experience: "III",
  projects: "IV",
  education: "V",
  contact: "VI",
};

export default function Section({
  id,
  num,
  eyebrow,
  title,
  children,
}: {
  id: string;
  num: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const lore = (doom.lore as Record<string, string>)[id] ?? eyebrow;
  const ironLore = (stark.lore as Record<string, string>)[id] ?? eyebrow;
  const roman = ROMAN[id] ?? num;
  return (
    <section id={id} data-anim aria-labelledby={`${id}-title`} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Ornament className="mb-6" />
        <p className="font-display flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          <span className="text-gilt">{roman}</span>
          <span aria-hidden="true" className="h-px w-10 bg-accent2/60" />
          <ScrambleText text={lore} className="doom-only" />
          <ScrambleText text={ironLore} className="stark-only" />
          {lore !== eyebrow && (
            <span className="font-sans text-[11px] font-normal normal-case tracking-normal text-muted">
              · {eyebrow}
            </span>
          )}
        </p>
        <h2
          id={`${id}-title`}
          className="font-display mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl"
        >
          <WordsReveal text={title} />
        </h2>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}
