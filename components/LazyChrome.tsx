"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { OPEN_PALETTE_EVENT } from "@/lib/theme";

const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

/**
 * Loads the command palette and cursor follower after the page is idle, so they
 * stay out of the initial JavaScript. Ctrl/Cmd+K (or the navbar button) before
 * then loads the palette immediately and opens it once it has mounted.
 */
export default function LazyChrome() {
  const [ready, setReady] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(
      () => {
        loaded.current = true;
        setReady(true);
      },
      { timeout: 4000 },
    );

    const early = (e: Event) => {
      // Once loaded, the palette handles its own shortcut and open events.
      if (loaded.current) return;
      if (e instanceof KeyboardEvent && !((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) return;
      if (e instanceof KeyboardEvent) e.preventDefault();
      loaded.current = true;
      setPendingOpen(true);
      setReady(true);
    };
    window.addEventListener("keydown", early);
    window.addEventListener(OPEN_PALETTE_EVENT, early);
    return () => {
      cancel(id);
      window.removeEventListener("keydown", early);
      window.removeEventListener(OPEN_PALETTE_EVENT, early);
    };
  }, []);

  // Once the palette has mounted, replay the open request the visitor made early.
  useEffect(() => {
    if (!ready || !pendingOpen) return;
    const t = window.setTimeout(() => {
      setPendingOpen(false);
      window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
    }, 250);
    return () => window.clearTimeout(t);
  }, [ready, pendingOpen]);

  if (!ready) return null;
  return (
    <>
      <CommandPalette />
      <CustomCursor />
    </>
  );
}
