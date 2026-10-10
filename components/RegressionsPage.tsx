"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type RegressionRun = {
  run_id: string;
  project_id: string;
  repository_url: string;
  root_cause: string | null;
  error_summary: string | null;
  affected_component: string | null;
  created_at: string;
  historical_comparison?: {
    regression_suspected: boolean;
    occurrence_count: number;
    previous_root_cause?: string | null;
  } | null;
};

export default function RegressionsPage() {
  const [regressions, setRegressions] = useState<RegressionRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegressions() {
      try {
        // Fetch all projects, then all runs, filter for regression_suspected
        const projectsRes = await fetch(`${API_BASE_URL}/api/history/projects`);
        if (!projectsRes.ok) throw new Error("Failed to fetch projects");
        const projectsData = await projectsRes.json();
        const projects = projectsData.projects ?? [];

        const allRuns: RegressionRun[] = [];
        await Promise.all(
          projects.map(async (p: { project_id: string }) => {
            try {
              const r = await fetch(`${API_BASE_URL}/api/history/projects/${p.project_id}/runs`);
              if (!r.ok) return;
              const d = await r.json();
              allRuns.push(...(d.runs ?? []));
            } catch { /* skip */ }
          })
        );

        const suspected = allRuns.filter(
          (run) => run.historical_comparison?.regression_suspected === true
        );
        setRegressions(suspected.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load regressions");
      } finally {
        setLoading(false);
      }
    }
    fetchRegressions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Regressions</h2>
        <p className="mt-1 text-sm text-gray-400">Errors that reappeared after being previously resolved.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">⚠️ {error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl glass shimmer" />)}
        </div>
      ) : regressions.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center text-gray-500">
          <p className="text-3xl mb-3">✅</p>
          <p className="font-medium text-gray-300">No regressions detected</p>
          <p className="mt-1 text-sm">All resolved errors have stayed resolved.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {regressions.map((r) => (
            <div key={r.run_id} className="glass rounded-xl border border-amber-500/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full border border-amber-600/50 bg-amber-500/10 text-amber-300 font-medium">
                      ⚠️ Regression
                    </span>
                    {r.historical_comparison?.occurrence_count && (
                      <span className="text-xs text-gray-500">Seen {r.historical_comparison.occurrence_count}×</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-200">{r.root_cause ?? "Unknown root cause"}</p>
                  {r.historical_comparison?.previous_root_cause && (
                    <p className="text-xs text-gray-500 mt-1">
                      Previously: {r.historical_comparison.previous_root_cause}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-1 truncate">{r.error_summary}</p>
                  {r.affected_component && (
                    <p className="text-xs text-gray-600 mt-1">Component: {r.affected_component}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500 font-mono">{r.run_id.slice(0, 8)}...</p>
                  <p className="text-xs text-gray-600 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
