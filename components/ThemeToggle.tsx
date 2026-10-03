"use client";

import { useSyncExternalStore } from "react";
import { toggleTheme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./Icons";

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => obs.disconnect();
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => true,
  );

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e.clientX, e.clientY)}
      aria-label={dark ? "Switch to parchment (light) theme" : "Switch to iron (dark) theme"}
      className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:rotate-12 hover:text-fg"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
