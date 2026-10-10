"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar, { type Page } from "@/components/Sidebar";
import HistoryPage from "@/components/HistoryPage";
import RegressionsPage from "@/components/RegressionsPage";
import InsightsPage from "@/components/InsightsPage";
import SettingsPage from "@/components/SettingsPage";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<Page>("analyze");

  useEffect(() => {
    if (pathname !== "/login" && !localStorage.getItem("cs_authed")) {
      router.replace("/login");
    }
  }, [pathname, router]);

  if (pathname === "/login") return <>{children}</>;

  function handleNavigate(page: Page) {
    setActivePage(page);
    if (typeof window !== "undefined" && window.innerWidth < 640) setSidebarOpen(false);
  }

  const pages: Record<Exclude<Page, "analyze">, React.ReactNode> = {
    history: <HistoryPage />,
    regressions: <RegressionsPage />,
    insights: <InsightsPage />,
    settings: <SettingsPage />,
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} sidebarOpen={sidebarOpen} />
      <Sidebar open={sidebarOpen} activePage={activePage} onNavigate={handleNavigate} />
      <div
        className={`transition-all duration-300 pt-14 ${sidebarOpen ? "sm:pl-56" : "sm:pl-14"}`}
        style={{ minHeight: "100vh", background: "var(--bg)" }}
      >
        {activePage === "analyze" ? (
          children
        ) : (
          <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
              {pages[activePage]}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
