type Props = {
  value: string;
  onChange: (v: string) => void;
  autoFilled?: boolean;
  autoSource?: "ci" | "scan" | null;
};

export default function ErrorInput({ value, onChange, autoFilled, autoSource }: Props) {
  const badge = autoFilled
    ? autoSource === "scan"
      ? { label: "Auto-filled from repo scan", cls: "badge-info" }
      : { label: "Auto-filled from CI", cls: "badge-success" }
    : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text)" }}>
          <span
            className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold"
            style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}
          >2</span>
          Error or Stack Trace
        </label>
        {badge && <span className={`badge ${badge.cls}`}>{badge.label}</span>}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your error log, stack trace, or exception here..."
        rows={8}
        className="input font-mono text-xs leading-relaxed resize-y"
        style={{
          borderColor: autoFilled
            ? autoSource === "scan" ? "var(--info)" : "var(--success)"
            : undefined,
        }}
      />
      <p className="text-xs" style={{ color: "var(--text-faint)" }}>
        Auto-filled from CI failures or repo scan. You can edit or replace it.
      </p>
    </div>
  );
}
