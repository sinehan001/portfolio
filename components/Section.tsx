import type { ReactNode } from "react";
import Reveal from "./Reveal";

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
    <section id={id} aria-labelledby={`${id}-title`} className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-accent">
            <span className="text-accent2">{num}</span>
            <span aria-hidden="true" className="h-px w-10 bg-gradient-accent" />
            {eyebrow}
          </p>
          <h2
            id={`${id}-title`}
            className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl"
          >
            {title}
          </h2>
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
