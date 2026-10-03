"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { doom, site } from "@/lib/content";
import { strike } from "@/lib/doom";
import MaskGlyph from "./MaskGlyph";

const R = 46;
const C = 2 * Math.PI * R;
const HOLD_MS = 1100;

/** Press and hold to "summon": charges a ring, calls down lightning, then opens email. */
export default function SummonButton() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "holding" | "done">("idle");
  const btnRef = useRef<HTMLButtonElement>(null);
  const raf = useRef(0);
  const startAt = useRef(0);

  const complete = () => {
    setPhase("done");
    setProgress(1);
    const r = btnRef.current?.getBoundingClientRect();
    if (r) {
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      strike({ x: cx, y: cy });
      window.setTimeout(() => strike({ x: cx - 40, y: cy + 10 }), 120);
      window.setTimeout(() => strike({ x: cx + 40, y: cy + 10 }), 220);
    }
    window.setTimeout(() => {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("You have been summoned")}`;
    }, 700);
    window.setTimeout(() => {
      setPhase("idle");
      setProgress(0);
    }, 3200);
  };

  const tick = (now: number) => {
    const p = Math.min(1, (now - startAt.current) / HOLD_MS);
    setProgress(p);
    if (p >= 1) complete();
    else raf.current = requestAnimationFrame(tick);
  };

  const begin = () => {
    if (phase !== "idle") return;
    setPhase("holding");
    startAt.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };
  const cancel = () => {
    if (phase !== "holding") return;
    cancelAnimationFrame(raf.current);
    setPhase("idle");
    setProgress(0);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
      e.preventDefault();
      begin();
    }
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") cancel();
  };

  const label =
    phase === "done" ? doom.summon.done : phase === "holding" ? doom.summon.holding : doom.summon.hold;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        ref={btnRef}
        type="button"
        onPointerDown={begin}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onContextMenu={(e) => e.preventDefault()}
        data-cursor="Hold"
        aria-label={`${doom.summon.hold}: press and hold to email ${site.name}`}
        className={`summon-ring group relative grid h-40 w-40 select-none place-items-center rounded-full transition-transform active:scale-95 ${
          phase === "holding" ? "holding" : ""
        }`}
        style={{ WebkitTouchCallout: "none", touchAction: "manipulation" }}
      >
        <span
          aria-hidden="true"
          className="iron absolute inset-3 rounded-full border border-line"
          style={{ boxShadow: `0 0 ${20 + progress * 60}px ${progress * 12}px var(--glow)` }}
        />
        <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="var(--border)" strokeWidth="2" />
          <circle
            className="progress"
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            style={{ filter: "drop-shadow(0 0 6px var(--accent))" }}
          />
        </svg>
        <span className="relative flex flex-col items-center gap-1.5">
          <MaskGlyph className={`h-10 w-10 transition-transform ${phase === "holding" ? "scale-110" : "group-hover:scale-105"}`} />
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.18em]">{label}</span>
        </span>
      </button>
      <span className="text-xs text-muted" aria-live="polite">
        {phase === "done" ? "Opening your mail client…" : "Press and hold"}
      </span>
    </div>
  );
}
