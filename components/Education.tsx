import { certification, education } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import GlowCard from "./GlowCard";

export default function Education() {
  return (
    <Section num="05" id="education" eyebrow="Credentials" title="Certification & education">
      <div className="grid gap-5 md:grid-cols-2">
        <Reveal>
          <GlowCard className="h-full p-7">
            <p className="font-mono text-xs uppercase tracking-wider text-accent">Certification</p>
            <h3 className="mt-3 text-xl font-semibold">{certification.name}</h3>
            <p className="mt-1 text-muted">{certification.issuer}</p>
            <p className="mt-4 text-sm text-muted">Valid {certification.validity}</p>
          </GlowCard>
        </Reveal>
        <Reveal delay={0.08}>
          <GlowCard className="h-full p-7">
            <p className="font-mono text-xs uppercase tracking-wider text-accent">Education</p>
            <h3 className="mt-3 text-xl font-semibold">{education.degree}</h3>
            <p className="mt-1 text-muted">{education.school}</p>
            <p className="mt-4 text-sm text-muted">
              {education.year} · {education.score}
            </p>
          </GlowCard>
        </Reveal>
      </div>
    </Section>
  );
}
