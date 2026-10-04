import { doom, stark } from "@/lib/content";
import Terminal from "./Terminal";
import Reveal from "./Reveal";
import Ornament from "./doom/Ornament";

const SECRETS = [
  ["help", "the full list of commands"],
  ["projects", "every machine I've built"],
  ["lightning", "you'll see"],
  ["kneel", "please don't"],
  ["sudo hire-me", "the fastest path to my inbox"],
];

export default function ConsoleSection() {
  return (
    <section id="console" data-anim aria-labelledby="console-title" className="relative py-24 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Reveal>
          <Ornament className="mb-6" />
          <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            <span className="doom-only">{doom.console.eyebrow}</span>
            <span className="stark-only">{stark.console.eyebrow}</span>
          </p>
          <h2 id="console-title" className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            <span className="doom-only">{doom.console.title}</span>
            <span className="stark-only">{stark.console.title}</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{doom.console.text}</p>
          <dl className="mt-8 grid max-w-md grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm">
            {SECRETS.map(([cmd, desc]) => (
              <div key={cmd} className="contents">
                <dt className="font-mono text-accent">{cmd}</dt>
                <dd className="text-muted">{desc}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1} className="flex min-w-0 justify-center lg:justify-end">
          <Terminal />
        </Reveal>
      </div>
    </section>
  );
}
