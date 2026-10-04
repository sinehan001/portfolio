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

const FACE =
  "M16 3.5c6 0 9.6 3.8 9.8 9.7l-.5 7.8c-.5 5.2-3.9 9-9.3 10-5.4-1-8.8-4.8-9.3-10l-.5-7.8C6.4 7.3 10 3.5 16 3.5z";

/** Split Iron (red & gold) / Doom (steel & green) mask: switches light ⇄ dark. */
export default function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e.clientX, e.clientY)}
      aria-label={dark ? "Switch to Iron mode (light theme)" : "Switch to Doom mode (dark theme)"}
      title={dark ? "Suit up: Iron mode" : "Mask on: Doom mode"}
      className="group grid h-9 w-9 place-items-center rounded-full border border-line transition hover:border-accent"
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-6 w-6 transition-transform duration-700 ease-out group-hover:scale-110"
        style={{ transform: dark ? "rotateY(180deg)" : undefined }}
      >
        <defs>
          <clipPath id="tt-left">
            <rect x="0" y="0" width="16" height="32" />
          </clipPath>
          <clipPath id="tt-right">
            <rect x="16" y="0" width="16" height="32" />
          </clipPath>
          <linearGradient id="tt-red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff4a3d" />
            <stop offset="1" stopColor="#8f0d13" />
          </linearGradient>
          <linearGradient id="tt-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe48a" />
            <stop offset="1" stopColor="#c48a12" />
          </linearGradient>
          <linearGradient id="tt-steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef2f4" />
            <stop offset="1" stopColor="#6b757c" />
          </linearGradient>
        </defs>
        {/* Iron half */}
        <g clipPath="url(#tt-left)">
          <path d={FACE} fill="url(#tt-red)" />
          <path d="M10 9.5h6v19.5c-3.4-.9-5.6-3.5-6-7z" fill="url(#tt-gold)" />
          <path d="M9.4 14.4l6 .6-.3 1.8-5.3-.6z" fill="#e8fbff" />
        </g>
        {/* Doom half */}
        <g clipPath="url(#tt-right)">
          <path d="M16 1c7.5 0 13.5 5.2 14.5 13.5.6 6.4-1.5 12.5-4 16H16z" fill="#156b33" />
          <path d={FACE} fill="url(#tt-steel)" />
          <path d="M22.6 14.4l-6 .6.3 1.8 5.3-.6z" fill="#3ddc84" />
          <rect x="16" y="23" width="3.4" height="1.6" rx=".8" fill="#2b3135" />
        </g>
        <path d={FACE} fill="none" stroke="#0b0d0f" strokeWidth="0.9" />
        <path d="M16 3.5v27.5" stroke="#0b0d0f" strokeWidth="0.9" />
      </svg>
    </button>
  );
}
