"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Role = "Viewer" | "Analyst" | "Admin";
type StepState = "idle" | "run" | "ok" | "fail";
type Table = { cols: string[]; rows: (string | number)[][] };
type Result = { blocked: string } | { table: Table; answer: string };

const ROLES: Role[] = ["Viewer", "Analyst", "Admin"];
const STEPS = ["Role check", "Vector search", "Generate SQL", "Read-only guard", "Execute", "Answer"];
const ACCESS: Record<Role, string> = {
  Viewer: "tickets (own team only)",
  Analyst: "tickets, api_logs",
  Admin: "all tables (read-only)",
};

type Scenario = {
  q: string;
  context: string;
  sql: (r: Role) => string;
  block?: (r: Role) => { step: number; reason: string } | null;
  table: (r: Role) => Table;
  answer: (r: Role) => string;
};

const SCENARIOS: Scenario[] = [
  {
    q: "How many open tickets are there per region this week?",
    context: "tickets(region, status, created_at, team_id)",
    sql: (r) =>
      `SELECT region, COUNT(*) AS open_tickets
FROM tickets
WHERE status = 'open'
  AND created_at >= date_trunc('week', now())${r === "Viewer" ? "\n  AND team_id = :current_team" : ""}
GROUP BY region
ORDER BY open_tickets DESC;`,
    table: (r) =>
      r === "Viewer"
        ? { cols: ["region", "open_tickets"], rows: [["South", 7]] }
        : {
            cols: ["region", "open_tickets"],
            rows: [
              ["North", 18],
              ["South", 14],
              ["West", 9],
              ["East", 6],
            ],
          },
    answer: (r) =>
      r === "Viewer"
        ? "Your team has 7 open tickets this week, all in the South region."
        : "North has the most open tickets this week (18), followed by South (14).",
  },
  {
    q: "Which endpoints had the most failed requests yesterday?",
    context: "api_logs(endpoint, status_code, logged_at)",
    sql: () =>
      `SELECT endpoint, COUNT(*) AS failures
FROM api_logs
WHERE status_code >= 500
  AND logged_at >= now() - interval '1 day'
GROUP BY endpoint
ORDER BY failures DESC
LIMIT 3;`,
    block: (r) =>
      r === "Viewer" ? { step: 0, reason: "Role 'Viewer' is not permitted to query api_logs." } : null,
    table: () => ({
      cols: ["endpoint", "failures"],
      rows: [
        ["/orders", 41],
        ["/auth/login", 17],
        ["/payments", 9],
      ],
    }),
    answer: () => "/orders failed most often yesterday (41 server errors), then /auth/login.",
  },
  {
    q: "Delete all tickets older than one year.",
    context: "tickets(id, created_at)",
    sql: () => `DELETE FROM tickets
WHERE created_at < now() - interval '1 year';`,
    block: () => ({
      step: 3,
      reason: "Rejected: DELETE statement. Only read-only SELECT queries are allowed, for every role.",
    }),
    table: () => ({ cols: [], rows: [] }),
    answer: () => "",
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function RagDemo() {
  const reduce = useReducedMotion();
  const [role, setRole] = useState<Role>("Analyst");
  const [qi, setQi] = useState(0);
  const [states, setStates] = useState<StepState[]>(STEPS.map(() => "idle"));
  const [sql, setSql] = useState("");
  const [log, setLog] = useState<{ ok: boolean; text: string }[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [running, setRunning] = useState(false);
  const runId = useRef(0);

  const reset = () => {
    runId.current++;
    setStates(STEPS.map(() => "idle"));
    setSql("");
    setLog([]);
    setResult(null);
    setRunning(false);
  };

  const setStep = (i: number, s: StepState) =>
    setStates((prev) => prev.map((v, j) => (j === i ? s : v)));

  const run = async () => {
    reset();
    const id = runId.current;
    const sc = SCENARIOS[qi];
    const block = sc.block?.(role) ?? null;
    const table = sc.table(role);
    const fullSql = sc.sql(role);
    const messages = [
      `role=${role} → access: ${ACCESS[role]}`,
      `retrieved schema context: ${sc.context}`,
      "LLM generated SQL from the question + context",
      "statement is SELECT · running in a read-only transaction",
      `${table.rows.length} row(s) returned (sample data)`,
      "answer grounded in the query results",
    ];
    setRunning(true);

    for (let i = 0; i < STEPS.length; i++) {
      if (runId.current !== id) return;
      setStep(i, "run");
      await sleep(reduce ? 50 : 550);
      if (i === 2) {
        for (let k = 0; k <= fullSql.length; k += reduce ? fullSql.length : 4) {
          if (runId.current !== id) return;
          setSql(fullSql.slice(0, k));
          await sleep(10);
        }
        setSql(fullSql);
      }
      if (runId.current !== id) return;
      if (block && block.step === i) {
        setStep(i, "fail");
        setLog((l) => [...l, { ok: false, text: block.reason }]);
        setResult({ blocked: block.reason });
        setRunning(false);
        return;
      }
      setStep(i, "ok");
      setLog((l) => [...l, { ok: true, text: messages[i] }]);
    }
    setResult({ table, answer: sc.answer(role) });
    setRunning(false);
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-muted">Signed in as</span>
        <div role="group" aria-label="Role" className="inline-flex rounded-full border border-line p-0.5">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              onClick={() => {
                setRole(r);
                reset();
              }}
              className={`rounded-full px-3 py-1 text-xs transition ${
                role === r ? "bg-gradient-accent text-on-accent" : "text-muted hover:text-fg"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div role="group" aria-label="Question" className="grid gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.q}
            type="button"
            aria-pressed={qi === i}
            onClick={() => {
              setQi(i);
              reset();
            }}
            className={`rounded-xl border px-3 py-2 text-left transition ${
              qi === i ? "border-accent bg-accent-soft text-fg" : "border-line text-muted hover:border-accent/50"
            }`}
          >
            “{s.q}”
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={run}
        disabled={running}
        className="bg-gradient-accent inline-flex items-center gap-2 rounded-full px-5 py-2 font-medium text-on-accent shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {running ? "Running…" : "Run query ▶"}
      </button>

      <ol className="flex flex-wrap gap-1.5" aria-label="Pipeline steps">
        {STEPS.map((s, i) => {
          const st = states[i];
          return (
            <li
              key={s}
              className={`relative overflow-hidden rounded-full border px-2.5 py-1 font-mono text-[11px] transition ${
                st === "ok"
                  ? "border-accent/60 text-accent"
                  : st === "fail"
                    ? "border-red-400/70 bg-red-500/10 text-red-400"
                    : st === "run"
                      ? "border-accent2 text-fg"
                      : "border-line text-muted"
              }`}
            >
              {st === "run" && <span aria-hidden="true" className="shimmer absolute inset-0" />}
              <span className="relative">
                {st === "ok" ? "✔ " : st === "fail" ? "✖ " : ""}
                {s}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-3">
        <pre className="min-h-[7.5rem] overflow-x-auto rounded-xl border border-line bg-bg p-3 font-mono text-[11.5px] leading-5 text-accent">
          <code>{sql || <span className="text-muted">-- generated SQL appears here</span>}</code>
        </pre>

        <div aria-live="polite" className="space-y-1 font-mono text-[11px]">
          {log.map((l, i) => (
            <div key={i} className={l.ok ? "text-muted" : "text-red-400"}>
              {l.ok ? "✔" : "✖"} {l.text}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={"blocked" in result ? "b" : "t"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {"blocked" in result ? (
                <div className="rounded-xl border border-red-400/50 bg-red-500/10 p-3 text-red-300 dark:text-red-300">
                  <strong className="text-red-500 dark:text-red-400">Blocked by guardrail.</strong>{" "}
                  <span className="text-fg">{result.blocked}</span>
                </div>
              ) : (
                <div className="rounded-xl border border-line bg-bg p-3">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="text-muted">
                        {result.table.cols.map((c) => (
                          <th key={c} className="pb-1 font-medium">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.table.rows.map((r) => (
                        <tr key={String(r[0])} className="border-t border-line">
                          {r.map((v, j) => (
                            <td key={j} className="py-1">
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-3 text-fg">💬 {result.answer}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
