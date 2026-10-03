import type { ReactNode } from "react";
import { projects } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import ArchDiagram from "./ArchDiagram";
import GlowCard from "./GlowCard";

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <dt className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
      {label}
    </dt>
    <dd className="mt-2 leading-relaxed text-muted">{children}</dd>
  </div>
);

export default function Projects() {
  return (
    <Section num="04" id="projects" eyebrow="Projects" title="Selected case studies">
      <div className="grid gap-6">
        {projects.map((p, i) => (
          <Reveal key={p.title}>
            <GlowCard as="article" className="p-6 md:p-10">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{p.title}</h3>
                <span
                  aria-hidden="true"
                  className="text-gradient font-mono text-4xl font-bold opacity-60 md:text-5xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <dl className="mt-8 grid gap-6 md:grid-cols-3">
                <Row label="Problem">{p.problem}</Row>
                <Row label="What I built">{p.built}</Row>
                <Row label="Outcome">{p.outcome}</Row>
              </dl>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies used">
                {p.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-line bg-accent-soft px-3 py-1 text-sm"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              {p.architecture && (
                <div className="mt-8">
                  <ArchDiagram data={p.architecture} />
                </div>
              )}
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
