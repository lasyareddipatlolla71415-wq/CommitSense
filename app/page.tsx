"use client";

import { useState } from "react";
import RepositoryInput from "@/components/RepositoryInput";
import ErrorInput from "@/components/ErrorInput";
import AnalysisPanel from "@/components/AnalysisPanel";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import type { AnalysisResult } from "@/types/analysis";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const featureCards = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.0749 12.975 13.8623 12.975 13.5999C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
      </svg>
    ),
    title: "Root Cause AI",
    desc: "LLM-powered diagnosis pinpoints the exact commit and line that caused your failure.",
    color: "var(--accent)",
    colorBg: "var(--accent-subtle)",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 0.875C3.83152 0.875 0.875 3.83152 0.875 7.5C0.875 11.1685 3.83152 14.125 7.5 14.125C11.1685 14.125 14.125 11.1685 14.125 7.5C14.125 3.83152 11.1685 0.875 7.5 0.875ZM1.825 7.5C1.825 4.35648 4.35648 1.825 7.5 1.825C10.6435 1.825 13.175 4.35648 13.175 7.5C13.175 10.6435 10.6435 13.175 7.5 13.175C4.35648 13.175 1.825 10.6435 1.825 7.5ZM7.5 4C7.22386 4 7 4.22386 7 4.5V7.5C7 7.63261 7.05268 7.75979 7.14645 7.85355L9.14645 9.85355C9.34171 10.0488 9.65829 10.0488 9.85355 9.85355C10.0488 9.65829 10.0488 9.34171 9.85355 9.14645L8 7.29289V4.5C8 4.22386 7.77614 4 7.5 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
      </svg>
    ),
    title: "Historical Context",
    desc: "Cross-references past failures and regressions to surface recurring patterns.",
    color: "#4ade80",
    colorBg: "var(--success-bg)",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 15 15" fill="none">
        <path d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608765L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9798 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02018 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48611L8.01921 8.48701C8.00848 8.766 7.7792 8.98664 7.5 8.98664C7.2208 8.98664 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
      </svg>
    ),
    title: "Regression Detection",
    desc: "Automatically flags commits that reintroduce previously fixed bugs.",
    color: "#f87171",
    colorBg: "var(--danger-bg)",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 15 15" fill="none">
        <path d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H8.5C8.22386 6 8 5.77614 8 5.5V2H3.5ZM9 2.70711L11.2929 5H9V2.70711ZM2 2.5C2 1.67157 2.67157 1 3.5 1H8.5C8.63261 1 8.75979 1.05268 8.85355 1.14645L12.8536 5.14645C12.9473 5.24021 13 5.36739 13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5ZM4.75 7.5C4.75 7.22386 4.97386 7 5.25 7H9.75C10.0261 7 10.25 7.22386 10.25 7.5C10.25 7.77614 10.0261 8 9.75 8H5.25C4.97386 8 4.75 7.77614 4.75 7.5ZM4.75 9.5C4.75 9.22386 4.97386 9 5.25 9H9.75C10.0261 9 10.25 9.22386 10.25 9.5C10.25 9.77614 10.0261 10 9.75 10H5.25C4.97386 10 4.75 9.77614 4.75 9.5ZM4.75 11.5C4.75 11.2239 4.97386 11 5.25 11H7.75C8.02614 11 8.25 11.2239 8.25 11.5C8.25 11.7761 8.02614 12 7.75 12H5.25C4.97386 12 4.75 11.7761 4.75 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
      </svg>
    ),
    title: "CI/CD Integration",
    desc: "Auto-fetches logs from GitHub Actions, CircleCI, and Jenkins pipelines.",
    color: "#60a5fa",
    colorBg: "var(--info-bg)",
  },
];

const quickTasks = [
  "Explain this stack trace",
  "Find the breaking commit",
  "Suggest a fix",
  "Check for regressions",
  "Summarize recent failures",
];

const stats = [
  { label: "Analyses Run", value: "12,400+" },
  { label: "Avg. Fix Time", value: "4.2 min" },
  { label: "Accuracy", value: "98.6%" },
];

export default function Home() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [errorText, setErrorText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoFilled, setAutoFilled] = useState(false);
  const [autoSource, setAutoSource] = useState<"ci" | "scan" | null>(null);

  function handleAutoError(err: string, source: "ci" | "scan" = "ci") {
    setErrorText(err); setAutoFilled(true); setAutoSource(source);
  }
  function handleErrorChange(val: string) {
    setErrorText(val); setAutoFilled(false); setAutoSource(null);
  }

  async function handleAnalyze() {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze/repository`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repository_url: repositoryUrl, error_text: errorText }),
      });
      if (!res.ok) {
        let msg = "Analysis request failed";
        try { const b = await res.json(); if (typeof b.detail === "string") msg = b.detail; } catch { /**/ }
        throw new Error(msg);
      }
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setRepositoryUrl(""); setErrorText(""); setResult(null);
    setError(null); setAutoFilled(false); setAutoSource(null);
  }

  const canAnalyze = !loading && !!repositoryUrl && !!errorText;

  return (
    <main style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <div className="flex gap-0" style={{ minHeight: "calc(100vh - 56px)" }}>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 px-5 py-7 sm:px-8">

          {/* Hero */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight" style={{ letterSpacing: "-0.5px" }}>
                <span style={{ color: "var(--accent)" }}>Analyze.</span>{" "}
                <span style={{ color: "var(--text)" }}>Debug.</span>{" "}
                <span style={{ color: "var(--text)" }}>Fix</span>{" "}
                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>with Confidence.</span>
              </h1>
              <p className="mt-2 text-sm" style={{ color: "var(--text-muted)", maxWidth: 480 }}>
                AI-powered root cause analysis to help you explore, fix, and safely modify any software project.
              </p>
            </div>
            {/* Stats row */}
            <div className="flex gap-3 shrink-0">
              {stats.map((s) => (
                <div key={s.label} className="card px-4 py-2.5 text-center" style={{ minWidth: 80 }}>
                  <div className="text-base font-bold" style={{ color: "var(--accent)" }}>{s.value}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--text-faint)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            {featureCards.map((f) => (
              <div key={f.title} className="card card-hover p-4 cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg mb-3" style={{ background: f.colorBg, color: f.color }}>
                  {f.icon}
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>{f.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Input card */}
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Repository Analysis
              </span>
            </div>
            <RepositoryInput value={repositoryUrl} onChange={setRepositoryUrl} onAutoError={handleAutoError} />
            <hr className="divider" />
            <ErrorInput value={errorText} onChange={handleErrorChange} autoFilled={autoFilled} autoSource={autoSource} />
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                      <path d="M7.5 1.5C4.18629 1.5 1.5 4.18629 1.5 7.5C1.5 10.8137 4.18629 13.5 7.5 13.5C10.8137 13.5 13.5 10.8137 13.5 7.5C13.5 4.18629 10.8137 1.5 7.5 1.5ZM0.5 7.5C0.5 3.63401 3.63401 0.5 7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5C14.5 11.366 11.366 14.5 7.5 14.5C3.63401 14.5 0.5 11.366 0.5 7.5ZM7.5 4C7.77614 4 8 4.22386 8 4.5V7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H8V10.5C8 10.7761 7.77614 11 7.5 11C7.22386 11 7 10.7761 7 10.5V8H4.5C4.22386 8 4 7.77614 4 7.5C4 7.22386 4.22386 7 4.5 7H7V4.5C7 4.22386 7.22386 4 7.5 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                    Run Analysis
                  </>
                )}
              </button>
              <button onClick={handleReset} disabled={loading} className="btn-secondary px-5 py-2.5">Clear</button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg p-4 fade-in" style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-border)" }}>
              <div className="flex items-start gap-3">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="mt-0.5 shrink-0" style={{ color: "var(--danger)" }}>
                  <path d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608765L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9798 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02018 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48611L8.01921 8.48701C8.00848 8.766 7.7792 8.98664 7.5 8.98664C7.2208 8.98664 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--danger)" }}>Analysis failed</p>
                  <p className="mt-0.5 text-sm" style={{ color: "var(--text-muted)" }}>{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && <div className="mt-5"><LoadingAnalysis /></div>}
          {result && <div className="mt-6 fade-in"><AnalysisPanel result={result} /></div>}
        </div>



      </div>
    </main>
  );
}
