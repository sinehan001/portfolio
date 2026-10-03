import type { ArchDiagramData } from "@/lib/content";

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 rotate-90 text-accent md:rotate-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function ArchDiagram({ data }: { data: ArchDiagramData }) {
  return (
    <figure className="rounded-xl border border-line bg-bg p-4">
      <figcaption className="mb-3 text-xs uppercase tracking-wider text-muted">
        {data.label}
      </figcaption>
      <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        {data.columns.map((col, i) => (
          <li
            key={col.join("|")}
            className="flex flex-col items-center gap-2 md:flex-1 md:flex-row"
          >
            {i > 0 && <Arrow />}
            <div className="flex w-full flex-col gap-2">
              {col.map((node) => (
                <div
                  key={node}
                  className="rounded-lg border border-accent/40 bg-accent-soft px-3 py-2 text-center text-xs font-medium"
                >
                  {node}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
