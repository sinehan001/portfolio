import { about } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import GlowCard from "./GlowCard";

export default function About() {
  return (
    <Section num="01" id="about" eyebrow="About" title="Engineering that holds up in production">
      <div className="grid gap-10 md:grid-cols-[3fr_2fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="grid grid-cols-2 gap-4">
            {about.facts.map((f) => (
              <GlowCard key={f.label} className="p-5">
                <dt className="text-xs uppercase tracking-wider text-muted">{f.label}</dt>
                <dd className="mt-2 font-semibold">{f.value}</dd>
              </GlowCard>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
