"use client";

import { useState, useEffect, useRef } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type CIRun = { name: string; conclusion: string | null; branch: string; commit_sha: string; html_url: string };
type Props = { value: string; onChange: (v: string) => void; onAutoError: (e: string, s: "ci" | "scan") => void };

export default function RepositoryInput({ value, onChange, onAutoError }: Props) {
  const [fetching, setFetching] = useState(false);
  const [ciRuns, setCiRuns] = useState<CIRun[]>([]);
  const [ciMessage, setCiMessage] = useState("");
  const [ciMessageType, setCiMessageType] = useState<"ok" | "warn" | "info">("info");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function normalize(url: string) { return url.trim().replace(/\.git$/, "").replace(/\/$/, ""); }

  useEffect(() => {
    const normalized = normalize(value);
    if (!normalized || !normalized.includes("github.com")) { setCiRuns([]); setCiMessage(""); return; }
    if (value !== normalized && value.endsWith(".git")) { onChange(normalized); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setFetching(true); setCiMessage("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/history/ci-failures?repository_url=${encodeURIComponent(normalized)}`);
        if (!res.ok) { setCiMessage("Could not reach backend."); setCiMessageType("warn"); setFetching(false); return; }
        const data = await res.json();
        setCiRuns(data.recent_runs || []);
        if (data.auto_error && data.ci_available) {
          onAutoError(data.auto_error, "ci");
          setCiMessage(`Auto-filled from CI failure on branch "${data.latest_failure?.branch}"`);
          setCiMessageType("ok");
        } else if (data.auto_error && !data.ci_available) {
          onAutoError(data.auto_error, "scan");
          setCiMessage("No CI found — auto-filled from repo scan");
          setCiMessageType("ok");
        } else if (data.ci_available) {
          setCiMessage("No recent CI failures. Paste your error manually.");
          setCiMessageType("info");
        } else {
          setCiMessage("No GitHub Actions found. Paste your error manually.");
          setCiMessageType("info");
        }
      } catch {
        setCiMessage("Could not fetch CI data. Is backend running?"); setCiMessageType("warn");
      } finally { setFetching(false); }
    }, 800);
  }, [value]);

  const msgColor = ciMessageType === "ok" ? "var(--success)" : ciMessageType === "warn" ? "var(--warn)" : "var(--text-faint)";

  const conclusionBadge = (c: string | null) => {
    if (c === "success") return "badge-success";
    if (c === "failure") return "badge-danger";
    return "badge-neutral";
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text)" }}>
        <span
          className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold"
          style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}
        >1</span>
        GitHub Repository URL
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center" style={{ color: "var(--text-faint)" }}>
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
            <path d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.31082 13.4206 5.18867 14.3797C5.54257 14.446 5.67502 14.2235 5.67502 14.0311C5.67502 13.8586 5.66888 13.3851 5.66578 12.7644C3.67666 13.1947 3.25959 11.8023 3.25959 11.8023C2.93946 10.9695 2.46979 10.7482 2.46979 10.7482C1.82466 10.3071 2.51628 10.3155 2.51628 10.3155C3.22353 10.3659 3.59486 11.0512 3.59486 11.0512C4.22851 12.1445 5.27822 11.8279 5.68922 11.6416C5.75469 11.1799 5.93729 10.8638 6.13882 10.6863C4.52421 10.5066 2.82716 9.87348 2.82716 7.1716C2.82716 6.38289 3.10263 5.73988 3.60937 5.23314C3.53514 5.05361 3.29319 4.32052 3.67987 3.33219C3.67987 3.33219 4.27585 3.14085 5.65756 4.06965C6.26951 3.91282 6.90029 3.83419 7.52838 3.83128C8.15647 3.83419 8.78725 3.91282 9.3992 4.06965C10.7809 3.14085 11.3769 3.33219 11.3769 3.33219C11.7636 4.32052 11.5216 5.05361 11.4474 5.23314C11.9541 5.73988 12.2296 6.38289 12.2296 7.1716C12.2296 9.87957 10.5301 10.5043 8.91172 10.6798C9.16488 10.8981 9.39042 11.3296 9.39042 11.9921C9.39042 12.9416 9.38125 13.7097 9.38125 13.9477C9.38125 14.1418 9.51154 14.3664 9.87077 14.2942C12.7444 13.3316 14.75 10.6172 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://github.com/owner/repository"
          className="input pl-9 pr-9"
        />
        {fetching && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
          </div>
        )}
      </div>

      {!fetching && ciMessage && (
        <p className="text-xs flex items-center gap-1.5" style={{ color: msgColor }}>
          <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: msgColor }} />
          {ciMessage}
        </p>
      )}
      {fetching && (
        <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-faint)" }}>
          <span className="h-1.5 w-1.5 rounded-full shrink-0 animate-pulse" style={{ background: "var(--accent)" }} />
          Scanning repository...
        </p>
      )}

      {!fetching && ciRuns.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>Recent CI Runs</p>
          {ciRuns.slice(0, 4).map((run, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-3 py-2"
              style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
            >
              <span className={`badge ${conclusionBadge(run.conclusion)}`}>{run.conclusion || "running"}</span>
              <span className="text-xs flex-1 truncate" style={{ color: "var(--text)" }}>{run.name}</span>
              <span className="text-xs shrink-0" style={{ color: "var(--text-faint)" }}>{run.branch}</span>
              <a href={run.html_url} target="_blank" rel="noreferrer" className="text-xs shrink-0" style={{ color: "var(--accent)" }}>
                <svg width="11" height="11" viewBox="0 0 15 15" fill="none">
                  <path d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
