"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  about,
  certification,
  education,
  experience,
  projects,
  site,
  skillGroups,
} from "@/lib/content";
import { toggleTheme } from "@/lib/theme";
import { strike } from "@/lib/doom";

type Line = { id: number; kind: "in" | "out"; body: ReactNode };

const SECTIONS = ["about", "skills", "experience", "projects", "education", "contact"];
const SUGGESTIONS = ["help", "projects", "lightning", "sudo hire-me"];

const A = ({ children }: { children: ReactNode }) => (
  <span className="text-accent">{children}</span>
);
const B = ({ children }: { children: ReactNode }) => (
  <span className="text-accent2">{children}</span>
);

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const COMMANDS: Record<string, { desc: string; run: (args: string[]) => ReactNode | "CLEAR" }> = {
  help: {
    desc: "list commands",
    run: () => (
      <div className="grid grid-cols-[auto_1fr] gap-x-4">
        {Object.entries(COMMANDS)
          .filter(([k]) => k !== "sudo")
          .map(([k, v]) => (
            <span key={k} className="contents">
              <A>{k}</A>
              <span className="text-muted">{v.desc}</span>
            </span>
          ))}
        <A>sudo hire-me</A>
        <span className="text-muted">you know you want to</span>
      </div>
    ),
  },
  whoami: { desc: "who is this?", run: () => `${site.name} · ${site.title}` },
  about: { desc: "short bio", run: () => about.paragraphs[0] },
  skills: {
    desc: "tech I use",
    run: () => (
      <div>
        {skillGroups.map((g) => (
          <div key={g.title}>
            <B>{g.title.padEnd(20, " ")}</B>
            <span className="text-muted">{g.items.join(", ")}</span>
          </div>
        ))}
      </div>
    ),
  },
  experience: {
    desc: "work history",
    run: () => (
      <div>
        <div>
          <A>{experience.role}</A> · {experience.period}
        </div>
        {experience.highlights.map((h) => (
          <div key={h.title} className="text-muted">
            ▸ {h.title}
          </div>
        ))}
      </div>
    ),
  },
  projects: {
    desc: "case studies (with live demos)",
    run: () => (
      <div>
        {projects.map((p, i) => (
          <div key={p.title}>
            <B>{String(i + 1).padStart(2, "0")}</B> {p.title}
          </div>
        ))}
        <div className="text-muted">→ try: goto projects</div>
      </div>
    ),
  },
  education: {
    desc: "degree & certification",
    run: () => (
      <div>
        <div>
          {education.degree} · {education.score}
        </div>
        <div className="text-muted">{certification.name}</div>
      </div>
    ),
  },
  contact: {
    desc: "how to reach me",
    run: () => (
      <div>
        <div>
          email&nbsp;&nbsp;&nbsp;&nbsp;<A>{site.email}</A>
        </div>
        <div>
          linkedin <A>{site.linkedin.replace("https://www.", "")}</A>
        </div>
        <div>
          github&nbsp;&nbsp;&nbsp;<A>{site.github.replace("https://", "")}</A>
        </div>
      </div>
    ),
  },
  goto: {
    desc: "scroll to a section",
    run: ([target]) => {
      if (target && SECTIONS.includes(target)) {
        scrollToSection(target);
        return `→ scrolling to ${target}`;
      }
      return `usage: goto <${SECTIONS.join("|")}>`;
    },
  },
  resume: {
    desc: "open my resume",
    run: () => {
      window.open(site.resume, "_blank", "noopener");
      return "opening resume.pdf …";
    },
  },
  email: {
    desc: "copy my email",
    run: () => {
      navigator.clipboard?.writeText(site.email).catch(() => {});
      return `✔ copied ${site.email}`;
    },
  },
  theme: {
    desc: "switch Iron / Doom mode",
    run: () => {
      toggleTheme();
      return "✔ theme toggled";
    },
  },
  ls: {
    desc: "list files",
    run: () => (
      <span>
        <B>about.md</B>&nbsp; <B>skills.json</B>&nbsp; <B>experience.log</B>&nbsp;{" "}
        <A>projects/</A>&nbsp; <B>resume.pdf</B>
      </span>
    ),
  },
  lightning: {
    desc: "call down the storm",
    run: () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < 4; i++) {
        window.setTimeout(
          () => strike({ x: w * (0.15 + Math.random() * 0.7), y: h * (0.35 + Math.random() * 0.5) }),
          i * 160,
        );
      }
      return <span className="text-accent">⚡ the sky answers.</span>;
    },
  },
  kneel: {
    desc: "show respect",
    run: () => "Rise. I prefer collaborators to subjects. Type 'contact'.",
  },
  doom: {
    desc: "about this edition",
    run: () => (
      <span>
        <B>Iron / Doom Edition</B> · v4. Light mode wears the armor, dark mode wears the
        mask. Type &apos;theme&apos; to switch.
      </span>
    ),
  },
  clear: { desc: "clear the screen", run: () => "CLEAR" },
  sudo: {
    desc: "",
    run: ([arg]) => {
      if (arg === "hire-me") {
        window.setTimeout(() => {
          window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Let's talk")}`;
        }, 900);
        return (
          <span>
            <span className="text-emerald-400">✔ permission granted.</span> opening your mail
            client…
          </span>
        );
      }
      return "nice try. try: sudo hire-me";
    },
  },
};

const BOOT: string[] = ["whoami", "help"];

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const idRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (kind: Line["kind"], body: ReactNode) =>
    setLines((ls) => [...ls, { id: idRef.current++, kind, body }]);

  const exec = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const [name, ...args] = cmd.toLowerCase().split(/\s+/);
    const c = COMMANDS[name];
    const out = c ? c.run(args) : `command not found: ${name}. type 'help'`;
    if (out === "CLEAR") {
      setLines([]);
    } else {
      push("in", cmd);
      push("out", out);
    }
    setHistory((h) => [cmd, ...h].slice(0, 30));
    setHIdx(-1);
  };

  // Boot sequence: auto-type a couple of commands.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    let t = 600;
    for (const cmd of BOOT) {
      if (reduce) {
        timers.push(window.setTimeout(() => exec(cmd), 0));
        continue;
      }
      for (let i = 1; i <= cmd.length; i++) {
        const partial = cmd.slice(0, i);
        timers.push(window.setTimeout(() => setInput(partial), t));
        t += 70;
      }
      timers.push(
        window.setTimeout(() => {
          setInput("");
          exec(cmd);
        }, t + 250),
      );
      t += 900;
    }
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      exec(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(hIdx + 1, history.length - 1);
      if (i >= 0) {
        setHIdx(i);
        setInput(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIdx - 1;
      setHIdx(Math.max(i, -1));
      setInput(i >= 0 ? history[i] : "");
    } else if (e.key === "Tab") {
      const match = Object.keys(COMMANDS).find((k) => input && k.startsWith(input));
      if (match) {
        e.preventDefault();
        setInput(match + " ");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div
        className="iron no-rivets relative overflow-hidden rounded-2xl border border-line shadow-2xl shadow-black/40"
        data-cursor="Type"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
      >
        <div className="relative flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-xs text-muted">
            <span className="doom-only">
              citadel<span className="opacity-60">://console</span>
            </span>
            <span className="stark-only">
              workshop<span className="opacity-60">://hud</span>
            </span>
          </span>
          <span className="ml-auto rounded bg-accent-soft px-2 py-0.5 font-mono text-[10px] text-accent">
            <span className="doom-only">obeys</span>
            <span className="stark-only">online</span>
          </span>
        </div>
        <div
          ref={bodyRef}
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          className="h-64 overflow-y-auto p-4 font-mono text-[12.5px] leading-6 sm:h-72"
        >
          {lines.map((l) =>
            l.kind === "in" ? (
              <div key={l.id}>
                <span className="text-accent2">λ</span> {l.body}
              </div>
            ) : (
              <div key={l.id} className="mb-2 whitespace-pre-wrap break-words">
                {l.body}
              </div>
            ),
          )}
        </div>
        {/* Prompt is pinned to the bottom of the window; output scrolls above it */}
        <div className="flex items-center gap-2 border-t border-line bg-surface-2/70 px-4 py-3 font-mono text-[12.5px] transition focus-within:bg-accent-soft focus-within:shadow-[inset_0_2px_0_var(--accent)]">
          <span className="text-accent2">λ</span>
          <label htmlFor="term-input" className="sr-only">
            Terminal command
          </label>
          <input
            id="term-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent caret-[var(--accent)] outline-none placeholder:text-muted focus-visible:outline-none"
            placeholder="type a command… (try help)"
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-muted sm:inline">↵ enter</kbd>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => exec(s)}
            className="rounded-full border border-line bg-surface/60 px-2.5 py-1 font-mono backdrop-blur transition hover:border-accent hover:text-fg"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
