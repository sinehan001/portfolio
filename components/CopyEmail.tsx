"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckIcon, CopyIcon } from "./Icons";

type Bit = { id: number; x: number; y: number; r: number; c: string };
const COLORS = ["var(--accent)", "var(--accent2)", "#34d399", "#fbbf24"];

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [bits, setBits] = useState<Bit[]>([]);
  const reduce = useReducedMotion();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return;
    }
    setCopied(true);
    if (!reduce) {
      const base = Date.now();
      setBits(
        Array.from({ length: 18 }, (_, i) => {
          const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.4;
          const dist = 50 + Math.random() * 60;
          return {
            id: base + i,
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist - 20,
            r: Math.random() * 360,
            c: COLORS[i % COLORS.length],
          };
        }),
      );
      window.setTimeout(() => setBits([]), 900);
    }
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium transition hover:border-accent"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? "Copied!" : "Copy email"}
      </button>
      <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
        <AnimatePresence>
          {bits.map((b) => (
            <motion.span
              key={b.id}
              className="absolute h-2 w-1.5 rounded-sm"
              style={{ background: b.c }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: b.x, y: b.y + 40, opacity: 0, rotate: b.r }}
              transition={{ duration: 0.85, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </span>
  );
}
