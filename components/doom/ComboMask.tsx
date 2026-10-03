"use client";

import { useEffect, useRef } from "react";
import { strike } from "@/lib/doom";
import { COMBO_MASK_PATHS } from "@/lib/maskCombo";

/**
 * Alternate hero mask built from the supplied line-art SVG, rendered in brushed
 * steel with an emerald glow. Tilts toward the cursor; click to fire lightning.
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
      <svg viewBox="0 0 1588 1540" className="h-auto w-full" aria-hidden="true">
        <defs>
          <linearGradient id="cm-steel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6f8f9" />
            <stop offset="0.35" stopColor="#c3ccd2" />
            <stop offset="0.7" stopColor="#7f8a91" />
            <stop offset="1" stopColor="#4a5359" />
          </linearGradient>
          <filter id="cm-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feFlood floodColor="var(--accent)" floodOpacity="0.55" />
            <feComposite in2="b" operator="in" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cm-eye" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        {/* Eye glow sits behind the line art so it shines through the eye openings */}
        <g className="eye-glow">
          <ellipse ref={leftEye} cx="605" cy="735" rx="105" ry="42" fill="var(--accent)" filter="url(#cm-eye)" opacity="0.95" />
          <ellipse ref={rightEye} cx="968" cy="735" rx="80" ry="42" fill="var(--accent)" filter="url(#cm-eye)" opacity="0.95" />
        </g>

        <g
          transform="translate(0,1540) scale(0.1,-0.1)"
          fill="url(#cm-steel)"
          filter="url(#cm-glow)"
        >
          {COMBO_MASK_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>
    </button>
  );
}
