"use client";

import { useEffect, useState } from "react";
import type { RunRecord } from "@/types/analysis";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Project = {
  project_id: string;
  repository_url: string;
  repository_owner?: string;
  repository_name?: string;
  created_at?: string;
  updated_at?: string;
};

type ProjectSummary = {
  total_runs: number;
  completed_runs: number;
  failed_runs: number;
};

export default function HistoryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [summaries, setSummaries] = useState<Record<string, ProjectSummary>>({});
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/history/projects`);
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        const list: Project[] = data.projects ?? [];
        setProjects(list);

        // Fetch summaries in parallel
        const summaryResults = await Promise.all(
          list.map(async (p) => {
            try {
              const r = await fetch(`${API_BASE_URL}/api/history/projects/${p.project_id}/summary`);
              if (!r.ok) return [p.project_id, null] as const;
              const d = await r.json();
              return [p.project_id, d.summary as ProjectSummary] as const;
            } catch {
              return [p.project_id, null] as const;
            }
          })
        );
        const map: Record<string, ProjectSummary> = {};
        summaryResults.forEach(([id, s]) => { if (s) map[id] = s; });
        setSummaries(map);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load history");
      } finally {
        setLoadingProjects(false);
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    setLoadingRuns(true);
    setRuns([]);
    async function fetchRuns() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/history/projects/${selectedProject}/runs`);
        if (!res.ok) throw new Error("Failed to fetch runs");
        const data = await res.json();
        setRuns(data.runs ?? []);
      } catch {
        setRuns([]);
      } finally {
        setLoadingRuns(false);
      }
    }
    fetchRuns();
  }, [selectedProject]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">History</h2>
        <p className="mt-1 text-sm text-gray-400">All past analysis runs grouped by project.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>
      )}

      {loadingProjects ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl glass shimmer" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center text-gray-500">
          <p className="text-3xl mb-3">📭</p>
          <p>No analysis history yet. Run your first analysis to see it here.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const summary = summaries[p.project_id];
            const isSelected = selectedProject === p.project_id;
            return (
              <button
                key={p.project_id}
                onClick={() => setSelectedProject(isSelected ? null : p.project_id)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  isSelected ? "border-violet-500/50 bg-violet-500/10" : "border-white/8 glass glass-hover"
                }`}
              >
                <p className="text-xs text-gray-500 font-mono truncate">
                  {p.repository_owner && p.repository_name
                    ? `${p.repository_owner}/${p.repository_name}`
                    : p.repository_url.replace("https://github.com/", "")}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-200 truncate">{p.project_id.slice(0, 12)}...</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "—"}
                  </span>
                  {summary && (
                    <span className="text-xs px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300">
                      {summary.total_runs} run{summary.total_runs !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedProject && (
        <div className="glass rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-300">Runs for selected project</h3>
          {loadingRuns ? (
            <div className="space-y-2">
              {[1, 2].map((i) => <div key={i} className="h-14 rounded-lg shimmer bg-white/5" />)}
            </div>
          ) : runs.length === 0 ? (
            <p className="text-sm text-gray-500">No runs found.</p>
          ) : (
            <div className="space-y-2">
              {runs.map((run) => (
                <div key={run.run_id} className="rounded-lg border border-white/8 bg-white/3 p-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-gray-500">{run.run_id.slice(0, 8)}...</p>
                    <p className="text-sm text-gray-300 mt-1 truncate">{run.root_cause ?? run.error_summary ?? "—"}</p>
                    {run.affected_component && (
                      <p className="text-xs text-gray-500 mt-1">Component: {run.affected_component}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border block ${
                      run.status === "completed" ? "border-blue-700/50 bg-blue-500/10 text-blue-300"
                      : run.status === "failed" ? "border-red-700/50 bg-red-500/10 text-red-300"
                      : "border-gray-700/50 bg-white/5 text-gray-400"
                    }`}>{run.status}</span>
                    <span className={`text-xs block ${run.resolution_status === "resolved" ? "text-green-400" : "text-gray-500"}`}>
                      {run.resolution_status}
                    </span>
                    <p className="text-xs text-gray-600">{new Date(run.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
