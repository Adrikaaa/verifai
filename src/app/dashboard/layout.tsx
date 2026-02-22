"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
});

/* ── Vercel-style Nav Tabs ── */
const navTabs = [
  { label: "Overview", href: "/dashboard" },
  { label: "My Scans", href: "/dashboard/scans" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "Extension", href: "/dashboard/extension" },
  { label: "API Access", href: "/dashboard/api" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        /* ── Fixed background ── */
        body, html {
          background: #000;
        }

        /* ── Reset for dashboard ── */
        .vercel-dash {
          min-height: 100vh;
          color: #f0f0f5;
          font-family: var(--font-geist-sans, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
          -webkit-font-smoothing: antialiased;
          position: relative;
          z-index: 5;
        }

        /* ── Top bar ── */
        .vercel-topbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          border-bottom: 1px solid #1a1a1a;
        }

        .vercel-topbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 64px;
        }

        .vercel-logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .vercel-logo-area span {
          font-size: 14px;
          font-weight: 500;
          color: #f0f0f5;
        }

        .vercel-topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vercel-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          border: 1px solid #1a1a1a;
          background: transparent;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .vercel-icon-btn:hover {
          border-color: #333;
          color: #f0f0f5;
          background: #111;
        }

        .vercel-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #5227FF, #3653E1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
        }

        /* ── Tab nav bar ── */
        .vercel-tabs-bar {
          background: #000;
          border-bottom: 1px solid #1a1a1a;
          position: relative;
          z-index: 100;
        }

        .vercel-tabs-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: stretch;
          gap: 0;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .vercel-tabs-inner::-webkit-scrollbar {
          display: none;
        }

        .vercel-tab {
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 400;
          color: #5c5f73;
          text-decoration: none;
          white-space: nowrap;
          position: relative;
          transition: color 0.15s ease;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .vercel-tab:hover {
          color: #f0f0f5;
        }

        .vercel-tab-active {
          color: #f0f0f5;
          font-weight: 500;
          border-bottom-color: #f0f0f5;
        }

        /* ── Hamburger menu for mobile ── */
        .vercel-hamburger {
          display: none;
          background: none;
          border: none;
          color: #f0f0f5;
          cursor: pointer;
          padding: 4px;
        }

        /* ── Main content ── */
        .vercel-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
          min-height: calc(100vh - 120px);
          position: relative;
          z-index: 10;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .vercel-topbar-inner {
            padding: 0 16px;
          }

          .vercel-tabs-inner {
            padding: 0 16px;
          }

          .vercel-content {
            padding: 24px 16px;
          }

          .vercel-hamburger {
            display: flex;
          }

          .vercel-tabs-bar.desktop-only {
            display: none;
          }
        }
      `}</style>

      {/* 🔹 Fixed Antigravity background - Outside main container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 1,
        }}
      >
        <Antigravity
          count={200}
          magnetRadius={3}
          ringRadius={3}
          waveSpeed={0.1}
          waveAmplitude={0.5}
          particleSize={0.75}
          lerpSpeed={0.02}
          color="#A855F7"
          autoAnimate
          particleVariance={0.6}
          rotationSpeed={0.05}
          depthFactor={1}
          pulseSpeed={1.2}
          particleShape="capsule"
          fieldStrength={5}
          followMouse={true}
          mouseStrength={0.8}
          motionIntensity={0.6}
        />
      </div>

      <div className="vercel-dash" style={{ position: "relative" }}>
        {/* ── Content wrapper - No Antigravity here ── */}

        {/* ── Top bar ── */}
        <div className="vercel-topbar">
          <div className="vercel-topbar-inner">
            {/* Left: Logo + Project name */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/" className="vercel-logo-area">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    background: "linear-gradient(135deg, #4169E1, #5227FF)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
              </Link>

              {/* Breadcrumb separator */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ color: "#333" }}
              >
                <path
                  d="M5.5 2L10.5 8L5.5 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span
                style={{ fontSize: "14px", fontWeight: 500, color: "#f0f0f5" }}
              >
                Adrika&apos;s Projects
              </span>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#8b8fa3",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  border: "1px solid #333",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                Pro
              </span>
            </div>

            {/* Right: Search + Actions */}
            <div className="vercel-topbar-right">
              {/* Search shortcut */}
              <button
                className="vercel-icon-btn"
                style={{
                  width: "auto",
                  padding: "0 12px",
                  gap: "6px",
                  fontSize: "13px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="hidden sm:inline" style={{ color: "#5c5f73" }}>
                  Search...
                </span>
                <span
                  className="hidden sm:inline"
                  style={{
                    fontSize: "11px",
                    color: "#555",
                    border: "1px solid #333",
                    borderRadius: "4px",
                    padding: "1px 5px",
                    marginLeft: "4px",
                  }}
                >
                  ⌘K
                </span>
              </button>

              {/* Notifications */}
              <button
                className="vercel-icon-btn"
                style={{ position: "relative" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#3291ff",
                    border: "2px solid #000",
                  }}
                />
              </button>

              {/* Mobile hamburger */}
              <button
                className="vercel-hamburger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  {mobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="4" y1="7" x2="20" y2="7" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="17" x2="20" y2="17" />
                    </>
                  )}
                </svg>
              </button>

              {/* Avatar */}
              <div className="vercel-avatar">A</div>
            </div>
          </div>
        </div>

        {/* ── Tab navigation bar ── */}
        <div className="vercel-tabs-bar desktop-only">
          <div className="vercel-tabs-inner">
            {navTabs.map((tab) => {
              const isActive =
                tab.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`vercel-tab ${isActive ? "vercel-tab-active" : ""}`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Mobile tabs dropdown ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
              style={{
                background: "#0a0a0a",
                borderBottom: "1px solid #1a1a1a",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {navTabs.map((tab) => {
                  const isActive =
                    tab.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(tab.href);
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        padding: "10px 8px",
                        fontSize: "14px",
                        fontWeight: isActive ? 500 : 400,
                        color: isActive ? "#f0f0f5" : "#5c5f73",
                        textDecoration: "none",
                        borderRadius: "6px",
                        transition: "color 0.15s ease",
                      }}
                    >
                      {tab.label}
                    </Link>
                  );
                })}
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: "10px 8px",
                    fontSize: "14px",
                    color: "#5c5f73",
                    textDecoration: "none",
                    borderTop: "1px solid #1a1a1a",
                    marginTop: "4px",
                    paddingTop: "14px",
                  }}
                >
                  ← Back to Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Page content ── */}
        <div className="vercel-content">{children}</div>
      </div>
    </>
  );
}
