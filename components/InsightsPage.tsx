"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Project = { project_id: string; repository_url: string; repository_owner?: string; repository_name?: string };
type Summary = { total_runs: number; completed_runs: number; failed_runs: number; last_run_at?: string };
type FrequentError = { fingerprint: string; count: number; last_seen: string; component: string | null };

type ProjectInsight = {
  project: Project;
  summary: Summary;
  frequent: FrequentError[];
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<ProjectInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRuns, setTotalRuns] = useState(0);
  const [totalResolved, setTotalResolved] = useState(0);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const projectsRes = await fetch(`${API_BASE_URL}/api/history/projects`);
        if (!projectsRes.ok) throw new Error();
        const projectsData = await projectsRes.json();
        const projects: Project[] = (projectsData.projects ?? []).slice(0, 10);

        const results = await Promise.all(
          projects.map(async (p) => {
            const [summaryRes, runsRes] = await Promise.all([
              fetch(`${API_BASE_URL}/api/history/projects/${p.project_id}/summary`).catch(() => null),
              fetch(`${API_BASE_URL}/api/history/projects/${p.project_id}/runs`).catch(() => null),
            ]);
            const summaryData = summaryRes?.ok ? await summaryRes.json() : null;
            const runsData = runsRes?.ok ? await runsRes.json() : null;
            const summary: Summary = summaryData?.summary ?? { total_runs: 0, completed_runs: 0, failed_runs: 0 };
            const frequent: FrequentError[] = summaryData?.frequent_errors ?? [];
            const runs = runsData?.runs ?? [];
            return { project: p, summary, frequent, runs };
          })
        );

        let total = 0, resolved = 0;
        results.forEach(({ summary, runs }) => {
          total += summary.total_runs;
          resolved += runs.filter((r: { resolution_status: string }) => r.resolution_status === "resolved").length;
        });

        setTotalRuns(total);
        setTotalResolved(resolved);
        setInsights(results.map(({ project, summary, frequent }) => ({ project, summary, frequent })));
      } catch {
        // silently show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  const resolveRate = totalRuns > 0 ? Math.round((totalResolved / totalRuns) * 100) : 0;
  const totalFailed = insights.reduce((acc, i) => acc + i.summary.failed_runs, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Insights</h2>
          <p className="mt-1 text-sm text-gray-400">Aggregated patterns from your analysis history.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-xl glass shimmer" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Insights</h2>
        <p className="mt-1 text-sm text-gray-400">Aggregated patterns from your analysis history.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Runs", value: totalRuns, icon: "🔬", color: "text-violet-300" },
          { label: "Resolved", value: totalResolved, icon: "✅", color: "text-green-300" },
          { label: "Failed Runs", value: totalFailed, icon: "🔴", color: "text-red-300" },
          { label: "Projects", value: insights.length, icon: "📁", color: "text-blue-300" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <p className="text-xl">{stat.icon}</p>
            <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Resolution rate */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-300">Resolution Rate</p>
          <p className="text-sm font-bold text-violet-300">{resolveRate}%</p>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${resolveRate}%`, background: "linear-gradient(90deg, #7c3aed, #3b82f6)" }}
          />
        </div>
      </div>

      {/* Per-project breakdown */}
      {insights.length > 0 ? (
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Project Breakdown</h3>
          <div className="space-y-4">
            {insights.map(({ project, summary, frequent }) => (
              <div key={project.project_id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-300 font-medium truncate max-w-xs">
                    {project.repository_owner && project.repository_name
                      ? `${project.repository_owner}/${project.repository_name}`
                      : project.repository_url.replace("https://github.com/", "")}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-500">{summary.total_runs} runs</span>
                    <span className="text-xs text-green-400">{summary.completed_runs} ok</span>
                    {summary.failed_runs > 0 && <span className="text-xs text-red-400">{summary.failed_runs} failed</span>}
                  </div>
                </div>
                {frequent.length > 0 && (
                  <div className="space-y-1">
                    {frequent.slice(0, 3).map((f) => (
                      <div key={f.fingerprint} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="h-1 w-1 rounded-full bg-violet-400 shrink-0" />
                        <span className="truncate">{f.component ?? "Unknown component"}</span>
                        <span className="ml-auto shrink-0 text-gray-600">{f.count}×</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass rounded-xl p-8 text-center text-gray-500">
          <p className="text-3xl mb-3">🧠</p>
          <p>No data yet. Run some analyses to see insights here.</p>
        </div>
      )}
    </div>
  );
}
