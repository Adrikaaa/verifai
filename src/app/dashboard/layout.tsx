"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
});

/* Navigation tabs */
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
        body, html {
          background: #000;
        }

        .vercel-dash {
          min-height: 100vh;
          color: #f0f0f5;
          font-family: var(--font-geist-sans, 'Inter', sans-serif);
          position: relative;
          z-index: 5;
        }

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
          overflow-x: auto;
        }

        .vercel-tabs-inner::-webkit-scrollbar {
          display: none;
        }

        .vercel-tab {
          padding: 12px 16px;
          font-size: 14px;
          color: #5c5f73;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
        }

        .vercel-tab:hover {
          color: #f0f0f5;
        }

        .vercel-tab-active {
          color: #f0f0f5;
          font-weight: 500;
          border-bottom-color: #f0f0f5;
        }

        @media (max-width: 768px) {
          .vercel-topbar-inner { padding: 0 16px; }
          .vercel-tabs-inner { padding: 0 16px; }
          .vercel-content { padding: 24px 16px; }
        }

        .vercel-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
        }
      `}</style>

      {/* Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
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

      <div className="vercel-dash">
        {/* Top Bar */}
        <div className="vercel-topbar">
          <div className="vercel-topbar-inner">
            {/* LEFT: LOGO + PROJECT NAME */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/" className="vercel-logo-area">
                <img
                  src="/logo.png"
                  alt="Verif.Ai Logo"
                  style={{
                    height: "32px",
                    width: "auto",
                    objectFit: "contain",
                    flexShrink: 0,
                  }}
                />
              </Link>

              {/* Breadcrumb */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M5.5 2L10.5 8L5.5 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span style={{ fontSize: "14px", fontWeight: 500 }}>
                Adrika's Projects
              </span>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  border: "1px solid #333",
                  textTransform: "uppercase",
                }}
              >
                Pro
              </span>
            </div>

            {/* RIGHT SIDE */}
            <div className="vercel-topbar-right">
              <button
                className="vercel-icon-btn"
                style={{ width: "auto", padding: "0 12px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="21"
                    y1="21"
                    x2="16.65"
                    y2="16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span style={{ color: "#5c5f73", fontSize: "13px" }}>
                  Search...
                </span>
              </button>

              <button className="vercel-icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M13.73 21a2 2 0 0 1-3.46 0"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>

              <div className="vercel-avatar">A</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Page Content */}
        <div className="vercel-content">{children}</div>
      </div>
    </>
  );
}
