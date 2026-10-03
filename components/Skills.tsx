import { skillGroups } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import GlowCard from "./GlowCard";

export default function Skills() {
  return (
    <Section num="02" id="skills" eyebrow="Skills" title="Tools I work with">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={g.title} delay={(i % 3) * 0.08}>
            <GlowCard className="h-full p-6">
              <h3 className="text-lg font-semibold">{g.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-line bg-accent-soft px-3 py-1 text-sm transition hover:border-accent"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
