"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/content";
import ArchDiagram from "./ArchDiagram";
import RagDemo from "./demos/RagDemo";
import LiveDashboard from "./demos/LiveDashboard";
import QueueSim from "./demos/QueueSim";
import MigrationSim from "./demos/MigrationSim";

const DEMOS = {
  rag: RagDemo,
  dashboard: LiveDashboard,
  queue: QueueSim,
  migration: MigrationSim,
};

export default function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const tabs = [
    ...(project.demo ? (["demo"] as const) : []),
    ...(project.architecture ? (["arch"] as const) : []),
  ];
  const [tab, setTab] = useState<(typeof tabs)[number]>(tabs[0]);
  if (!tabs.length) return null;
  const Demo = project.demo ? DEMOS[project.demo] : null;

  return (
    <div className="rounded-2xl border border-line bg-bg/60 p-4 md:p-5" data-cursor="Play">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" aria-label="Project views" className="inline-flex rounded-full border border-line p-0.5">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              id={`tab-${index}-${t}`}
              aria-selected={tab === t}
              aria-controls={`panel-${index}`}
              onClick={() => setTab(t)}
              className={`relative rounded-full px-3 py-1 text-xs transition ${
                tab === t ? "text-on-accent" : "text-muted hover:text-fg"
              }`}
            >
              {tab === t && (
                <motion.span
                  layoutId={`project-tab-${index}`}
                  className="bg-gradient-accent absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{t === "demo" ? "▶ Live demo" : "Architecture"}</span>
            </button>
          ))}
        </div>
        <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-300">
          Simulated · sample data
        </span>
      </div>

      <div role="tabpanel" id={`panel-${index}`} aria-labelledby={`tab-${index}-${tab}`}>
        {tab === "demo" && Demo ? (
          <>
            {project.demoLabel && <p className="mb-4 text-xs text-muted">{project.demoLabel}</p>}
            <Demo />
          </>
        ) : project.architecture ? (
          <ArchDiagram data={project.architecture} />
        ) : null}
      </div>
    </div>
  );
}
