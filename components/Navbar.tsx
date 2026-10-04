"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, site } from "@/lib/content";
import { OPEN_PALETTE_EVENT } from "@/lib/theme";
import ThemeToggle from "./ThemeToggle";
import ScrollProgress from "./ScrollProgress";
import { CloseIcon, MenuIcon } from "./Icons";
import Monogram from "./doom/Monogram";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Scroll spy: highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const top = document.getElementById("top");
    const topIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), {
      rootMargin: "-45% 0px -50% 0px",
    });
    if (top) topIo.observe(top);
    return () => {
      io.disconnect();
      topIo.disconnect();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-lg">
      <ScrollProgress />
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"
      >
        <a href="#top" className="group flex items-center gap-2.5">
          <Monogram className="h-8 w-8" />
          <span className="font-display text-base font-bold uppercase tracking-[0.22em]">{site.name}</span>
        </a>

        <ul className="hidden items-center gap-1 text-sm text-muted md:flex">
          {navLinks.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-accent-soft"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <a
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`font-display relative block rounded-full px-3 py-1.5 text-[13px] uppercase tracking-[0.12em] transition hover:text-fg ${
                    isActive ? "text-fg" : ""
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="hidden h-9 items-center gap-2 rounded-full border border-line px-3 text-xs text-muted transition hover:border-accent hover:text-fg sm:inline-flex"
            aria-label="Open command palette"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <kbd className="font-mono">Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-bg px-5 md:hidden"
          >
            {navLinks.map((l, i) => (
              <motion.li
                key={l.href}
                initial={{ x: -12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.04 * i }}
              >
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-lg text-muted hover:text-fg"
                >
                  {l.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
