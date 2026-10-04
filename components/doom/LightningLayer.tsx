"use client";

import { useEffect, useRef } from "react";
import { BOLT_EVENT, readVar, type BoltDetail } from "@/lib/doom";

type Pt = [number, number];
/** Doom theme draws forked lightning; Iron theme draws a straight repulsor beam with an impact ring. */
type Bolt = { main: Pt[]; branches: Pt[][]; t: number; beam: boolean; end: Pt; color: [number, number, number] };

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

function makeBeam(from: Pt, to: Pt, color: [number, number, number]): Bolt {
  const dist = Math.hypot(to[0] - from[0], to[1] - from[1]);
  return { main: displace(from, to, 3, dist / 70), branches: [], t: performance.now(), beam: true, end: to, color };
}

function makeBolt(from: Pt, to: Pt, color: [number, number, number]): Bolt {
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
  return { main, branches, t: performance.now(), beam: false, end: to, color };
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
      for (const bolt of bolts) {
        const [r, g, b] = bolt.color;
        const age = Math.max(0, now - bolt.t) / LIFE;
        if (bolt.beam) {
          const a = 1 - age;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.shadowColor = `rgb(${r},${g},${b})`;
          ctx.shadowBlur = 28;
          ctx.strokeStyle = `rgba(${r},${g},${b},${0.3 * a})`;
          ctx.lineWidth = 16 * (1 - age * 0.5);
          path(bolt.main);
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(${r},${g},${b},${0.75 * a})`;
          ctx.lineWidth = 6 * (1 - age * 0.5);
          path(bolt.main);
          ctx.strokeStyle = `rgba(255,255,255,${a})`;
          ctx.lineWidth = 2.5;
          path(bolt.main);
          // Impact ring + flare where the beam lands
          ctx.strokeStyle = `rgba(${r},${g},${b},${0.8 * a})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(bolt.end[0], bolt.end[1], 6 + age * 46, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(255,255,255,${0.9 * a})`;
          ctx.beginPath();
          ctx.arc(bolt.end[0], bolt.end[1], 7 * a, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
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
      const color = readVar("--bolt", "#3ddc84");
      const dark = document.documentElement.classList.contains("dark");
      if (dark) {
        const from: Pt = [d.fromX ?? d.x + (Math.random() - 0.5) * 240, d.fromY ?? -20];
        bolts.push(makeBolt(from, [d.x, d.y], color));
      } else {
        // Repulsor beams fire from the mask when no origin is given.
        let from: Pt = [window.innerWidth / 2, window.innerHeight + 20];
        const mask = document.querySelector("[data-mask]")?.getBoundingClientRect();
        if (d.fromX !== undefined && d.fromY !== undefined) from = [d.fromX, d.fromY];
        else if (mask && mask.bottom > 0 && mask.top < window.innerHeight)
          from = [mask.left + mask.width / 2, mask.top + mask.height * 0.47];
        bolts.push(makeBeam(from, [d.x, d.y], color));
      }
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
