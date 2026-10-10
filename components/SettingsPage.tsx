"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // In a real app this would persist to localStorage or env
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const sections = [
    {
      title: "Backend Connection",
      items: [
        {
          label: "API Base URL",
          description: "The URL of your CommitSense backend server.",
          input: (
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 font-mono"
            />
          ),
        },
      ],
    },
    {
      title: "Analysis Defaults",
      items: [
        {
          label: "Auto-fill from CI",
          description: "Automatically fetch error logs from GitHub Actions when a repo URL is entered.",
          input: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-white/10 peer-focus:ring-2 peer-focus:ring-violet-500/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600" />
            </label>
          ),
        },
        {
          label: "Auto-fill from repo scan",
          description: "Fall back to scanning commits and issues if no CI is found.",
          input: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-white/10 peer-focus:ring-2 peer-focus:ring-violet-500/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600" />
            </label>
          ),
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          label: "Version",
          description: "CommitSense frontend version.",
          input: <span className="text-sm text-gray-500 font-mono">v1.0.0</span>,
        },
        {
          label: "Model",
          description: "LLM used for root cause analysis.",
          input: <span className="text-sm text-gray-400 font-mono">Groq / LLaMA-3</span>,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="mt-1 text-sm text-gray-400">Configure your CommitSense environment.</p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{section.title}</h3>
          </div>
          <div className="divide-y divide-white/5">
            {section.items.map((item) => (
              <div key={item.label} className="px-5 py-4 flex items-center justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-200">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </div>
                <div className="shrink-0 w-48">{item.input}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all"
        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
      >
        {saved ? "✅ Saved!" : "Save Settings"}
      </button>
    </div>
  );
}
