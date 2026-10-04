"use client";

import { useEffect } from "react";

/**
 * Pauses CSS animations inside any element marked `data-anim` while it is off
 * screen (adds `.anim-off`), so only what the visitor can see keeps animating.
 */
export default function AnimPauser() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle("anim-off", !e.isIntersecting);
      },
      { rootMargin: "120px 0px" },
    );
    document.querySelectorAll("[data-anim]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
