"use client";

import { useEffect, useRef } from "react";
import { strike } from "@/lib/doom";
import { COMBO_MASK_PATHS, COMBO_REGIONS, COMBO_SILHOUETTE } from "@/lib/maskCombo";

// Which gradient fills each cell of the line art (index = COMBO_REGIONS index).
const IRON_GOLD = [5, 6, 15, 22, 28, 29];
const IRON_RED = [0, 2, 3, 4, 7, 9, 12, 21, 27];
const IRON_EYE = [14, 16];
const DOOM_HOOD = [1];
const DOOM_STEEL = [8, 10, 20, 23];
const DOOM_DARK = [11, 13, 19, 24, 25, 26];
const DOOM_EYE = [17, 18];
const REGION_FILL: Record<number, string> = Object.fromEntries([
  ...IRON_GOLD.map((i) => [i, "cm-gold"]),
  ...IRON_RED.map((i) => [i, "cm-red"]),
  ...IRON_EYE.map((i) => [i, "cm-eye-iron"]),
  ...DOOM_HOOD.map((i) => [i, "cm-hood"]),
  ...DOOM_STEEL.map((i) => [i, "cm-steel"]),
  ...DOOM_DARK.map((i) => [i, "cm-steel-dark"]),
  ...DOOM_EYE.map((i) => [i, "cm-eye-doom"]),
]);

/**
 * Alternate hero mask built from the supplied line-art SVG, rendered in brushed
 * Iron Man red & gold (left) and Doom steel & green (right). Tilts toward the cursor; click to fire lightning.
 */
export default function ComboMask() {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const leftEye = useRef<SVGEllipseElement>(null);
  const rightEye = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      const r = wrap.getBoundingClientRect();
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);
      const ry = Math.max(-1, Math.min(1, dx / window.innerWidth)) * 14;
      const rx = Math.max(-1, Math.min(1, dy / window.innerHeight)) * -10;
      wrap.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const ignite = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.classList.remove("eye-flare");
    void wrap.getBoundingClientRect();
    wrap.classList.add("eye-flare");
    for (const eye of [leftEye.current, rightEye.current]) {
      if (!eye) continue;
      const r = eye.getBoundingClientRect();
      const fx = r.left + r.width / 2;
      const fy = r.top + r.height / 2;
      const side = eye === leftEye.current ? -1 : 1;
      strike({ fromX: fx, fromY: fy, x: fx + side * (180 + Math.random() * 320), y: fy + (Math.random() - 0.3) * 360 });
    }
  };

  return (
    <button
      ref={wrapRef}
      type="button"
      data-mask
      data-cursor="Ignite"
      onClick={ignite}
      aria-label="Mask: click to ignite"
      className="mask-ignite relative z-10 w-[min(82vw,380px)] rounded-[45%] transition-transform duration-300 ease-out focus-visible:outline-offset-8"
      style={{ animationDelay: "0.3s" }}
    >
      <svg viewBox="0 0 1588 1540" className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" aria-hidden="true">
        <defs>
          {/* Iron Man: candy red shell, gold faceplate */}
          <linearGradient id="cm-red" gradientUnits="userSpaceOnUse" x1="3500" y1="13600" x2="6500" y2="1700">
            <stop offset="0" stopColor="#ff4a3d" />
            <stop offset="0.45" stopColor="#c2161c" />
            <stop offset="1" stopColor="#5c060a" />
          </linearGradient>
          <linearGradient id="cm-gold" gradientUnits="userSpaceOnUse" x1="5000" y1="12500" x2="7000" y2="2500">
            <stop offset="0" stopColor="#fff1b0" />
            <stop offset="0.4" stopColor="#f2bf3a" />
            <stop offset="1" stopColor="#9a6410" />
          </linearGradient>
          {/* Doom: gunmetal steel, green hood */}
          <linearGradient id="cm-steel" gradientUnits="userSpaceOnUse" x1="12500" y1="13000" x2="8500" y2="2000">
            <stop offset="0" stopColor="#f2f5f6" />
            <stop offset="0.45" stopColor="#a3aeb5" />
            <stop offset="1" stopColor="#475056" />
          </linearGradient>
          <linearGradient id="cm-hood" gradientUnits="userSpaceOnUse" x1="0" y1="13600" x2="0" y2="1700">
            <stop offset="0" stopColor="#2a9a4c" />
            <stop offset="0.6" stopColor="#156b33" />
            <stop offset="1" stopColor="#0a3519" />
          </linearGradient>
          <linearGradient id="cm-steel-dark" gradientUnits="userSpaceOnUse" x1="0" y1="11000" x2="0" y2="3000">
            <stop offset="0" stopColor="#6c767d" />
            <stop offset="1" stopColor="#2b3135" />
          </linearGradient>
          <linearGradient id="cm-eye-iron" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#bff4ff" />
          </linearGradient>
          <linearGradient id="cm-eye-doom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b8ffd6" />
            <stop offset="1" style={{ stopColor: "var(--accent)" }} />
          </linearGradient>
          <radialGradient id="cm-shade" cx="0.45" cy="0.35" r="0.7">
            <stop offset="0.5" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.45" />
          </radialGradient>
          <linearGradient id="cm-ink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1d20" />
            <stop offset="1" stopColor="#050607" />
          </linearGradient>
          <clipPath id="cm-sil">
            <path transform="translate(0,1540) scale(0.1,-0.1)" d={COMBO_SILHOUETTE} />
          </clipPath>
          <filter id="cm-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" result="b" />
            <feFlood floodColor="var(--accent)" floodOpacity="0.35" />
            <feComposite in2="b" operator="in" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cm-eye" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        {/* Colour fills: each white cell of the line art is painted on its own, so colour stops exactly at the ink */}
        <g transform="translate(0,1540) scale(0.1,-0.1)">
          {COMBO_REGIONS.map((r, i) => (
            <path key={i} d={r.d} fill={`url(#${REGION_FILL[i] ?? "cm-steel"})`} />
          ))}
        </g>
        <rect x="0" y="0" width="1588" height="1540" fill="url(#cm-shade)" clipPath="url(#cm-sil)" />

        {/* Eyes: Iron Man white-hot, Doom emerald */}
        <g className="eye-glow">
          <ellipse ref={leftEye} cx="605" cy="735" rx="105" ry="40" fill="#eafcff" filter="url(#cm-eye)" />
          <ellipse cx="605" cy="735" rx="80" ry="22" fill="#ffffff" filter="url(#cm-eye)" opacity="0.9" />
          <ellipse ref={rightEye} cx="968" cy="735" rx="80" ry="40" fill="var(--accent)" filter="url(#cm-eye)" />
        </g>

        {/* Inked line art on top */}
        <g transform="translate(0,1540) scale(0.1,-0.1)" fill="url(#cm-ink)" filter="url(#cm-glow)">
          {COMBO_MASK_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>
    </button>
  );
}
