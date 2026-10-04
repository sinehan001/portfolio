"use client";

import { useEffect, useRef } from "react";
import { BOLT_EVENT, readVar, strike, type BoltDetail } from "@/lib/doom";

type Ember = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  gold: boolean;
  seed: number;
};

const IGNORE = "a, button, input, textarea, select, [data-mask], [role='dialog']";

/**
 * Emerald embers rising through the hero. The cursor pushes them aside;
 * clicking empty space calls lightning down onto that point.
 */
export default function EmberField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let embers: Ember[] = [];
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };
    let green = readVar("--particle-a", "#3ddc84");
    let gold = readVar("--particle-b", "#d4af37");
    let dark = document.documentElement.classList.contains("dark");

    const spawn = (x?: number, y?: number, burst = false): Ember => {
      const max = 260 + Math.random() * 420;
      return {
        x: x ?? Math.random() * w,
        y: y ?? h + Math.random() * 40,
        vx: burst ? (Math.random() - 0.5) * 5 : (Math.random() - 0.5) * 0.3,
        vy: burst ? -Math.random() * 4 - 1 : -0.25 - Math.random() * 0.7,
        life: burst ? max * 0.6 : y === undefined ? max : Math.random() * max,
        max,
        size: 0.6 + Math.random() * 1.8,
        gold: Math.random() < 0.14,
        seed: Math.random() * 1000,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(150, Math.max(40, Math.floor((w * h) / 9000)));
      embers = Array.from({ length: count }, () => spawn(undefined, Math.random() * h));
    };

    const frame = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        const dx = e.x - mouse.x;
        const dy = e.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 130 && d > 0.5) {
          e.vx += (dx / d) * 0.12;
          e.vy += (dy / d) * 0.06;
        }
        e.vx += Math.sin(now * 0.001 + e.seed) * 0.006;
        e.vx *= 0.985;
        e.vy = e.vy * 0.99 - 0.004;
        e.x += e.vx;
        e.y += e.vy;
        e.life -= 1;
        if (e.life <= 0 || e.y < -20 || e.x < -40 || e.x > w + 40) {
          if (i >= 150) {
            embers.splice(i, 1);
            i--;
            continue;
          }
          embers[i] = spawn();
          continue;
        }
        const t = e.life / e.max;
        const alpha = Math.min(1, t * 2.2) * (dark ? 0.85 : 0.55);
        const [r, g, b] = e.gold ? gold : green;
        if (e.size > 1.5) {
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.18})`;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      frame(now);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(loop);
    };

    const onMove = (ev: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ev.clientX - r.left;
      mouse.y = ev.clientY - r.top;
    };
    const onDown = (ev: PointerEvent) => {
      if ((ev.target as Element | null)?.closest?.(IGNORE)) return;
      const r = canvas.getBoundingClientRect();
      if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) return;
      strike({ x: ev.clientX, y: ev.clientY });
    };
    const onBolt = (ev: Event) => {
      const d = (ev as CustomEvent<BoltDetail>).detail;
      const r = canvas.getBoundingClientRect();
      const x = d.x - r.left;
      const y = d.y - r.top;
      if (x < 0 || y < 0 || x > w || y > h) return;
      for (let i = 0; i < 28; i++) embers.push(spawn(x, y, true));
      start();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    const mo = new MutationObserver(() => {
      green = readVar("--particle-a", "#3ddc84");
      gold = readVar("--particle-b", "#d4af37");
      dark = document.documentElement.classList.contains("dark");
      if (reduce) frame(0);
    });
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reduce) frame(0);
      }, 150);
    };
    const onVisibility = () => !document.hidden && start();

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const idleId = idle(() => {
      resize();
      frame(0);
      io.observe(canvas);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener(BOLT_EVENT, onBolt);
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVisibility);
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
      window.removeEventListener(BOLT_EVENT, onBolt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
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
