"use client";

import { useEffect, useRef } from "react";
import { BOLT_EVENT, readAccent, type BoltDetail } from "@/lib/doom";

type Pt = [number, number];
type Bolt = { main: Pt[]; branches: Pt[][]; t: number };

const LIFE = 450;

function displace(a: Pt, b: Pt, iterations: number, spread: number): Pt[] {
  let pts: Pt[] = [a, b];
  let offset = spread;
  for (let it = 0; it < iterations; it++) {
    const next: Pt[] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const nx = -(y2 - y1) / len;
      const ny = (x2 - x1) / len;
      const o = (Math.random() * 2 - 1) * offset;
      next.push([mx + nx * o, my + ny * o], pts[i + 1]);
    }
    pts = next;
    offset /= 2;
  }
  return pts;
}

function makeBolt(from: Pt, to: Pt): Bolt {
  const dist = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const main = displace(from, to, 7, dist / 5);
  const branches: Pt[][] = [];
  const count = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const start = main[Math.floor(main.length * (0.25 + Math.random() * 0.5))];
    const angle = Math.atan2(to[1] - from[1], to[0] - from[0]) + (Math.random() - 0.5) * 1.6;
    const len = dist * (0.15 + Math.random() * 0.25);
    branches.push(
      displace(start, [start[0] + Math.cos(angle) * len, start[1] + Math.sin(angle) * len], 5, len / 4),
    );
  }
  return { main, branches, t: performance.now() };
}

/** Full-viewport overlay that renders lightning whenever something calls strike(). */
export default function LightningLayer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let bolts: Bolt[] = [];
    let raf = 0;
    let color = readAccent();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const path = (pts: Pt[]) => {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      bolts = bolts.filter((b) => now - b.t < LIFE);
      const [r, g, b] = color;
      for (const bolt of bolts) {
        const age = Math.max(0, now - bolt.t) / LIFE;
        const flicker = Math.random() > 0.25 ? 1 : 0.35;
        const a = (1 - age) * flicker;
        if (age < 0.3) {
          ctx.fillStyle = `rgba(${r},${g},${b},${0.07 * (1 - age / 0.3)})`;
          ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        }
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = `rgb(${r},${g},${b})`;
        ctx.shadowBlur = 24;
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.35 * a})`;
        ctx.lineWidth = 7;
        path(bolt.main);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(235,255,242,${a})`;
        ctx.lineWidth = 2;
        path(bolt.main);
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.7 * a})`;
        ctx.lineWidth = 1.2;
        bolt.branches.forEach(path);
      }
      raf = bolts.length ? requestAnimationFrame(draw) : 0;
      if (!raf) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const onBolt = (e: Event) => {
      const d = (e as CustomEvent<BoltDetail>).detail;
      color = readAccent();
      const from: Pt = [d.fromX ?? d.x + (Math.random() - 0.5) * 240, d.fromY ?? -20];
      bolts.push(makeBolt(from, [d.x, d.y]));
      // Paint the first frame right away so the strike feels instant.
      if (!raf) draw(performance.now());
    };

    window.addEventListener(BOLT_EVENT, onBolt);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(BOLT_EVENT, onBolt);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] h-screen w-screen"
    />
  );
}
