type VTDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

let switching = false;

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * Toggle dark/light.
 * - Desktop: circular View Transition reveal from (x, y).
 * - Touch / small screens: a lightweight cover-and-fade. Full-page View Transition
 *   snapshots are very expensive on phones and could freeze the page for seconds.
 * In both cases CSS transitions are suspended during the swap so hundreds of
 * elements don't animate their colours at once.
 */
export function toggleTheme(x?: number, y?: number) {
  if (switching) return;
  const root = document.documentElement;
  const next = !root.classList.contains("dark");

  const apply = () => {
    root.classList.add("theme-switching");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    // Re-enable transitions once the new theme has painted.
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lightweight =
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  const doc = document as VTDocument;

  if (reduce) {
    apply();
    return;
  }

  if (lightweight || !doc.startViewTransition) {
    switching = true;
    const cover = document.createElement("div");
    cover.setAttribute("aria-hidden", "true");
    Object.assign(cover.style, {
      position: "fixed",
      inset: "0",
      zIndex: "95",
      pointerEvents: "none",
      background: getComputedStyle(root).getPropertyValue("--bg").trim() || (next ? "#f3f5f8" : "#040705"),
      opacity: "1",
      transition: "opacity 420ms ease",
      willChange: "opacity",
    });
    document.body.appendChild(cover);
    (async () => {
      await nextFrame(); // let the cover paint first so the tap feels instant
      apply(); // heavy repaint happens underneath the cover
      await nextFrame();
      await nextFrame();
      cover.style.opacity = "0";
      const done = () => {
        cover.remove();
        switching = false;
      };
      cover.addEventListener("transitionend", done, { once: true });
      window.setTimeout(done, 700);
    })();
    return;
  }

  switching = true;
  const cx = x ?? window.innerWidth - 40;
  const cy = y ?? 32;
  const r = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
  const t = doc.startViewTransition(apply);
  t.ready
    .then(() => {
      root.animate(
        {
          clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${r}px at ${cx}px ${cy}px)`],
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
  t.finished.finally(() => {
    switching = false;
  });
}

export const OPEN_PALETTE_EVENT = "open-command-palette";
