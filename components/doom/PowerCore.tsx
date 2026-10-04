"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { strike } from "@/lib/doom";

type Group = { title: string; count: number };

const C = 200;
const rad = (d: number) => (d * Math.PI) / 180;
const pt = (r: number, deg: number): [number, number] => [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))];
const poly = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
const hex = (r: number) => poly(Array.from({ length: 6 }, (_, k) => pt(r, -90 + k * 60)));
/** Segment k spans hexagon vertex k → k+1; its centre angle is -60 + 60k. */
const mid = (k: number) => -60 + k * 60;

/**
 * Interactive centrepiece for the Skills section. Iron theme: a hexagonal
 * nano-tech arc reactor. Doom theme: a brilliant-cut emerald. Each of the six
 * plates/facets is a skill group; the core shows all groups and overcharges.
 */
export default function PowerCore({
  groups,
  selected,
  onSelect,
}: {
  groups: Group[];
  selected: string;
  onSelect: (title: string) => void;
}) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const [surge, setSurge] = useState(0);
  const coreRef = useRef<HTMLDivElement>(null);
  const six = groups.slice(0, 6);
  const activeIndex = six.findIndex((g) => g.title === selected);
  const lit = (k: number) => k === activeIndex || k === hover;

  const overcharge = () => {
    onSelect("All");
    setSurge((n) => n + 1);
    const r = coreRef.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dark = document.documentElement.classList.contains("dark");
    for (let i = 0; i < 4; i++) {
      const a = rad(-45 + i * 90 + (Math.random() - 0.5) * 40);
      const d = 260 + Math.random() * 160;
      window.setTimeout(
        () => strike({ fromX: cx, fromY: cy, x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * (dark ? 1 : 0.8) }),
        i * 90,
      );
    }
  };

  const segProps = (k: number, g: Group) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": `${g.title}: ${g.count} skills`,
    "aria-pressed": k === activeIndex,
    onClick: () => onSelect(k === activeIndex ? "All" : g.title),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(k === activeIndex ? "All" : g.title);
      }
    },
    onPointerEnter: () => setHover(k),
    onPointerLeave: () => setHover(null),
    onFocus: () => setHover(k),
    onBlur: () => setHover(null),
    className: "cursor-pointer outline-none",
  });

  const enter = (k: number) => {
    const [dx, dy] = [Math.cos(rad(mid(k))) * 60, Math.sin(rad(mid(k))) * 60];
    return {
      initial: reduce ? false : ({ opacity: 0, x: dx, y: dy } as const),
      whileInView: { opacity: 1, x: 0, y: 0 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.7, delay: 0.15 + k * 0.08, ease: [0.2, 0.8, 0.2, 1] as const },
    };
  };
  const coreEnter = {
    initial: reduce ? false : ({ opacity: 0, scale: 0.3 } as const),
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.8, delay: 0.75, type: "spring" as const, stiffness: 160, damping: 14 },
  };

  const label =
    activeIndex >= 0
      ? `${six[activeIndex].title} · ${six[activeIndex].count} tools`
      : hover !== null
        ? `${six[hover].title} · ${six[hover].count} tools`
        : "All systems";

  const onCoreKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      overcharge();
    }
  };

  return (
    <div className="flex flex-col items-center" data-cursor="Power">
      <div ref={coreRef} className="relative w-full max-w-[420px]">
        {/* ================= Iron: nano-tech arc reactor ================= */}
        <svg viewBox="0 0 400 400" className="stark-only h-auto w-full" aria-label="Arc reactor skill selector" role="group">
          <defs>
            <radialGradient id="pc-core" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.35" stopColor="#dff7ff" />
              <stop offset="0.7" stopColor="#5fd0ff" />
              <stop offset="1" stopColor="#0b6fa8" />
            </radialGradient>
            <radialGradient id="pc-aura" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#38bdf8" stopOpacity="0.55" />
              <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="pc-red" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0" stopColor="#ff4a3d" />
              <stop offset="0.5" stopColor="#b3121d" />
              <stop offset="1" stopColor="#5c060a" />
            </linearGradient>
            <linearGradient id="pc-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff1b0" />
              <stop offset="0.45" stopColor="#e3ad2f" />
              <stop offset="1" stopColor="#8f6410" />
            </linearGradient>
            <linearGradient id="pc-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a434a" />
              <stop offset="1" stopColor="#12171b" />
            </linearGradient>
            <filter id="pc-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx={C} cy={C} r="196" fill="url(#pc-aura)" className="core-breathe" />

          {/* Housing: red chest plate, gold trim, dark well */}
          <polygon points={hex(188)} fill="url(#pc-red)" stroke="url(#pc-gold)" strokeWidth="4" strokeLinejoin="round" />
          {Array.from({ length: 6 }, (_, k) => {
            const [x1, y1] = pt(188, -90 + k * 60);
            const [x2, y2] = pt(170, -90 + k * 60);
            return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#pc-gold)" strokeWidth="3" />;
          })}
          <polygon points={hex(170)} fill="#0b0f12" stroke="#000" strokeOpacity="0.6" strokeWidth="2" strokeLinejoin="round" />

          {/* Six armour plates = six skill groups */}
          {six.map((g, k) => {
            const a0 = -90 + k * 60;
            const a1 = a0 + 60;
            const on = lit(k);
            return (
              <motion.g key={g.title} {...enter(k)} {...segProps(k, g)}>
                <polygon
                  points={poly([pt(162, a0 + 3.5), pt(162, a1 - 3.5), pt(106, a1 - 5), pt(106, a0 + 5)])}
                  fill={on ? "#0e3b55" : "url(#pc-metal)"}
                  stroke={on ? "#7dd3fc" : "#5b666e"}
                  strokeWidth={on ? 2 : 1}
                  style={{ transition: "fill .3s, stroke .3s" }}
                />
                <polyline
                  points={poly([pt(112, a0 + 8), pt(112, a1 - 8)])}
                  fill="none"
                  stroke="#7dd3fc"
                  strokeWidth={on ? 4 : 2.5}
                  strokeLinecap="round"
                  opacity={on ? 1 : 0.55}
                  filter={on ? "url(#pc-glow)" : undefined}
                />
                <circle cx={pt(150, mid(k))[0]} cy={pt(150, mid(k))[1]} r="2.6" fill={on ? "#e0f7ff" : "#8a959c"} />
              </motion.g>
            );
          })}

          {/* Coil ring */}
          <circle cx={C} cy={C} r="99" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.85" filter="url(#pc-glow)" />
          <g className="spin-slow" style={{ animationDuration: "24s" }}>
            {Array.from({ length: 24 }, (_, i) => {
              const [x1, y1] = pt(80, i * 15);
              const [x2, y2] = pt(94, i * 15);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9fe3ff" strokeWidth="3.4" strokeLinecap="round" opacity="0.8" />;
            })}
          </g>

          {/* Core */}
          <motion.g {...coreEnter} role="button"
            tabIndex={0}
            aria-label="Arc reactor core: show all skills and overcharge"
            onClick={overcharge}
            onKeyDown={onCoreKey}
            className="cursor-pointer outline-none">
            <circle cx={C} cy={C} r="72" fill="transparent" />
            <g key={surge} className={surge ? "core-surge" : undefined}>
              <circle cx={C} cy={C} r="64" fill="url(#pc-core)" filter="url(#pc-glow)" className="core-breathe" />
              <polygon points={hex(42)} fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="2" strokeLinejoin="round" />
              <circle cx={C} cy={C} r="22" fill="#ffffff" />
            </g>
          </motion.g>
        </svg>

        {/* ================= Doom: brilliant-cut emerald ================= */}
        <svg viewBox="0 0 400 400" className="doom-only h-auto w-full" aria-label="Emerald skill selector" role="group">
          <defs>
            <radialGradient id="pg-aura" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#3ddc84" stopOpacity="0.5" />
              <stop offset="1" stopColor="#3ddc84" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="pg-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6dd8a" />
              <stop offset="0.5" stopColor="#c9971c" />
              <stop offset="1" stopColor="#6e4b08" />
            </linearGradient>
            <linearGradient id="pg-e1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d6ffe7" />
              <stop offset="1" stopColor="#3ddc84" />
            </linearGradient>
            <linearGradient id="pg-e2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3ddc84" />
              <stop offset="1" stopColor="#0f6e3a" />
            </linearGradient>
            <linearGradient id="pg-e3" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1d9e5a" />
              <stop offset="1" stopColor="#053d20" />
            </linearGradient>
            <radialGradient id="pg-table" cx="0.4" cy="0.35" r="0.7">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.35" stopColor="#a8ffd0" />
              <stop offset="1" stopColor="#1fae5e" />
            </radialGradient>
            <filter id="pg-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx={C} cy={C} r="196" fill="url(#pg-aura)" className="core-breathe" />

          {/* Gold bezel with prongs and filigree */}
          <polygon points={hex(186)} fill="url(#pg-gold)" stroke="#3b2a05" strokeWidth="2" strokeLinejoin="round" />
          <circle cx={C} cy={C} r="174" fill="none" stroke="#3b2a05" strokeOpacity="0.5" strokeDasharray="2 6" />
          {Array.from({ length: 6 }, (_, k) => {
            const [x, y] = pt(184, -90 + k * 60);
            return <circle key={k} cx={x} cy={y} r="9" fill="url(#pg-gold)" stroke="#3b2a05" strokeWidth="1.5" />;
          })}
          <polygon points={hex(162)} fill="#042614" stroke="#3b2a05" strokeWidth="2" strokeLinejoin="round" />

          {/* Six facets = six skill groups */}
          {six.map((g, k) => {
            const a0 = -90 + k * 60;
            const a1 = a0 + 60;
            const T0 = pt(66, a0);
            const T1 = pt(66, a1);
            const G0 = pt(158, a0);
            const G1 = pt(158, a1);
            const on = lit(k);
            return (
              <motion.g key={g.title} {...enter(k)} {...segProps(k, g)}>
                <polygon
                  points={poly([T0, G0, G1])}
                  fill={on ? "url(#pg-e1)" : k % 2 ? "url(#pg-e2)" : "url(#pg-e3)"}
                  stroke={on ? "#eafff3" : "#063d22"}
                  strokeWidth={on ? 1.6 : 1}
                  style={{ transition: "fill .3s" }}
                />
                <polygon
                  points={poly([T0, G1, T1])}
                  fill={on ? "url(#pg-e2)" : k % 2 ? "url(#pg-e3)" : "url(#pg-e2)"}
                  stroke={on ? "#eafff3" : "#063d22"}
                  strokeWidth={on ? 1.6 : 1}
                  style={{ transition: "fill .3s" }}
                />
                {on && (
                  <polyline points={poly([pt(80, a0 + 8), pt(146, a0 + 14)])} stroke="#ffffff" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" filter="url(#pg-glow)" />
                )}
              </motion.g>
            );
          })}

          {/* Table (core) */}
          <motion.g {...coreEnter} role="button"
            tabIndex={0}
            aria-label="Emerald core: show all skills and overcharge"
            onClick={overcharge}
            onKeyDown={onCoreKey}
            className="cursor-pointer outline-none">
            <g key={surge} className={surge ? "core-surge" : undefined}>
              <polygon points={hex(66)} fill="url(#pg-table)" stroke="#eafff3" strokeWidth="1.5" strokeLinejoin="round" filter="url(#pg-glow)" className="core-breathe" />
              {Array.from({ length: 3 }, (_, i) => {
                const [x1, y1] = pt(66, -90 + i * 60);
                const [x2, y2] = pt(66, 90 + i * 60);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f6e3a" strokeOpacity="0.35" />;
              })}
              <polygon points={hex(30)} fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeLinejoin="round" />
            </g>
          </motion.g>

          {/* Glints */}
          {[
            [138, 120, 0],
            [282, 168, 1.2],
            [176, 292, 2.1],
          ].map(([x, y, d]) => (
            <path
              key={`${x}-${y}`}
              d={`M${x} ${y - 9} L${x + 2} ${y - 2} L${x + 9} ${y} L${x + 2} ${y + 2} L${x} ${y + 9} L${x - 2} ${y + 2} L${x - 9} ${y} L${x - 2} ${y - 2} Z`}
              fill="#ffffff"
              className="glint"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        </svg>
      </div>
      <p className="font-display mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent" aria-live="polite">
        {label}
      </p>
      <p className="mt-1 text-xs text-muted">Hover or tap a segment. Tap the core to overcharge.</p>
    </div>
  );
}
