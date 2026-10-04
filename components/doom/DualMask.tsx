"use client";

import { useEffect, useRef, type RefObject } from "react";
import { strike } from "@/lib/doom";
import { COMBO_MASK_PATHS, COMBO_REGIONS, COMBO_SILHOUETTE } from "@/lib/maskCombo";

/** x of the vertical seam between the two halves of the line art (viewBox units). */
const SEAM = 797.5;
const MIRROR = `translate(${SEAM * 2},0) scale(-1,1)`;
const FLIP = "translate(0,1540) scale(0.1,-0.1)";

// Which gradient fills each cell of the line art (index = COMBO_REGIONS index).
const FILL: Record<number, string> = {};
const assign = (ids: number[], fill: string) => ids.forEach((i) => (FILL[i] = fill));
assign([5, 6, 15, 22, 28, 29], "dm-gold");
assign([0, 2, 3, 4, 7, 9, 12, 21, 27], "dm-red");
assign([14, 16], "dm-eye-iron");
assign([1], "dm-hood");
assign([8, 10, 20, 23], "dm-steel");
assign([11, 13, 19, 24, 25, 26], "dm-steel-dark");
assign([17, 18], "dm-eye-doom");

type Side = "iron" | "doom";

function Half({
  side,
  mirrored,
  eyeRef,
}: {
  side: Side;
  mirrored: boolean;
  eyeRef: RefObject<SVGEllipseElement | null>;
}) {
  const iron = side === "iron";
  return (
    <g transform={mirrored ? MIRROR : undefined}>
      <g clipPath={iron ? "url(#dm-left)" : "url(#dm-right)"}>
        <g transform={FLIP}>
          {COMBO_REGIONS.map((r, i) => (
            <path key={i} d={r.d} fill={`url(#${FILL[i] ?? "dm-steel"})`} />
          ))}
        </g>
        <rect x="0" y="0" width="1588" height="1540" fill="url(#dm-shade)" clipPath="url(#dm-sil)" />
        <g className="eye-glow">
          {iron ? (
            <>
              <ellipse ref={eyeRef} cx="605" cy="735" rx="105" ry="40" fill="#eafcff" filter="url(#dm-eye)" />
              <ellipse cx="605" cy="735" rx="80" ry="22" fill="#ffffff" filter="url(#dm-eye)" opacity="0.9" />
            </>
          ) : (
            <ellipse ref={eyeRef} cx="968" cy="735" rx="80" ry="40" fill="var(--eye)" filter="url(#dm-eye)" />
          )}
        </g>
        <g transform={FLIP} fill="url(#dm-ink)" filter="url(#dm-glow)">
          {COMBO_MASK_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>
    </g>
  );
}

/**
 * Hero mask for the dual theme: a full Iron Man face (light) and a full Doom
 * face (dark), each built by mirroring one half of the line art. The faces
 * flip when the theme changes; the mask tilts toward the cursor and fires
 * repulsor beams (Iron) or lightning (Doom) from the eyes when clicked.
 */
export default function DualMask() {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const ironA = useRef<SVGEllipseElement>(null);
  const ironB = useRef<SVGEllipseElement>(null);
  const doomA = useRef<SVGEllipseElement>(null);
  const doomB = useRef<SVGEllipseElement>(null);

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
    const dark = document.documentElement.classList.contains("dark");
    const eyes = dark ? [doomA.current, doomB.current] : [ironA.current, ironB.current];
    const centre = wrap.getBoundingClientRect();
    const midX = centre.left + centre.width / 2;
    for (const eye of eyes) {
      if (!eye) continue;
      const r = eye.getBoundingClientRect();
      const fx = r.left + r.width / 2;
      const fy = r.top + r.height / 2;
      const side = fx < midX ? -1 : 1;
      strike({
        fromX: fx,
        fromY: fy,
        x: fx + side * (180 + Math.random() * 320),
        y: fy + (Math.random() - 0.3) * 360,
      });
    }
  };

  return (
    <button
      ref={wrapRef}
      type="button"
      data-mask
      data-cursor="Fire"
      onClick={ignite}
      aria-label="Mask: click to fire from its eyes"
      className="mask-ignite relative z-10 w-[min(82vw,400px)] rounded-[45%] transition-transform duration-300 ease-out focus-visible:outline-offset-8"
      style={{ animationDelay: "0.3s" }}
    >
      {/* Shared paint for both faces */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="dm-red" gradientUnits="userSpaceOnUse" x1="3500" y1="13600" x2="6500" y2="1700">
            <stop offset="0" stopColor="#ff4a3d" />
            <stop offset="0.45" stopColor="#c2161c" />
            <stop offset="1" stopColor="#5c060a" />
          </linearGradient>
          <linearGradient id="dm-gold" gradientUnits="userSpaceOnUse" x1="5000" y1="12500" x2="7000" y2="2500">
            <stop offset="0" stopColor="#fff1b0" />
            <stop offset="0.4" stopColor="#f2bf3a" />
            <stop offset="1" stopColor="#9a6410" />
          </linearGradient>
          <linearGradient id="dm-steel" gradientUnits="userSpaceOnUse" x1="12500" y1="13000" x2="8500" y2="2000">
            <stop offset="0" stopColor="#f2f5f6" />
            <stop offset="0.45" stopColor="#a3aeb5" />
            <stop offset="1" stopColor="#475056" />
          </linearGradient>
          <linearGradient id="dm-steel-dark" gradientUnits="userSpaceOnUse" x1="0" y1="11000" x2="0" y2="3000">
            <stop offset="0" stopColor="#6c767d" />
            <stop offset="1" stopColor="#2b3135" />
          </linearGradient>
          <linearGradient id="dm-hood" gradientUnits="userSpaceOnUse" x1="0" y1="13600" x2="0" y2="1700">
            <stop offset="0" stopColor="#2a9a4c" />
            <stop offset="0.6" stopColor="#156b33" />
            <stop offset="1" stopColor="#0a3519" />
          </linearGradient>
          <linearGradient id="dm-eye-iron" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#bff4ff" />
          </linearGradient>
          <linearGradient id="dm-eye-doom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b8ffd6" />
            <stop offset="1" stopColor="#3ddc84" />
          </linearGradient>
          <linearGradient id="dm-ink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1d20" />
            <stop offset="1" stopColor="#050607" />
          </linearGradient>
          <radialGradient id="dm-shade" cx="0.5" cy="0.35" r="0.7">
            <stop offset="0.5" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.4" />
          </radialGradient>
          <clipPath id="dm-left">
            <rect x="0" y="0" width={SEAM} height="1540" />
          </clipPath>
          <clipPath id="dm-right">
            <rect x={SEAM} y="0" width={1588 - SEAM} height="1540" />
          </clipPath>
          <clipPath id="dm-sil">
            <path transform={FLIP} d={COMBO_SILHOUETTE} />
          </clipPath>
          <filter id="dm-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" result="b" />
            <feFlood floodColor="var(--bolt)" floodOpacity="0.4" />
            <feComposite in2="b" operator="in" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dm-eye" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>
      </svg>

      <div className="relative" style={{ perspective: "1000px" }}>
        <div className="mask-face mask-stark">
          <svg viewBox="0 0 1588 1540" className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" aria-hidden="true">
            <Half side="iron" mirrored={false} eyeRef={ironA} />
            <Half side="iron" mirrored eyeRef={ironB} />
          </svg>
        </div>
        <div className="mask-face mask-doom absolute inset-0">
          <svg viewBox="0 0 1588 1540" className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" aria-hidden="true">
            <Half side="doom" mirrored={false} eyeRef={doomA} />
            <Half side="doom" mirrored eyeRef={doomB} />
          </svg>
        </div>
      </div>
    </button>
  );
}
