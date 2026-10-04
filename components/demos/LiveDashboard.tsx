"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type Point = { calls: number; fails: number };

const N = 40;
const W = 400;
const H = 150;
const MAX = 160;

// Deterministic starting data so server and client render the same chart.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const rand = seeded(7);
const INITIAL: Point[] = Array.from({ length: N }, (_, i) => {
  const calls = 70 + Math.sin(i / 4) * 15 + rand() * 10;
  return { calls, fails: calls * (0.01 + rand() * 0.02) };
});

const ENDPOINTS = ["/orders", "/auth/login", "/payments"];

export default function LiveDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [series, setSeries] = useState<Point[]>(INITIAL);
  const [paused, setPaused] = useState(false);
  const [incident, setIncident] = useState(false);
  const incidentTicks = useRef(0);

  useEffect(() => {
    if (!inView || paused) return;
    const id = window.setInterval(() => {
      const hot = incidentTicks.current > 0;
      if (hot) {
        incidentTicks.current--;
        if (incidentTicks.current === 0) setIncident(false);
      }
      setSeries((s) => {
        const last = s[s.length - 1];
        const target = 75 + Math.sin(Date.now() / 5000) * 20;
        const calls = Math.min(
          150,
          Math.max(20, last.calls + (Math.random() - 0.5) * 14 + (target - last.calls) * 0.15),
        );
        const rate = hot ? 0.2 + Math.random() * 0.15 : 0.01 + Math.random() * 0.02;
        return [...s.slice(1), { calls, fails: calls * rate }];
      });
    }, 800);
    return () => window.clearInterval(id);
  }, [inView, paused]);

  const trigger = () => {
    incidentTicks.current = 8;
    setIncident(true);
    setPaused(false);
  };

  const x = (i: number) => (i / (N - 1)) * W;
  const y = (v: number) => H - (v / MAX) * H;
  const line = series.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.calls).toFixed(1)}`).join("");
  const area = `${line}L${W},${H}L0,${H}Z`;

  const last = series[series.length - 1];
  const rate = (last.fails / last.calls) * 100;
  const degraded = rate > 5;
  const totalFails = series.reduce((a, p) => a + p.fails, 0);
  const weights = incident ? [0.2, 0.15, 0.65] : [0.5, 0.32, 0.18];
  const epFails = weights.map((w) => Math.round(totalFails * w));
  const epMax = Math.max(...epFails, 1);

  return (
    <div ref={ref} className="space-y-4 text-sm">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Requests / s" value={Math.round(last.calls).toString()} />
        <Stat
          label="Failure rate"
          value={`${rate.toFixed(1)}%`}
          tone={degraded ? "bad" : "good"}
        />
        <div className="rounded-xl border border-line bg-bg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted">Status</div>
          <div className={`mt-1 flex items-center gap-1.5 font-semibold ${degraded ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
            <span className={`pulse-dot relative h-2 w-2 rounded-full ${degraded ? "bg-red-400" : "bg-emerald-400"}`} />
            {degraded ? "Degraded" : "Healthy"}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-bg p-3">
        <div className="mb-2 flex items-center justify-between text-[11px] text-muted">
          <span>API calls (line) · failures (bars)</span>
          <span className="font-mono">{paused ? "paused" : "live"}</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-36 w-full" role="img" aria-label="Simulated API traffic chart">
          <defs>
            <linearGradient id="dash-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.35 }} />
              <stop offset="100%" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} className="stroke-line" strokeDasharray="3 4" />
          ))}
          {series.map((p, i) => (
            <rect
              key={i}
              x={x(i) - 3}
              width="6"
              y={H - (p.fails / MAX) * H * 2.5}
              height={(p.fails / MAX) * H * 2.5}
              rx="1.5"
              className="fill-red-400/70 transition-all duration-500"
            />
          ))}
          <path d={area} fill="url(#dash-area)" className="transition-all duration-700" />
          <path d={line} fill="none" strokeWidth="2" className="stroke-accent transition-all duration-700" />
          <circle cx={x(N - 1)} cy={y(last.calls)} r="4" className="fill-accent" />
        </svg>
      </div>

      <div className="rounded-xl border border-line bg-bg p-3">
        <div className="mb-2 text-[11px] uppercase tracking-wider text-muted">Top failing endpoints</div>
        {ENDPOINTS.map((ep, i) => (
          <div key={ep} className="mb-1.5 flex items-center gap-3 font-mono text-xs">
            <span className="w-24 shrink-0">{ep}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <span
                className="block h-full rounded-full bg-red-400 transition-all duration-700"
                style={{ width: `${(epFails[i] / epMax) * 100}%` }}
              />
            </span>
            <span className="w-8 text-right text-muted">{epFails[i]}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={trigger}
          disabled={incident}
          className="rounded-full border border-red-400/60 bg-red-500/10 px-4 py-2 font-medium text-red-700 transition hover:bg-red-500/20 disabled:opacity-60 dark:text-red-300"
        >
          {incident ? "Incident in progress…" : "⚡ Simulate incident"}
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="rounded-full border border-line px-4 py-2 transition hover:border-accent"
        >
          {paused ? "▶ Resume" : "❚❚ Pause"}
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  return (
    <div className="rounded-xl border border-line bg-bg p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div
        className={`mt-1 font-mono text-lg font-semibold tabular-nums ${
          tone === "bad" ? "text-red-700 dark:text-red-400" : tone === "good" ? "text-emerald-700 dark:text-emerald-400" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
