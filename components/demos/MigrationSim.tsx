"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Phase = "serving" | "draining" | "upgrading" | "checking";
type Inst = { v: 8 | 24; phase: Phase };
type Mode = "rolling" | "bigbang";

const COUNT = 6;
const fresh = (): Inst[] => Array.from({ length: COUNT }, () => ({ v: 8, phase: "serving" }));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const PHASE_STYLE: Record<Phase, string> = {
  serving: "bg-emerald-400",
  draining: "bg-amber-400",
  upgrading: "bg-accent2",
  checking: "bg-sky-400",
};

export default function MigrationSim() {
  const reduce = useReducedMotion();
  const [insts, setInsts] = useState<Inst[]>(fresh);
  const [running, setRunning] = useState<Mode | null>(null);
  const [lastMode, setLastMode] = useState<Mode | null>(null);
  const [served, setServed] = useState(0);
  const [failed, setFailed] = useState(0);
  const [done, setDone] = useState(false);
  const instsRef = useRef<Inst[]>(fresh());
  const runId = useRef(0);

  const update = (fn: (prev: Inst[]) => Inst[]) => {
    instsRef.current = fn(instsRef.current);
    setInsts(instsRef.current);
  };

  // Simulated traffic: the load balancer routes to whatever is serving.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const capacity = instsRef.current.filter((i) => i.phase === "serving").length;
      if (capacity > 0) setServed((s) => s + 20 + Math.round(Math.random() * 10));
      else setFailed((f) => f + 18 + Math.round(Math.random() * 12));
    }, 150);
    return () => window.clearInterval(id);
  }, [running]);

  const reset = () => {
    runId.current++;
    instsRef.current = fresh();
    setInsts(instsRef.current);
    setServed(0);
    setFailed(0);
    setDone(false);
    setRunning(null);
  };

  const start = async (mode: Mode) => {
    reset();
    const id = runId.current;
    setRunning(mode);
    setLastMode(mode);
    const k = reduce ? 0.3 : 1;
    const set = (idx: number[] | "all", phase: Phase, v?: 8 | 24) =>
      update((prev) =>
        prev.map((inst, i) =>
          idx === "all" || idx.includes(i) ? { v: v ?? inst.v, phase } : inst,
        ),
      );

    if (mode === "rolling") {
      for (let i = 0; i < COUNT; i++) {
        if (runId.current !== id) return;
        set([i], "draining");
        await sleep(450 * k);
        if (runId.current !== id) return;
        set([i], "upgrading");
        await sleep(650 * k);
        if (runId.current !== id) return;
        set([i], "checking");
        await sleep(400 * k);
        if (runId.current !== id) return;
        set([i], "serving", 24);
      }
    } else {
      set("all", "draining");
      await sleep(500 * k);
      if (runId.current !== id) return;
      set("all", "upgrading");
      await sleep(1800 * k);
      if (runId.current !== id) return;
      set("all", "checking");
      await sleep(700 * k);
      if (runId.current !== id) return;
      set("all", "serving", 24);
    }
    await sleep(300);
    if (runId.current !== id) return;
    setRunning(null);
    setDone(true);
  };

  const capacity = insts.filter((i) => i.phase === "serving").length;
  const upgraded = insts.filter((i) => i.v === 24).length;

  return (
    <div className="space-y-4 text-sm">
      <div className="rounded-xl border border-line bg-bg p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted">
          <span>Nginx load balancer</span>
          <span className="font-mono">
            capacity {capacity}/{COUNT}
          </span>
        </div>
        <div className="packet-lane h-2 overflow-hidden rounded-full bg-line">
          <div
            className={`h-full rounded-full transition-all duration-300 ${capacity === 0 ? "bg-red-400" : "bg-gradient-accent"}`}
            style={{ width: `${(capacity / COUNT) * 100}%` }}
          />
          {running && capacity > 0 && (
            <>
              <span className="packet" />
              <span className="packet" style={{ animationDelay: "0.5s" }} />
              <span className="packet" style={{ animationDelay: "1s" }} />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {insts.map((inst, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-xl border p-3 transition ${
              inst.phase === "serving" ? "border-line bg-bg" : "border-accent2/50 bg-accent-soft"
            }`}
          >
            {inst.phase === "upgrading" && <span aria-hidden="true" className="shimmer absolute inset-0" />}
            <div className="relative flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted">node-{i + 1}</span>
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                  inst.v === 24 ? "bg-gradient-accent text-on-accent" : "bg-line text-muted"
                }`}
              >
                v{inst.v}
              </span>
            </div>
            <div className="relative mt-2 flex items-center gap-1.5 text-xs">
              <span className={`h-2 w-2 rounded-full ${PHASE_STYLE[inst.phase]}`} />
              {inst.phase}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-line bg-bg p-2">
          <div className="text-[10px] uppercase tracking-wider text-muted">Upgraded</div>
          <div className="font-mono text-lg font-semibold tabular-nums">
            {upgraded}/{COUNT}
          </div>
        </div>
        <div className="rounded-xl border border-line bg-bg p-2">
          <div className="text-[10px] uppercase tracking-wider text-muted">Served</div>
          <div className="font-mono text-lg font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">{served}</div>
        </div>
        <div className="rounded-xl border border-line bg-bg p-2">
          <div className="text-[10px] uppercase tracking-wider text-muted">Failed</div>
          <div className={`font-mono text-lg font-semibold tabular-nums ${failed ? "text-red-700 dark:text-red-400" : ""}`}>
            {failed}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="min-h-5 text-xs">
        {done && lastMode === "rolling" && (
          <span className="text-emerald-700 dark:text-emerald-400">
            ✔ Rolling rollout: all instances on v24, zero failed requests.
          </span>
        )}
        {done && lastMode === "bigbang" && (
          <span className="text-red-700 dark:text-red-400">
            ✖ All-at-once: every instance was down at the same time, so {failed} requests failed.
          </span>
        )}
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => start("rolling")}
          disabled={!!running}
          className="bg-gradient-accent rounded-full px-4 py-2 font-medium text-on-accent shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          ▶ Rolling rollout
        </button>
        <button
          type="button"
          onClick={() => start("bigbang")}
          disabled={!!running}
          className="rounded-full border border-red-400/60 bg-red-500/10 px-4 py-2 font-medium text-red-700 transition hover:bg-red-500/20 disabled:opacity-60 dark:text-red-300"
        >
          💥 All at once
        </button>
        <button
          type="button"
          onClick={reset}
          className="ml-auto text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
