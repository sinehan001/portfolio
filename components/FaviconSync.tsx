"use client";

import { useEffect } from "react";

const DOOM_ICON = "/icon-doom.svg";

/**
 * Swaps the browser-tab icon to match the theme: Iron (default app icon) or Doom.
 * Handles icon links that Next.js adds or re-renders after hydration.
 */
export default function FaviconSync() {
  useEffect(() => {
    const apply = () => {
      const dark = document.documentElement.classList.contains("dark");
      document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]').forEach((l) => {
        const href = l.getAttribute("href") ?? "";
        // Remember the original (Iron) icon the first time we see this link.
        if (!l.dataset.ironHref && href !== DOOM_ICON) l.dataset.ironHref = href;
        const next = dark ? DOOM_ICON : (l.dataset.ironHref ?? href);
        if (href !== next) l.setAttribute("href", next);
      });
    };

    apply();
    const themeObs = new MutationObserver(apply);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const headObs = new MutationObserver(apply);
    headObs.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    return () => {
      themeObs.disconnect();
      headObs.disconnect();
    };
  }, []);

  return null;
}
