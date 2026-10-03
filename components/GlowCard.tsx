"use client";

import type { ReactNode, PointerEvent } from "react";

/** Card whose border/background glows toward the cursor. */
export default function GlowCard({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
}) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag
      onPointerMove={onMove}
      className={`glow-card rounded-2xl border border-line bg-surface ${className}`}
    >
      {children}
    </Tag>
  );
}
