"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { experience } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import GlowCard from "./GlowCard";

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <Section num="03" id="experience" eyebrow="Experience" title="Where I've been building">
      <Reveal>
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h3 className="text-2xl font-semibold">{experience.role}</h3>
          <span className="bg-gradient-accent rounded-full px-3 py-1 text-xs font-semibold text-on-accent">
            {experience.period}
          </span>
        </div>
        <p className="mb-12 text-muted">
          {experience.company} · {experience.location}
        </p>
      </Reveal>

      <ol ref={listRef} className="relative ml-3">
        <span aria-hidden="true" className="absolute left-0 top-0 h-full w-px bg-line" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY }}
          className="bg-gradient-accent absolute left-0 top-0 h-full w-px origin-top shadow-[0_0_12px_var(--accent)]"
        />
        {experience.highlights.map((h, i) => (
          <li key={h.title} className="relative pb-6 pl-8 last:pb-0 md:pl-12">
            <motion.span
              aria-hidden="true"
              className="absolute -left-[7px] top-6 h-3.5 w-3.5 overflow-hidden rounded-full border-2 border-line bg-bg"
              whileInView={{ scale: [1, 1.6, 1] }}
              viewport={{ once: true, margin: "-45% 0px -45% 0px" }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                className="bg-gradient-accent absolute inset-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-45% 0px -45% 0px" }}
              />
            </motion.span>
            <Reveal delay={0.05}>
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
