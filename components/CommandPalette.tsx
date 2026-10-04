"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, site } from "@/lib/content";
import { OPEN_PALETTE_EVENT, toggleTheme } from "@/lib/theme";

type Item = { label: string; group: string; hint?: string; run: () => void };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const lastFocus = useRef<HTMLElement | null>(null);

  const items: Item[] = useMemo(
    () => [
      ...navLinks.map((l) => ({
        label: `Go to ${l.label}`,
        group: "Navigate",
        run: () =>
          document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth", block: "start" }),
      })),
      {
        label: "Back to top",
        group: "Navigate",
        run: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      },
      {
        label: "Download resume",
        group: "Actions",
        hint: "PDF",
        run: () => window.open(site.resume, "_blank", "noopener"),
      },
      {
        label: "Copy email address",
        group: "Actions",
        hint: site.email,
        run: () => navigator.clipboard?.writeText(site.email).catch(() => {}),
      },
      {
        label: "Send an email",
        group: "Actions",
        run: () => (window.location.href = `mailto:${site.email}`),
      },
      { label: "Switch Iron / Doom mode", group: "Actions", hint: "theme", run: () => toggleTheme() },
      {
        label: "Open GitHub",
        group: "Links",
        hint: "github.com/sinehan001",
        run: () => window.open(site.github, "_blank", "noopener"),
      },
      {
        label: "Open LinkedIn",
        group: "Links",
        hint: "in/sinehan001",
        run: () => window.open(site.linkedin, "_blank", "noopener"),
      },
    ],
    [],
  );

  const filtered = items.filter((i) =>
    `${i.label} ${i.group} ${i.hint ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  );

  const show = () => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    lastFocus.current?.focus?.({ preventScroll: true });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            lastFocus.current = document.activeElement as HTMLElement | null;
            setQuery("");
            setActive(0);
          }
          return !o;
        });
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  const runItem = (item?: Item) => {
    if (!item) return;
    close();
    window.setTimeout(item.run, 60);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      runItem(filtered[active]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/50 px-4 pt-[15vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Type a command or search…"
                aria-label="Search commands"
                aria-controls="palette-list"
                aria-activedescendant={filtered[active] ? `palette-${active}` : undefined}
                role="combobox"
                aria-expanded="true"
                className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
                ESC
              </kbd>
            </div>
            <ul id="palette-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted">No results</li>
              )}
              {filtered.map((item, i) => {
                const header = item.group !== lastGroup ? item.group : null;
                lastGroup = item.group;
                return (
                  <li key={item.label} role="presentation">
                    {header && (
                      <div className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted">
                        {header}
                      </div>
                    )}
                    <div
                      id={`palette-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => runItem(item)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                        i === active ? "bg-accent-soft text-fg" : "text-muted"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.hint && <span className="text-xs text-muted">{item.hint}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
