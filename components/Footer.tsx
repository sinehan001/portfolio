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
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-xs">v2</span>
        </p>
      </div>
    </footer>
  );
}
