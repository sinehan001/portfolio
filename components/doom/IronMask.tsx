"use client";

import { useEffect, useRef } from "react";
import { strike } from "@/lib/doom";

const FACE =
  "M200 52 C264 52 302 96 306 166 L310 262 L304 340 L256 388 L246 418 L154 418 L144 388 L96 340 L90 262 L94 166 C98 96 136 52 200 52 Z";

// Rivet rows: brow arcs, under-eye lines and cheek columns (mirrored).
const RIVETS: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const bx = 112 + t * 70;
    const by = 194 + Math.pow(t, 1.6) * 20;
    out.push([bx, by], [400 - bx, by]);
    const ux = 116 + t * 62;
    out.push([ux, 268 + t * 4], [400 - ux, 268 + t * 4]);
  }
  for (let i = 0; i < 8; i++) {
    const y = 288 + i * 11;
    out.push([116 + i * 1.2, y], [284 - i * 1.2, y]);
  }
  return out.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
})();

/**
 * Original iron-mask illustration (pure SVG): domed crown, heavy riveted brows,
 * nose plate, cheek panels and a stepped chin. The eyes track the cursor,
 * the mask tilts toward it, and clicking it fires lightning from the eyes.
 */
export default function IronMask() {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const leftEye = useRef<SVGPathElement>(null);
  const rightEye = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const eyes = eyesRef.current;
    if (!wrap || !eyes) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.5;
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 260);
      eyes.style.transform = `translate(${(dx / dist) * 5 * k}px, ${(dy / dist) * 3 * k}px)`;
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
    // Restart the flare animation.
    void wrap.getBoundingClientRect();
    wrap.classList.add("eye-flare");
    for (const eye of [leftEye.current, rightEye.current]) {
      if (!eye) continue;
      const r = eye.getBoundingClientRect();
      const fx = r.left + r.width / 2;
      const fy = r.top + r.height / 2;
      const side = eye === leftEye.current ? -1 : 1;
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
      data-cursor="Ignite"
      onClick={ignite}
      aria-label="Iron mask: click to ignite its eyes"
      className="mask-ignite relative z-10 w-[min(78vw,340px)] rounded-[45%] transition-transform duration-300 ease-out focus-visible:outline-offset-8"
      style={{ animationDelay: "0.3s" }}
    >
      <svg
        viewBox="0 0 400 460"
        className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="m-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f4f7f8" />
            <stop offset="0.3" stopColor="#b9c2c8" />
            <stop offset="0.6" stopColor="#737d84" />
            <stop offset="1" stopColor="#2c3338" />
          </linearGradient>
          <linearGradient id="m-plate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e1e7ea" />
            <stop offset="1" stopColor="#7d878e" />
          </linearGradient>
          <linearGradient id="m-plate-dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#959fa6" />
            <stop offset="1" stopColor="#3f474c" />
          </linearGradient>
          <linearGradient id="m-nose" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7f8990" />
            <stop offset="0.45" stopColor="#eef2f4" />
            <stop offset="1" stopColor="#535d64" />
          </linearGradient>
          <linearGradient id="m-mouth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#010202" />
            <stop offset="1" stopColor="#1a2024" />
          </linearGradient>
          <radialGradient id="m-shade" cx="0.5" cy="0.36" r="0.66">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="m-hood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--hood-a)" }} />
            <stop offset="1" style={{ stopColor: "var(--hood-b)" }} />
          </linearGradient>
          <linearGradient id="m-scan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
            <stop offset="0.5" style={{ stopColor: "var(--accent)", stopOpacity: 0.35 }} />
            <stop offset="1" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
          </linearGradient>
          <filter id="m-glow" x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="m-face">
            <path d={FACE} />
          </clipPath>
        </defs>

        {/* Hood */}
        <path
          d="M200 8 C304 8 374 92 382 204 C390 306 362 404 334 460 L66 460 C38 404 10 306 18 204 C26 92 96 8 200 8 Z"
          fill="url(#m-hood)"
        />
        <path d="M120 40 C80 120 70 260 96 440" stroke="#000" strokeOpacity="0.25" strokeWidth="6" fill="none" />
        <path d="M280 40 C320 120 330 260 304 440" stroke="#000" strokeOpacity="0.25" strokeWidth="6" fill="none" />
        <path d="M200 8 C304 8 374 92 382 204" stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="2" fill="none" />
        <path
          d="M200 34 C290 34 342 104 344 200 C346 302 306 406 200 438 C94 406 54 302 56 200 C58 104 110 34 200 34 Z"
          fill="#010302"
        />

        {/* Faceplate */}
        <path d={FACE} fill="url(#m-metal)" stroke="#20262a" strokeWidth="2" />

        <g clipPath="url(#m-face)">
          {/* Crown: centre ridge plate between two grooves */}
          <path d="M176 52 C172 110 172 160 178 214 L222 214 C228 160 228 110 224 52 Z" fill="url(#m-plate)" opacity="0.55" />
          <path d="M176 52 C172 110 172 160 178 214" stroke="#30373c" strokeWidth="2.5" fill="none" />
          <path d="M224 52 C228 110 228 160 222 214" stroke="#30373c" strokeWidth="2.5" fill="none" />
          <path d="M150 74 C176 62 224 62 250 74 C226 68 176 68 150 82 Z" fill="#fff" opacity="0.45" />
          <rect x="186" y="44" width="28" height="14" rx="3" fill="url(#m-plate-dark)" />

          {/* Cheek panels */}
          <path d="M90 262 L150 278 L168 350 L144 388 L96 340 Z" fill="url(#m-plate-dark)" />
          <path d="M310 262 L250 278 L232 350 L256 388 L304 340 Z" fill="url(#m-plate-dark)" />
          <path d="M104 278 L108 348" stroke="#2a3034" strokeWidth="2" opacity="0.7" />
          <path d="M296 278 L292 348" stroke="#2a3034" strokeWidth="2" opacity="0.7" />

          {/* Under-eye plates */}
          <path d="M98 258 L190 266 L186 282 L100 274 Z" fill="url(#m-plate)" opacity="0.85" />
          <path d="M302 258 L210 266 L214 282 L300 274 Z" fill="url(#m-plate)" opacity="0.85" />

          {/* Stepped chin */}
          {/* Stepped chin plates span edge to edge between the straight jaw lines */}
          <path d="M158.5 312 L241.5 312 L238.7 323 L161.3 323 Z" fill="url(#m-plate)" opacity="0.9" />
          <path d="M165 364 L235 364 L238.2 380 L161.8 380 Z" fill="url(#m-plate-dark)" />
          <path d="M161 384 L239 384 L242.7 402 L157.3 402 Z" fill="url(#m-plate)" opacity="0.85" />
          <path d="M156.7 405 L243.3 405 L246 418 L154 418 Z" fill="url(#m-plate-dark)" />
        </g>
        <path d={FACE} fill="url(#m-shade)" />
        <path d="M150 278 L168 350 L154 418 M250 278 L232 350 L246 418" stroke="#2a3034" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <path d="M168 350 L144 388 M232 350 L256 388" stroke="#2a3034" strokeWidth="1.5" fill="none" opacity="0.8" />

        {/* Eye openings */}
        <path d="M114 224 L186 236 L184 260 L118 255 Z" fill="#030504" />
        <path d="M286 224 L214 236 L216 260 L282 255 Z" fill="#030504" />

        {/* Glowing eyes (tracked) */}
        <g ref={eyesRef} style={{ transition: "transform 0.15s ease-out" }}>
          <g className="eye-glow" filter="url(#m-glow)">
            <path ref={leftEye} d="M126 236 L176 243 L175 253 L128 249 Z" fill="var(--accent)" />
            <path ref={rightEye} d="M274 236 L224 243 L225 253 L272 249 Z" fill="var(--accent)" />
          </g>
        </g>

        {/* Heavy brow plates, angled down to the bridge */}
        <path
          d="M96 190 C128 172 170 178 198 212 L198 238 C172 214 132 204 100 220 Z"
          fill="url(#m-plate)"
          stroke="#2a3034"
          strokeWidth="1.5"
        />
        <path
          d="M304 190 C272 172 230 178 202 212 L202 238 C228 214 268 204 300 220 Z"
          fill="url(#m-plate)"
          stroke="#2a3034"
          strokeWidth="1.5"
        />

        {/* Nose plate */}
        <path
          d="M190 218 L210 218 L226 300 L212 312 L188 312 L174 300 Z"
          fill="url(#m-nose)"
          stroke="#2a3034"
          strokeWidth="1.5"
        />
        <path d="M200 222 L200 296" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
        <path d="M180 300 L192 308 M220 300 L208 308" stroke="#2a3034" strokeWidth="2" strokeLinecap="round" />

        {/* Mouth: wide opening between the cheek panels, frowning at the corners */}
        <path d="M161.3 323 L238.7 323 L233.2 345 C218 339 182 339 166.8 345 Z" fill="url(#m-mouth)" />
        <path d="M161.3 323 L238.7 323" stroke="#1b2024" strokeWidth="2" />
        <rect x="191" y="323" width="18" height="7" rx="1.5" fill="url(#m-plate-dark)" stroke="#1b2024" strokeWidth="0.8" />
        {/* Lower lip plate follows the frown down into the chin steps */}
        <path
          d="M166.8 345 C182 339 218 339 233.2 345 L234.1 360 C220 355 180 355 165.9 360 Z"
          fill="url(#m-plate)"
          stroke="#2a3034"
          strokeWidth="1.2"
        />
        <path d="M172 346 C186 342 214 342 228 346" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.5" fill="none" />

        {/* Rivets */}
        {RIVETS.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.3" fill="#dfe5e8" stroke="#3a4146" strokeWidth="0.8" />
        ))}

        {/* Scanning light */}
        <g clipPath="url(#m-face)">
          <rect className="scanline" x="80" y="0" width="240" height="70" fill="url(#m-scan)" />
        </g>
      </svg>
    </button>
  );
}
