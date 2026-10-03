"use client";

import { useEffect, useRef } from "react";
import { strike } from "@/lib/doom";
import { COMBO_MASK_PATHS, COMBO_SILHOUETTE } from "@/lib/maskCombo";

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
          <linearGradient id="cm-red" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor="#ff4a3d" />
            <stop offset="0.45" stopColor="#c2161c" />
            <stop offset="1" stopColor="#5c060a" />
          </linearGradient>
          <linearGradient id="cm-gold" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor="#fff1b0" />
            <stop offset="0.4" stopColor="#f2bf3a" />
            <stop offset="1" stopColor="#9a6410" />
          </linearGradient>
          {/* Doom: gunmetal steel, green hood */}
          <linearGradient id="cm-steel" x1="1" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor="#f2f5f6" />
            <stop offset="0.45" stopColor="#a3aeb5" />
            <stop offset="1" stopColor="#475056" />
          </linearGradient>
          <linearGradient id="cm-hood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a9a4c" />
            <stop offset="0.6" stopColor="#156b33" />
            <stop offset="1" stopColor="#0a3519" />
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

        {/* Colour fills, clipped to the mask outline */}
        <g clipPath="url(#cm-sil)">
          <rect x="0" y="0" width="797" height="1540" fill="url(#cm-red)" />
          <path
            d="M797 300 L643 312 L632 560 L453 625 L426 770 L433 961 L529 1152 L643 1305 L797 1350 Z"
            fill="url(#cm-gold)"
          />
          <rect x="797" y="0" width="791" height="1540" fill="url(#cm-steel)" />
          <path
            d="M815 170 L1083 250 L1254 500 L1320 770 L1260 1080 L1121 1270 L968 1370 L987 1305 L1083 1152 L1121 885 L1113 618 L1044 407 L892 274 Z"
            fill="url(#cm-hood)"
          />
          <rect x="0" y="0" width="1588" height="1540" fill="url(#cm-shade)" />
        </g>

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
