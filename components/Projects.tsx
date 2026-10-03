import type { ReactNode } from "react";
import { projects } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import GlowCard from "./GlowCard";
import ProjectPanel from "./ProjectPanel";

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <dt className="font-mono text-xs font-medium uppercase tracking-wider text-accent">{label}</dt>
    <dd className="mt-1.5 leading-relaxed text-muted">{children}</dd>
  </div>
);

export default function Projects() {
  return (
    <Section num="04" id="projects" eyebrow="Projects" title="Case studies you can play with">
      <p className="-mt-6 mb-10 max-w-2xl text-muted">
        Each project has a small interactive simulation of the idea behind it. Click around, it
        won&apos;t break anything.
      </p>
      <div className="grid gap-8">
        {projects.map((p, i) => (
          <Reveal key={p.title}>
            <GlowCard as="article" className="p-6 md:p-10">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{p.title}</h3>
                <span
                  aria-hidden="true"
                  className="text-gradient font-mono text-5xl font-bold leading-none opacity-70 md:text-6xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.25fr]">
                <div>
                  <dl className="grid gap-5">
                    <Row label="Problem">{p.problem}</Row>
                    <Row label="What I built">{p.built}</Row>
                    <Row label="Outcome">{p.outcome}</Row>
                  </dl>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies used">
                    {p.tech.map((t) => (
                      <li key={t} className="rounded-full border border-line bg-accent-soft px-3 py-1 text-sm">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <ProjectPanel project={p} index={i} />
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
