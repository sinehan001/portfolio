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

/** Sliding IRON | DOOM switch: light (Iron) ⇄ dark (Doom). */
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
      className="font-display relative grid h-9 w-[104px] grid-cols-2 items-center rounded-full border border-line bg-surface-2/80 p-1 text-[11px] font-bold uppercase tracking-[0.14em] transition hover:border-accent"
    >
      {/* Sliding thumb */}
      <span
        aria-hidden="true"
        className="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.3,1.4,0.5,1)]"
        style={{
          transform: dark ? "translateX(100%)" : "translateX(0)",
          background: dark
            ? "linear-gradient(180deg, #2fbf6c, #117a3c)"
            : "linear-gradient(180deg, #ff4a3d, #a10f17)",
          boxShadow: dark
            ? "0 0 14px rgba(61,220,132,0.55), inset 0 1px 0 rgba(255,255,255,0.35)"
            : "0 0 14px rgba(56,189,248,0.45), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      />
      <span aria-hidden="true" className={`relative text-center transition-colors ${dark ? "text-muted" : "text-white"}`}>
        Iron
      </span>
      <span aria-hidden="true" className={`relative text-center transition-colors ${dark ? "text-white" : "text-muted"}`}>
        Doom
      </span>
    </button>
  );
}
