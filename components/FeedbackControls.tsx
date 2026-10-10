"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
type FeedbackValue = "positive" | "negative" | null;
type Props = { runId: string | null | undefined };

export default function FeedbackControls({ runId }: Props) {
  const [feedback, setFeedback] = useState<FeedbackValue>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleFeedback(value: FeedbackValue) {
    setFeedback(value);
    if (!runId) return;
    try {
      await fetch(`${API_BASE_URL}/api/history/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ run_id: runId, helpful: value === "positive", resolution_status: value === "positive" ? "resolved" : "unresolved" }),
      });
    } finally {
      setSubmitted(true);
    }
  }

  return (
    <div className="card p-5">
      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Was this diagnosis helpful?</p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Your feedback improves future diagnoses.</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => handleFeedback("positive")}
          disabled={submitted}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border transition disabled:opacity-50"
          style={{
            background: feedback === "positive" ? "var(--success-bg)" : "var(--bg-subtle)",
            borderColor: feedback === "positive" ? "var(--success-border)" : "var(--border)",
            color: feedback === "positive" ? "var(--success)" : "var(--text-muted)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
            <path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM9.85358 5.14642C10.0488 5.34168 10.0488 5.65826 9.85358 5.85353L6.85358 8.85353C6.65832 9.04879 6.34173 9.04879 6.14647 8.85353L5.14647 7.85353C4.95121 7.65827 4.95121 7.34169 5.14647 7.14642C5.34173 6.95116 5.65832 6.95116 5.85358 7.14642L6.50003 7.79288L9.14647 5.14642C9.34173 4.95116 9.65832 4.95116 9.85358 5.14642Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
          </svg>
          Solved
        </button>
        <button
          onClick={() => handleFeedback("negative")}
          disabled={submitted}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border transition disabled:opacity-50"
          style={{
            background: feedback === "negative" ? "var(--danger-bg)" : "var(--bg-subtle)",
            borderColor: feedback === "negative" ? "var(--danger-border)" : "var(--border)",
            color: feedback === "negative" ? "var(--danger)" : "var(--text-muted)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
            <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
          </svg>
          Didn&apos;t help
        </button>
      </div>
      {submitted && (
        <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>Thanks for the feedback. It has been saved.</p>
      )}
    </div>
  );
}
