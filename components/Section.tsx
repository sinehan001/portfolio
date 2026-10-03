import type { ReactNode } from "react";
import ScrambleText from "./ScrambleText";
import WordsReveal from "./WordsReveal";

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
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <p className="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-accent">
          <span className="text-accent2">{num}</span>
          <span aria-hidden="true" className="bg-gradient-accent h-px w-10" />
          <ScrambleText text={eyebrow} />
        </p>
        <h2
          id={`${id}-title`}
          className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl"
        >
          <WordsReveal text={title} />
        </h2>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}
