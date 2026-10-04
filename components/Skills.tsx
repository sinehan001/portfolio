"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { skillGroups } from "@/lib/content";
import Section from "./Section";
import GlowCard from "./GlowCard";
import PowerCore from "./doom/PowerCore";

export default function Skills() {
  const [filter, setFilter] = useState<string>("All");
  const tabsRef = useRef<HTMLDivElement>(null);

  // Keep the selected tab centred in the swipeable row on small screens.
  useEffect(() => {
    const row = tabsRef.current;
    const btn = row?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');
    if (!row || !btn || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2, behavior: "smooth" });
  }, [filter]);
  const reduce = useReducedMotion();
  const tabs = ["All", ...skillGroups.map((g) => g.title)];

  return (
    <Section num="02" id="skills" eyebrow="Skills" title="Tools I work with">
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div className="lg:sticky lg:top-24">
        <PowerCore
          groups={skillGroups.map((g) => ({ title: g.title, count: g.items.length }))}
          selected={filter}
          onSelect={setFilter}
        />
      </div>
      <div className="min-w-0">
      <div
        ref={tabsRef}
        role="group"
        aria-label="Filter skills by category"
        className="mb-8 flex max-w-full gap-2 overflow-x-auto py-1 [scrollbar-width:none] max-lg:px-3 max-lg:[mask-image:linear-gradient(90deg,transparent,#000_12px,#000_calc(100%-12px),transparent)] lg:flex-wrap lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={filter === t}
            onClick={() => setFilter(t)}
            className={`relative shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${
              filter === t
                ? "border-transparent text-on-accent"
                : "border-line bg-surface text-muted hover:border-accent hover:text-fg"
            }`}
          >
            {filter === t && (
              <motion.span
                layoutId="skill-pill"
                className="bg-gradient-accent absolute inset-0 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {skillGroups.map((g, gi) => {
          const dim = filter !== "All" && filter !== g.title;
          const focus = filter === g.title;
          return (
            <motion.div
              key={g.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (gi % 3) * 0.08 }}
              className={`h-full ${dim ? "max-lg:hidden" : ""}`}
            >
              <div
                className={`h-full transition duration-500 ${dim ? "scale-[0.97] opacity-25 blur-[1px]" : ""}`}
              >
              <GlowCard
                className={`h-full p-6 ${focus ? "border-accent shadow-[0_0_60px_-15px_var(--accent)]" : ""}`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold">{g.title}</h3>
                  <span className="font-mono text-xs text-muted">
                    {String(g.items.length).padStart(2, "0")}
                  </span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.15 + i * 0.04 }}
                      whileHover={reduce ? undefined : { y: -3, scale: 1.06 }}
                      className="cursor-default rounded-full border border-line bg-accent-soft px-3 py-1 text-sm hover:border-accent"
                    >
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </GlowCard>
              </div>
            </motion.div>
          );
        })}
      </div>
      </div>
      </div>
    </Section>
  );
}
