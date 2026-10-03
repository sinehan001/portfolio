"use client";

import { useEffect, useState } from "react";

type Worker = { busy: boolean; progress: number; speed: number };
type State = { queue: number; processed: number; workers: Worker[] };

const VISIBLE = 30;
const idle = (): Worker => ({ busy: false, progress: 0, speed: 10 });

export default function QueueSim() {
  const [s, setS] = useState<State>({ queue: 0, processed: 0, workers: [idle()] });
  const active = s.queue > 0 || s.workers.some((w) => w.busy);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setS((prev) => {
        let queue = prev.queue;
        let processed = prev.processed;
        const workers = prev.workers.map((w) => ({ ...w }));
        for (const w of workers) {
          if (w.busy) {
            w.progress += w.speed;
            if (w.progress >= 100) {
              processed++;
              w.busy = false;
              w.progress = 0;
            }
          }
          if (!w.busy && queue > 0) {
            queue--;
            w.busy = true;
            w.progress = 0;
            w.speed = 8 + Math.random() * 7;
          }
        }
        return { queue, processed, workers };
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [active]);

  const publish = () => setS((p) => ({ ...p, queue: p.queue + 25 }));
  const changeWorkers = (delta: 1 | -1) =>
    setS((p) => {
      const n = p.workers.length + delta;
      if (n < 1 || n > 6) return p;
      if (delta > 0) return { ...p, workers: [...p.workers, idle()] };
      const removed = p.workers[p.workers.length - 1];
      // A job in flight on a removed worker is requeued (RabbitMQ redelivers unacked messages).
      return { ...p, queue: p.queue + (removed.busy ? 1 : 0), workers: p.workers.slice(0, -1) };
    });

  const eta = s.queue === 0 ? 0 : Math.ceil((s.queue * 0.9) / s.workers.length);

  return (
    <div className="space-y-4 text-sm">
      <div className="grid items-center gap-3 md:grid-cols-[auto_1fr_auto]">
        <button
          type="button"
          onClick={publish}
          className="bg-gradient-accent rounded-xl px-4 py-3 text-left font-medium text-on-accent shadow-lg shadow-accent/20 transition hover:-translate-y-0.5"
        >
          <span className="block text-[10px] uppercase tracking-wider opacity-80">Producer</span>
          Publish 25 jobs
        </button>

        <div className="rounded-xl border border-line bg-bg p-3">
          <div className="mb-2 flex justify-between text-[10px] uppercase tracking-wider text-muted">
            <span>RabbitMQ queue</span>
            <span className="font-mono">{s.queue} waiting</span>
          </div>
          <div className="flex h-8 flex-row-reverse flex-wrap content-start items-center gap-1 overflow-hidden">
            {Array.from({ length: Math.min(s.queue, VISIBLE) }, (_, i) => (
              <span key={i} className="fly h-3 w-3 rounded-[3px] bg-accent2 shadow-[0_0_8px_var(--accent2)]" />
            ))}
            {s.queue > VISIBLE && (
              <span className="mr-1 font-mono text-[10px] text-muted">+{s.queue - VISIBLE}</span>
            )}
            {s.queue === 0 && <span className="w-full text-xs text-muted">empty</span>}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-bg px-4 py-3 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted">Processed</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-emerald-400">
            {s.processed}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {s.workers.map((w, i) => (
          <div
            key={i}
            className={`rounded-xl border p-3 transition ${w.busy ? "border-accent/60 bg-accent-soft" : "border-line bg-bg"}`}
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span>worker-{i + 1}</span>
              <span className={w.busy ? "text-accent" : "text-muted"}>{w.busy ? "busy" : "idle"}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
              <div className="bg-gradient-accent h-full rounded-full" style={{ width: `${w.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-line">
          <button
            type="button"
            aria-label="Remove a worker"
            onClick={() => changeWorkers(-1)}
            className="h-9 w-9 rounded-full text-lg hover:text-accent disabled:opacity-40"
            disabled={s.workers.length <= 1}
          >
            −
          </button>
          <span className="px-2 font-mono text-xs" aria-live="polite">
            {s.workers.length} worker{s.workers.length > 1 ? "s" : ""}
          </span>
          <button
            type="button"
            aria-label="Add a worker"
            onClick={() => changeWorkers(1)}
            className="h-9 w-9 rounded-full text-lg hover:text-accent disabled:opacity-40"
            disabled={s.workers.length >= 6}
          >
            +
          </button>
        </div>
        <span className="text-xs text-muted">
          {s.queue > 0 ? `≈ ${eta}s to drain. Add workers to scale out.` : "Publish jobs, then scale workers."}
        </span>
        <button
          type="button"
          onClick={() => setS({ queue: 0, processed: 0, workers: [idle()] })}
          className="ml-auto text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
