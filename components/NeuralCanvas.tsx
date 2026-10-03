"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; bx: number; by: number };
type Pulse = { x: number; y: number; t: number };

const LINK = 130;
const MOUSE = 190;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function readColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    a: hexToRgb(s.getPropertyValue("--accent").trim() || "#67e8f9"),
    b: hexToRgb(s.getPropertyValue("--accent2").trim() || "#a78bfa"),
  };
}

/**
 * Interactive "neural network" background: nodes drift, link up when close,
 * lean toward the cursor, and get pushed away by a shockwave on click.
 */
export default function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    const pulses: Pulse[] = [];
    const mouse = { x: -9999, y: -9999 };
    let colors = readColors();
    let raf = 0;
    let visible = true;

    const rgba = (c: [number, number, number], a: number) =>
      `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(120, Math.max(35, Math.floor((w * h) / 13000)));
      nodes = Array.from({ length: count }, () => {
        const bx = (Math.random() - 0.5) * 0.35;
        const by = (Math.random() - 0.5) * 0.35;
        return { x: Math.random() * w, y: Math.random() * h, vx: bx, vy: by, bx, by };
      });
    }

    function frame(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = pulses.length - 1; i >= 0; i--) {
        if (now - pulses[i].t > 1100) pulses.splice(i, 1);
      }

      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE && d > 1) {
          n.vx += (dx / d) * 0.035;
          n.vy += (dy / d) * 0.035;
        }
        for (const p of pulses) {
          const radius = Math.max(0, now - p.t) * 0.55;
          const px = n.x - p.x;
          const py = n.y - p.y;
          const pd = Math.hypot(px, py);
          if (pd > 1 && Math.abs(pd - radius) < 40) {
            n.vx += (px / pd) * 1.4;
            n.vy += (py / pd) * 1.4;
          }
        }
        n.vx += (n.bx - n.vx) * 0.03;
        n.vy += (n.by - n.vy) * 0.03;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * 0.28;
            ctx.strokeStyle = rgba(colors.a, alpha);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        const near = d < MOUSE;
        if (near) {
          ctx.strokeStyle = rgba(colors.b, (1 - d / MOUSE) * 0.6);
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
        ctx.fillStyle = near ? rgba(colors.b, 0.95) : rgba(colors.a, 0.6);
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? 2.6 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of pulses) {
        const age = Math.max(0, now - p.t);
        if (age === 0) continue;
        ctx.strokeStyle = rgba(colors.b, Math.max(0, 0.5 - age / 2200));
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, age * 0.55, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function loop(now: number) {
      frame(now);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    }
    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x >= 0 && y >= 0 && x <= r.width && y <= r.height) {
        pulses.push({ x, y, t: performance.now() });
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    const mo = new MutationObserver(() => {
      colors = readColors();
      if (reduce) frame(0);
    });
    const onVisibility = () => !document.hidden && start();
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reduce) frame(0);
      }, 150);
    };

    // Defer setup so it never competes with first paint.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const idleId = idle(() => {
      resize();
      frame(0);
      io.observe(canvas);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("resize", onResize);
      start();
    });

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}
