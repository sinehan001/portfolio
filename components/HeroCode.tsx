import { site } from "@/lib/content";

const k = "text-accent2";
const s = "text-accent";
const p = "text-muted";

/** Decorative code window; the real content is in the page text. */
export default function HeroCode() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full max-w-md rounded-2xl border border-line bg-surface/80 shadow-2xl shadow-black/20 backdrop-blur"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <span className="ml-3 font-mono text-xs text-muted">sinehan.ts</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7">
        <code>
          <span className={k}>const</span> developer <span className={p}>=</span>{" "}
          <span className={p}>{"{"}</span>
          {"\n  "}role<span className={p}>:</span>{" "}
          <span className={s}>&quot;Software Developer&quot;</span>
          <span className={p}>,</span>
          {"\n  "}focus<span className={p}>:</span> <span className={p}>[</span>
          <span className={s}>&quot;Node.js&quot;</span>
          <span className={p}>,</span> <span className={s}>&quot;GenAI&quot;</span>
          <span className={p}>,</span> <span className={s}>&quot;Automation&quot;</span>
          <span className={p}>],</span>
          {"\n  "}data<span className={p}>:</span> <span className={p}>[</span>
          <span className={s}>&quot;PostgreSQL&quot;</span>
          <span className={p}>,</span> <span className={s}>&quot;Weaviate&quot;</span>
          <span className={p}>],</span>
          {"\n  "}queue<span className={p}>:</span> <span className={s}>&quot;RabbitMQ&quot;</span>
          <span className={p}>,</span>
          {"\n  "}based<span className={p}>:</span>{" "}
          <span className={s}>&quot;{site.location.split(",")[0]}&quot;</span>
          <span className={p}>,</span>
          {"\n  "}shipsToProduction<span className={p}>:</span> <span className={k}>true</span>
          <span className={p}>,</span>
          {"\n"}
          <span className={p}>{"}"}</span>
          <span className="cursor-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-accent" />
        </code>
      </pre>
    </div>
  );
}
