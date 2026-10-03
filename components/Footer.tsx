import { site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-line py-10 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}. Built with Next.js, Tailwind CSS &amp; Framer
          Motion.
        </p>
        <p className="flex items-center gap-3">
          <span>
            Press{" "}
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-xs">Ctrl K</kbd>{" "}
            to navigate
          </span>
          <span className="font-display whitespace-nowrap rounded-full border border-accent2/50 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.2em] text-accent2">
            Doomsday · v3
          </span>
        </p>
      </div>
    </footer>
  );
}
