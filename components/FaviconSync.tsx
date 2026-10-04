"use client";

import { useEffect } from "react";

const DOOM_ICON = "/icon-doom.svg";

/** Swaps the browser-tab icon to match the theme: Iron (default app icon) or Doom. */
export default function FaviconSync() {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'));
    if (!links.length) return;
    // Remember each link's original (Iron) icon so we can switch back.
    const iron = links.map((l) => l.getAttribute("href") ?? "");

    const apply = () => {
      const dark = document.documentElement.classList.contains("dark");
      links.forEach((l, i) => {
        const next = dark ? DOOM_ICON : iron[i];
        if (l.getAttribute("href") !== next) l.setAttribute("href", next);
      });
    };

    apply();
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mo.disconnect();
      links.forEach((l, i) => l.setAttribute("href", iron[i]));
    };
  }, []);

  return null;
}
