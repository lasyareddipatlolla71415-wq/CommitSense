"use client";

import type { HistoricalMatch, HistoricalComparison } from "@/types/analysis";

type Props = { matches: HistoricalMatch[]; comparison: HistoricalComparison | null };

export default function HistoryPanel({ matches, comparison }: Props) {
  if (!matches.length && !comparison) {
    return (
      <div className="card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-faint)" }}>Historical Context</p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No previous runs found for this error pattern. This appears to be the first occurrence.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>Historical Context</p>

      {comparison && (
        <div
          className="rounded-lg p-4"
          style={{
            background: comparison.regression_suspected ? "var(--warn-bg)" : "var(--bg-subtle)",
            border: `1px solid ${comparison.regression_suspected ? "var(--warn-border)" : "var(--border)"}`,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: comparison.regression_suspected ? "var(--warn)" : "var(--text)" }}>
            {comparison.regression_suspected
              ? "Regression Suspected"
              : `Occurred ${comparison.occurrence_count} time(s) before`}
          </p>
          <ul className="mt-2 space-y-1">
            {comparison.findings.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ background: "var(--text-faint)" }} />
                {f}
              </li>
            ))}
          </ul>
          {comparison.previous_root_cause && (
            <p className="mt-3 text-xs" style={{ color: "var(--text-faint)" }}>
              Previous diagnosis:{" "}
              <span style={{ color: "var(--text-muted)" }}>{comparison.previous_root_cause}</span>
              {comparison.previous_confidence !== null && (
                <span> ({Math.round((comparison.previous_confidence ?? 0) * 100)}% confidence)</span>
              )}
            </p>
          )}
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>Previous related runs</p>
          {matches.map((m) => (
            <div
              key={m.run_id}
              className="rounded-lg p-3 flex items-start justify-between gap-4"
              style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
            >
              <div className="min-w-0">
                <p className="text-xs font-mono" style={{ color: "var(--text-faint)" }}>{m.run_id.slice(0, 8)}...</p>
                <p className="text-sm mt-1" style={{ color: "var(--text)" }}>{m.root_cause ?? "No diagnosis recorded"}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{m.error_summary}</p>
              </div>
              <div className="text-right shrink-0 space-y-1">
                <span className={`badge ${m.resolution_status === "resolved" ? "badge-success" : "badge-neutral"}`}>
                  {m.resolution_status ?? "unknown"}
                </span>
                <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                  {new Date(m.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
