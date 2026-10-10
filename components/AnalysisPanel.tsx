import type { AnalysisResult } from "@/types/analysis";
import DependencyGraph from "@/components/DependencyGraph";
import FeedbackControls from "@/components/FeedbackControls";
import HistoryPanel from "@/components/HistoryPanel";
import RunHistory from "@/components/RunHistory";

type Props = { result: AnalysisResult };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-faint)" }}>{title}</p>
      {children}
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <Section title={title}>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text)" }}>
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export default function AnalysisPanel({ result }: Props) {
  const confidence = Math.round(result.confidence * 100);
  const graphConf = Math.round(result.graph_confidence * 100);

  return (
    <div className="space-y-4">
      {/* Root cause */}
      <Section title="Root Cause">
        <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text)" }}>{result.root_cause}</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: "var(--text-faint)" }}>Confidence</span>
              <span className="text-xs font-semibold" style={{ color: "var(--accent-text)" }}>{confidence}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${confidence}%` }} />
            </div>
          </div>
          {result.commit_sha && (
            <span className="badge badge-neutral font-mono">{result.commit_sha.slice(0, 8)}</span>
          )}
        </div>
      </Section>

      {/* Affected component */}
      <Section title="Affected Component">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Component", value: result.affected_node ?? "Unknown" },
            { label: "Technology", value: result.affected_technology ?? "Unknown" },
            { label: "Graph Confidence", value: `${graphConf}%` },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg p-3"
              style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
            >
              <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-faint)" }}>{item.label}</p>
              <p className="mt-1.5 text-sm font-semibold" style={{ color: "var(--text)" }}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <span className="badge badge-danger">Suspected</span>
        </div>
      </Section>

      {/* Explanation */}
      <Section title="Explanation">
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{result.explanation}</p>
      </Section>

      {/* Dependency graph */}
      <Section title="Dependency Graph">
        <p className="text-xs mb-3" style={{ color: "var(--text-faint)" }}>
          Highlighted node indicates the component most closely associated with the error.
        </p>
        <div className="flex items-center gap-4 mb-3">
          {[
            { label: "Service", cls: "badge-neutral" },
            { label: "Suspected component", cls: "badge-danger" },
          ].map((l) => <span key={l.label} className={`badge ${l.cls}`}>{l.label}</span>)}
        </div>
        {result.graph.nodes.length > 0 ? (
          <DependencyGraph graph={result.graph} affectedNode={result.affected_node} />
        ) : (
          <div
            className="rounded-lg p-5 text-sm text-center"
            style={{ background: "var(--bg-subtle)", color: "var(--text-faint)" }}
          >
            No dependency graph could be inferred from this repository.
          </div>
        )}
      </Section>

      <HistoryPanel matches={result.historical_matches ?? []} comparison={result.historical_comparison ?? null} />
      <ListSection title="Evidence" items={result.evidence} />
      <ListSection title="Recommended Fixes" items={result.recommended_fixes} />
      <ListSection title="Verification Steps" items={result.verification_steps} />

      {result.project_id && (
        <Section title="Run History">
          <RunHistory projectId={result.project_id} />
        </Section>
      )}

      <FeedbackControls runId={result.run_id} />
    </div>
  );
}
