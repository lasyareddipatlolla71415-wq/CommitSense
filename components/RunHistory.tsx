"use client";

import { useEffect, useState } from "react";
import type { RunRecord } from "@/types/analysis";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RunHistory({ projectId }: { projectId: string }) {
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRuns() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/history/projects/${projectId}/runs`);
      if (res.ok) { const d = await res.json(); setRuns(d.runs ?? []); }
    } catch { /**/ } finally { setLoading(false); }
  }

  useEffect(() => {
    fetchRuns();
    const t = setInterval(fetchRuns, 10000);
    return () => clearInterval(t);
  }, [projectId]);

  if (loading) return <p className="text-sm" style={{ color: "var(--text-faint)" }}>Loading history...</p>;
  if (!runs.length) return <p className="text-sm" style={{ color: "var(--text-faint)" }}>No previous runs for this project.</p>;

  return (
    <div className="space-y-2">
      {runs.map((run) => (
        <div
          key={run.run_id}
          className="rounded-lg p-3 flex items-start justify-between gap-4"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
        >
          <div className="min-w-0">
            <p className="text-xs font-mono" style={{ color: "var(--text-faint)" }}>{run.run_id.slice(0, 8)}...</p>
            <p className="text-sm mt-1" style={{ color: "var(--text)" }}>{run.root_cause ?? run.error_summary ?? "—"}</p>
            {run.affected_component && (
              <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>Component: {run.affected_component}</p>
            )}
          </div>
          <div className="text-right shrink-0 space-y-1">
            <span className={`badge block ${
              run.status === "completed" ? "badge-info"
              : run.status === "failed" ? "badge-danger"
              : "badge-neutral"
            }`}>{run.status}</span>
            <span className={`text-xs block ${run.resolution_status === "resolved" ? "" : ""}`}
              style={{ color: run.resolution_status === "resolved" ? "var(--success)" : "var(--text-faint)" }}>
              {run.resolution_status}
            </span>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>{new Date(run.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
