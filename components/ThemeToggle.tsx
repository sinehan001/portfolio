"use client";

import { useSyncExternalStore } from "react";
import { toggleTheme } from "@/lib/theme";

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => obs.disconnect();
}

/**
 * Reactor coin: an arc reactor (Iron, light) that flips in 3D to an emerald
 * gem (Doom, dark). Exposed to assistive tech as a "Doom mode" switch.
 */
export default function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Doom mode (dark theme)"
      title={dark ? "Switch to Iron mode" : "Switch to Doom mode"}
      onClick={(e) => toggleTheme(e.clientX, e.clientY)}
      className="group relative h-10 w-10 shrink-0 rounded-full"
      style={{ perspective: "320px" }}
    >
      <span
        className="keep-transition relative block h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.3,1.4,0.5,1)] group-hover:scale-110"
        style={{ transformStyle: "preserve-3d", transform: dark ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Iron face: arc reactor */}
        <svg
          viewBox="0 0 40 40"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full rounded-full"
          style={{ backfaceVisibility: "hidden", filter: "drop-shadow(0 0 6px rgba(56,189,248,0.55))" }}
        >
          <defs>
            <radialGradient id="coin-core" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.45" stopColor="#bdefff" />
              <stop offset="1" stopColor="#38bdf8" />
            </radialGradient>
            <linearGradient id="coin-rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d9e0e4" />
              <stop offset="1" stopColor="#6b757c" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="19.2" fill="#12171c" stroke="url(#coin-rim)" strokeWidth="1.6" />
          <circle cx="20" cy="20" r="15" fill="none" stroke="#38bdf8" strokeWidth="2" />
          <g className="spin-slow" style={{ animationDuration: "14s" }}>
            <circle cx="20" cy="20" r="11.5" fill="none" stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="3.2 2.2" />
          </g>
          <polygon points="20,27.8 13.2,16 26.8,16" fill="none" stroke="#e0f7ff" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="20" cy="19.9" r="4" fill="url(#coin-core)" />
        </svg>

        {/* Doom face: emerald gem in a gold bezel */}
        <svg
          viewBox="0 0 40 40"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full rounded-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            filter: "drop-shadow(0 0 6px rgba(61,220,132,0.55))",
          }}
        >
          <defs>
            <linearGradient id="coin-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6dd8a" />
              <stop offset="1" stopColor="#8f6410" />
            </linearGradient>
            <linearGradient id="coin-gem" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b8ffd6" />
              <stop offset="0.5" stopColor="#3ddc84" />
              <stop offset="1" stopColor="#0f6e3a" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="19.2" fill="#0a100c" stroke="url(#coin-gold)" strokeWidth="1.6" />
          <circle cx="20" cy="20" r="15" fill="none" stroke="url(#coin-gold)" strokeWidth="1" strokeOpacity="0.7" />
          <polygon points="20,8.5 28.5,20 20,31.5 11.5,20" fill="url(#coin-gem)" stroke="url(#coin-gold)" strokeWidth="1.2" />
          <path d="M20 8.5 L20 31.5 M11.5 20 L28.5 20" stroke="#0a100c" strokeOpacity="0.35" strokeWidth="0.8" />
          <polygon points="20,11 23,15.5 20,17 17,15.5" fill="#ffffff" fillOpacity="0.55" />
        </svg>
      </span>
    </button>
  );
}
