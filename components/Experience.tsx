import { experience } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import GlowCard from "./GlowCard";

export default function Experience() {
  return (
    <Section num="03" id="experience" eyebrow="Experience" title="Where I've been building">
      <Reveal>
        <div className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h3 className="text-2xl font-semibold">{experience.role}</h3>
          <span className="rounded-full bg-gradient-accent px-3 py-1 text-xs font-semibold text-on-accent">
            {experience.period}
          </span>
        </div>
        <p className="-mt-6 mb-10 text-muted">
          {experience.company} · {experience.location}
        </p>
      </Reveal>
      <ol className="relative ml-3 border-l border-line">
        <span
          aria-hidden="true"
          className="bg-gradient-accent absolute -left-px top-0 h-full w-px opacity-60"
        />
        {experience.highlights.map((h, i) => (
          <li key={h.title} className="relative pb-6 pl-8 last:pb-0 md:pl-10">
            <span
              aria-hidden="true"
              className="bg-gradient-accent absolute -left-[7px] top-6 h-3.5 w-3.5 rounded-full ring-4 ring-bg"
            />
            <Reveal delay={Math.min(i * 0.04, 0.16)}>
              <GlowCard className="p-5 md:p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-accent2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="font-semibold">{h.title}</h4>
                </div>
                <p className="mt-2 leading-relaxed text-muted">{h.text}</p>
              </GlowCard>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
