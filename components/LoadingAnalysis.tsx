export default function LoadingAnalysis() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--accent-subtle)" }}
        >
          <span
            className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
          />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Analyzing repository</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Inspecting context and generating a grounded diagnosis...
          </p>
        </div>
      </div>
      <div className="progress-bar mt-4">
        <div className="progress-fill animate-pulse" style={{ width: "40%" }} />
      </div>
    </div>
  );
}
