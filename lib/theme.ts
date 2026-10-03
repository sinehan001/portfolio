type VTDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

/** Toggle dark/light. Uses a circular View Transition reveal from (x, y) when supported. */
export function toggleTheme(x?: number, y?: number) {
  const root = document.documentElement;
  const next = !root.classList.contains("dark");
  const apply = () => {
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  const doc = document as VTDocument;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce) {
    apply();
    return;
  }

  const cx = x ?? window.innerWidth - 40;
  const cy = y ?? 32;
  const r = Math.hypot(
    Math.max(cx, window.innerWidth - cx),
    Math.max(cy, window.innerHeight - cy),
  );
  const t = doc.startViewTransition(apply);
  t.ready
    .then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${cx}px ${cy}px)`,
            `circle(${r}px at ${cx}px ${cy}px)`,
          ],
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
}

export const OPEN_PALETTE_EVENT = "open-command-palette";
