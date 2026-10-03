"use client";

import type { ReactNode, PointerEvent } from "react";

/** Card whose border/background glows toward the cursor; optional 3D tilt. */
export default function GlowCard({
  children,
  className = "",
  as: Tag = "div",
  tilt = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
  tilt?: boolean;
}) {
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (tilt && e.pointerType === "mouse") {
      const rx = (y / r.height - 0.5) * -10;
      const ry = (x / r.width - 0.5) * 10;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    }
  };
  const onLeave = (e: PointerEvent<HTMLElement>) => {
    if (tilt) e.currentTarget.style.transform = "";
  };

  return (
    <Tag
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`glow-card rounded-2xl border border-line bg-surface ${className}`}
    >
      {children}
    </Tag>
  );
}
