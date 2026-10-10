"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


// SVG Brand Shield matching CommitSense
const CommitSenseShield = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldLeftGrad" x1="12" y1="12" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="40%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
      <linearGradient id="shieldRightGrad" x1="32" y1="12" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    {/* Left Facet */}
    <path d="M32 6L14 14V32C14 44.5 22 53.5 32 58V6Z" fill="url(#shieldLeftGrad)" />
    {/* Right Facet */}
    <path d="M32 6L50 14V32C50 44.5 42 53.5 32 58V6Z" fill="url(#shieldRightGrad)" />
    {/* Subtle center line */}
    <path d="M32 6V58" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />
    {/* Center stylized notch / check cutout */}
    <path d="M32 23L41 29V39L32 46L24 40L30 34L32 36L35 33L32 30V23Z" fill="#0b071e" />
  </svg>
);

// Feature Badge icon container
function FeatureBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 group cursor-pointer">
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "rgba(124, 106, 247, 0.12)",
          border: "1px solid rgba(139, 120, 255, 0.28)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9385ff",
          transition: "all 0.25s ease",
        }}
        className="group-hover:border-[#9385ff] group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(124,106,247,0.35)]"
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(255, 255, 255, 0.65)",
          textAlign: "center",
          whiteSpace: "pre-line",
          lineHeight: 1.35,
          letterSpacing: "-0.1px",
        }}
        className="group-hover:text-white transition-colors"
      >
        {label}
      </span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"buttons" | "email">("buttons");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    const clientId = "393411435840-ld4amtsiiu8knc2d5qnpju97s8ier47p.apps.googleusercontent.com";
    const redirectUri = encodeURIComponent("http://localhost:3000/login");
    const scope = encodeURIComponent("openid email profile");
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      localStorage.setItem("cs_authed", "1");
      router.push("/");
    }
  }, [router]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in both email and password.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    localStorage.setItem("cs_authed", "1");
    router.push("/");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060410",
        position: "relative",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── Atmospheric space gradients & nebulae ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 18%, rgba(88, 70, 230, 0.16) 0%, transparent 45%), radial-gradient(circle at 75% 35%, rgba(139, 92, 246, 0.18) 0%, transparent 40%), radial-gradient(circle at 85% 70%, rgba(99, 102, 241, 0.12) 0%, transparent 45%), linear-gradient(180deg, #060410 0%, #0c0822 50%, #070412 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Floating stars */}
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: i % 4 === 0 ? 2 : 1,
            height: i % 4 === 0 ? 2 : 1,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.75)",
            top: `${(i * 29) % 95}%`,
            left: `${(i * 47) % 98}%`,
            opacity: 0.3 + (i % 6) * 0.1,
            boxShadow: i % 5 === 0 ? "0 0 6px rgba(255, 255, 255, 0.8)" : "none",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      {/* ── Top Navbar ── */}
      <header
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 48px",
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <CommitSenseShield size={32} />
          <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.4px" }}>
            CommitSense
        <div className="flex items-center gap-8">
          <a
            href="#features"
            style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)")}
          >
            Features
          </a>
          <a
            href="#docs"
            style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)")}
          >
            Docs
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)")}
          >
            GitHub
          </a>

          {/* Sun / Theme toggle icon */}
          <button
            aria-label="Theme toggle"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255, 255, 255, 0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              transition: "transform 0.3s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "rotate(45deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.75)";
              e.currentTarget.style.transform = "rotate(0deg)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Main Two-Column Layout ── */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 48px 30px",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 40,
        }}
        className="flex-col lg:flex-row"
      >
        {/* ── Left Hero Side ── */}
        <section
          style={{
            flex: "1 1 55%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingTop: 10,
            maxWidth: 680,
            width: "100%",
          }}
        >
          {/* Hero Headlines */}
          <h1
            style={{
              fontSize: "clamp(38px, 4.4vw, 54px)",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-1.2px",
              margin: 0,
            }}
          >
            <span style={{ color: "#ffffff", display: "block" }}>Safer Changes.</span>
            <span
              style={{
                background: "linear-gradient(90deg, #7c6af7 0%, #9078ff 35%, #4facfe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              Smarter Development.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              marginTop: 18,
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.62)",
              lineHeight: 1.6,
              maxWidth: 480,
              fontWeight: 400,
            }}
          >
            AI-powered insights to help you understand, debug, and safely modify any software project.
          </p>

          {/* 4 Feature Badges row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 16,
              maxWidth: 520,
              marginTop: 36,
              marginBottom: 24,
            }}
          >
            {/* 1: Analyze Repositories */}
            <FeatureBadge
              label={"Analyze\nRepositories"}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              }
            />

            {/* 2: Debug Faster */}
            <FeatureBadge
              label={"Debug\nFaster"}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="8" height="14" x="8" y="6" rx="4" />
                  <path d="m19 7-3 2" />
                  <path d="m5 7 3 2" />
                  <path d="m19 19-3-2" />
                  <path d="m5 19 3-2" />
                  <path d="M20 13h-4" />
                  <path d="M4 13h4" />
                  <path d="m10 4 1 2" />
                  <path d="m14 4-1 2" />
                </svg>
              }
            />

            {/* 3: Understand Code */}
            <FeatureBadge
              label={"Understand\nCode"}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" x2="6" y1="3" y2="15" />
                  <circle cx="18" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <path d="M18 9a9 9 0 0 1-9 9" />
                </svg>
              }
            />

            {/* 4: Predict Change Impact */}
            <FeatureBadge
              label={"Predict\nChange Impact"}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              }
            />
          </div>

          {/* ── 3D Scene Mockup (Laptop + Floating AI & Impact Cards + Neon trails + Rocks) ── */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 620,
              marginTop: 10,
              userSelect: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <Image
                src="/hero-scene.png"
                alt="CommitSense Analysis Dashboard"
                width={620}
                height={291}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.9))",
                }}
              />
            </div>
          </div>
        </section>

        {/* ── Right Column: Sign-in Glassmorphism Card ── */}
        <section
          style={{
            flex: "1 1 42%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            position: "relative",
          }}
        >
          {/* Subtle violet ambient glow behind the card */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 480,
              height: 480,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124, 106, 247, 0.22) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 75%)",
              filter: "blur(50px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Glass Card */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              maxWidth: 440,
              borderRadius: 24,
              border: "1px solid rgba(139, 120, 255, 0.22)",
              background: "rgba(16, 12, 38, 0.72)",
              backdropFilter: "blur(40px) saturate(190%)",
              WebkitBackdropFilter: "blur(40px) saturate(190%)",
              boxShadow:
                "0 30px 90px rgba(0, 0, 0, 0.75), 0 0 50px rgba(124, 106, 247, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
              padding: "44px 38px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Shield Logo */}
            <div style={{ marginBottom: 12 }}>
              <CommitSenseShield size={46} />
            </div>

            {/* Brand Title */}
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.4px",
                margin: 0,
              }}
            >
              CommitSense

            {/* Subtitle */}
            <p
              style={{
                fontSize: 13.5,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                lineHeight: 1.5,
                marginTop: 8,
                marginBottom: 32,
              }}
            >
              Sign in to start analyzing repositories<br />
              and making safer changes.
            </p>

            {mode === "buttons" ? (
              <div style={{ width: "100%" }}>
                {/* Continue with Google */}
                <button
                  onClick={handleGoogleLogin}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 20px",
                    borderRadius: 14,
                    background: "#ffffff",
                    border: "none",
                    color: "#0a0815",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f4f6"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span>Continue with Google</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                {/* Divider: OR */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "20px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255, 255, 255, 0.1)" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255, 255, 255, 0.35)", letterSpacing: "0.08em" }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255, 255, 255, 0.1)" }} />
                </div>

                {/* Continue with Email */}
                <button
                  onClick={() => setMode("email")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "13px 20px",
                    borderRadius: 14,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#ffffff",
                    fontSize: 14.5,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.09)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.22)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                  }}
                >
                  {/* Mail Icon */}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>Continue with Email</span>
                </button>
              </div>
            ) : (
              /* Email / Password Form View */
              <div style={{ width: "100%" }}>
                {/* Back button */}
                <button
                  onClick={() => setMode("buttons")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: 12.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 18,
                    padding: 0,
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Back to sign-in options
                </button>

                <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 12,
                        padding: "12px 14px",
                        fontSize: 14,
                        color: "#ffffff",
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7c6af7")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")}
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 12,
                        padding: "12px 14px",
                        fontSize: 14,
                        color: "#ffffff",
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7c6af7")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")}
                      autoComplete="current-password"
                    />
                  </div>

                  {error && (
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "#f87171",
                        background: "rgba(248, 113, 113, 0.1)",
                        border: "1px solid rgba(248, 113, 113, 0.25)",
                        borderRadius: 10,
                        padding: "10px 12px",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #7c6af7 0%, #4a3de0 100%)",
                      border: "none",
                      color: "#ffffff",
                      fontSize: 14.5,
                      fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.75 : 1,
                      marginTop: 6,
                      boxShadow: "0 4px 20px rgba(124, 106, 247, 0.35)",
                      transition: "opacity 0.2s ease, transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>

                  <div style={{ textAlign: "center", marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ email: "demo@changeguard.ai", password: "demo" });
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#a89cf8",
                        fontSize: 11.5,
                        textDecoration: "underline",
                        padding: 0,
                      }}
                    >
                      Fill demo account
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Terms of Service & Privacy Policy */}
            <p
              style={{
                fontSize: 11.5,
                color: "rgba(255, 255, 255, 0.38)",
                textAlign: "center",
                marginTop: 26,
                lineHeight: 1.6,
              }}
            >
              By continuing, you agree to our{" "}
              <a
                href="#terms"
                style={{
                  color: "#9d8dfc",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "text-decoration 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                Terms of Service
              </a>
              <br />
              and{" "}
              <a
                href="#privacy"
                style={{
                  color: "#9d8dfc",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "text-decoration 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
