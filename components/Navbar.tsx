"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Props = {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
};

export default function Navbar({ onToggleSidebar, sidebarOpen }: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    localStorage.removeItem("cs_authed");
    router.push("/login");
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-3"
      style={{
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* Hamburger */}
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        style={{ color: "var(--text-muted)", background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:opacity-80"
      >
        {sidebarOpen ? (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
          </svg>
        )}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
            <path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.22389 4 7.00003 4.22386 7.00003 4.5V7H4.50003C4.22389 7 4.00003 7.22386 4.00003 7.5C4.00003 7.77614 4.22389 8 4.50003 8H7.00003V10.5C7.00003 10.7761 7.22389 11 7.50003 11C7.77617 11 8.00003 10.7761 8.00003 10.5V8H10.5C10.7762 8 11 7.77614 11 7.5C11 7.22386 10.7762 7 10.5 7H8.00003V4.5C8.00003 4.22386 7.77617 4 7.50003 4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
          </svg>
        </div>
        <span className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--text)" }}>
          CommitSense
        </span>
        <span
          className="hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ background: "var(--accent-subtle)", color: "var(--accent-text)", border: "1px solid var(--accent)" }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
          />
          Beta
        </span>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* GitHub link */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
          style={{ color: "var(--text-muted)", background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
        >
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
            <path d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.31082 13.4206 5.18867 14.3797C5.54257 14.446 5.67502 14.2235 5.67502 14.0311C5.67502 13.8586 5.66888 13.3851 5.66578 12.7644C3.67666 13.1947 3.25959 11.8023 3.25959 11.8023C2.93946 10.9695 2.46979 10.7482 2.46979 10.7482C1.82466 10.3071 2.51628 10.3155 2.51628 10.3155C3.22353 10.3659 3.59486 11.0512 3.59486 11.0512C4.22851 12.1445 5.27822 11.8279 5.68922 11.6416C5.75469 11.1799 5.93729 10.8638 6.13882 10.6863C4.52421 10.5066 2.82716 9.87348 2.82716 7.1716C2.82716 6.38289 3.10263 5.73988 3.60937 5.23314C3.53514 5.05361 3.29319 4.32052 3.67987 3.33219C3.67987 3.33219 4.27585 3.14085 5.65756 4.06965C6.26951 3.91282 6.90029 3.83419 7.52838 3.83128C8.15647 3.83419 8.78725 3.91282 9.3992 4.06965C10.7809 3.14085 11.3769 3.33219 11.3769 3.33219C11.7636 4.32052 11.5216 5.05361 11.4474 5.23314C11.9541 5.73988 12.2296 6.38289 12.2296 7.1716C12.2296 9.87957 10.5301 10.5043 8.91172 10.6798C9.16488 10.8981 9.39042 11.3296 9.39042 11.9921C9.39042 12.9416 9.38125 13.7097 9.38125 13.9477C9.38125 14.1418 9.51154 14.3664 9.87077 14.2942C12.7444 13.3316 14.75 10.6172 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
          </svg>
          GitHub
        </a>

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:opacity-80"
            style={{ color: "var(--text-muted)", background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
          >
            {theme === "dark" ? (
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.9038 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0.5 7C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H2.5C2.77614 8 3 7.77614 3 7.5C3 7.22386 2.77614 7 2.5 7H0.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.9038 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM12.5 7C12.2239 7 12 7.22386 12 7.5C12 7.77614 12.2239 8 12.5 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12.5ZM10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.9038L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802ZM7 12.5C7 12.2239 7.22386 12 7.5 12C7.77614 12 8 12.2239 8 12.5V14.5C8 14.7761 7.77614 15 7.5 15C7.22386 15 7 14.7761 7 14.5V12.5ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path d="M2.89998 0.499976C2.89998 0.279062 2.72089 0.0999756 2.49998 0.0999756C2.27906 0.0999756 2.09998 0.279062 2.09998 0.499976V1.09998H1.49998C1.27906 1.09998 1.09998 1.27906 1.09998 1.49998C1.09998 1.72089 1.27906 1.89998 1.49998 1.89998H2.09998V2.49998C2.09998 2.72089 2.27906 2.89998 2.49998 2.89998C2.72089 2.89998 2.89998 2.72089 2.89998 2.49998V1.89998H3.49998C3.72089 1.89998 3.89998 1.72089 3.89998 1.49998C3.89998 1.27906 3.72089 1.09998 3.49998 1.09998H2.89998V0.499976ZM5.25 3C5.25 2.58579 5.58579 2.25 6 2.25C6.41421 2.25 6.75 2.58579 6.75 3C6.75 3.41421 6.41421 3.75 6 3.75C5.58579 3.75 5.25 3.41421 5.25 3ZM7.49998 3.5C7.49998 3.22386 7.72384 3 7.99998 3C8.27612 3 8.49998 3.22386 8.49998 3.5C8.49998 3.77614 8.27612 4 7.99998 4C7.72384 4 7.49998 3.77614 7.49998 3.5ZM6.00003 6.5C3.51472 6.5 1.50003 8.51469 1.50003 11C1.50003 13.4853 3.51472 15.5 6.00003 15.5C8.48534 15.5 10.5 13.4853 10.5 11C10.5 8.51469 8.48534 6.5 6.00003 6.5ZM2.50003 11C2.50003 9.067 4.06703 7.5 6.00003 7.5C7.93303 7.5 9.50003 9.067 9.50003 11C9.50003 12.933 7.93303 14.5 6.00003 14.5C4.06703 14.5 2.50003 12.933 2.50003 11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        )}

        {/* Avatar + dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white transition hover:opacity-80"
            style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}
          >
            U
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute", right: 0, top: "calc(100% + 8px)",
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 10, boxShadow: "var(--shadow-md)", minWidth: 160,
                zIndex: 100, overflow: "hidden",
              }}
            >
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>Demo User</p>
                <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 1 }}>demo@commitsense.ai</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full transition hover:opacity-80"
                style={{ padding: "9px 14px", background: "none", border: "none", cursor: "pointer", color: "var(--danger)", fontSize: 13, fontWeight: 500 }}
              >
                <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                  <path d="M3 1C2.44772 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H7.5C7.77614 14 8 13.7761 8 13.5C8 13.2239 7.77614 13 7.5 13H3V2H7.5C7.77614 2 8 1.77614 8 1.5C8 1.22386 7.77614 1 7.5 1H3ZM11.8536 7.85355C12.0488 7.65829 12.0488 7.34171 11.8536 7.14645L9.85355 5.14645C9.65829 4.95118 9.34171 4.95118 9.14645 5.14645C8.95118 5.34171 8.95118 5.65829 9.14645 5.85355L10.2929 7H5.5C5.22386 7 5 7.22386 5 7.5C5 7.77614 5.22386 8 5.5 8H10.2929L9.14645 9.14645C8.95118 9.34171 8.95118 9.65829 9.14645 9.85355C9.34171 10.0488 9.65829 10.0488 9.85355 9.85355L11.8536 7.85355Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
