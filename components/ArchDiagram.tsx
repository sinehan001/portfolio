"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ArchDiagramData } from "@/lib/content";

function Arrow({ i }: { i: number }) {
  return (
    <span className="packet-lane flex h-6 w-6 shrink-0 items-center justify-center md:h-5 md:w-8">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 rotate-90 text-accent md:rotate-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
      <span aria-hidden="true" className="packet hidden md:block" style={{ animationDelay: `${i * 0.3}s` }} />
    </span>
  );
}

export default function ArchDiagram({ data }: { data: ArchDiagramData }) {
  const reduce = useReducedMotion();
  return (
    <figure className="rounded-xl border border-line bg-bg p-4">
      <figcaption className="mb-4 text-xs uppercase tracking-wider text-muted">{data.label}</figcaption>
      <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        {data.columns.map((col, i) => (
          <motion.li
            key={col.join("|")}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center gap-2 md:flex-1 md:flex-row"
          >
            {i > 0 && <Arrow i={i} />}
            <div className="flex w-full flex-col gap-2">
              {col.map((node) => (
                <div
                  key={node}
                  className="rounded-lg border border-accent/40 bg-accent-soft px-2 py-2.5 text-center text-xs font-medium transition hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_0_20px_-6px_var(--accent)]"
                >
                  {node}
                </div>
              ))}
            </div>
          </motion.li>
        ))}
      </ol>
    </figure>
  );
}
