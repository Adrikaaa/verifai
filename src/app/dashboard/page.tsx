"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useRouter } from "next/navigation";

/* ═══════════ Vercel-style Colors ═══════════ */
const V = {
  bg: "#000",
  card: "#0a0a0a",
  cardHover: "#111111",
  border: "#1a1a1a",
  borderHover: "#333333",
  text: "#f0f0f5",
  textSecondary: "#8b8fa3",
  textMuted: "#5c5f73",
  blue: "#3653E1",
  green: "#3EF2C5",
  red: "#ef4444",
  amber: "#fbbf24",
  purple: "#5227FF",
  font: "var(--font-geist-sans, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif)",
  mono: "var(--font-geist-mono, 'JetBrains Mono', 'Menlo', monospace)",
};

/* ═══════════ DUMMY DATA ═══════════ */
const stats = [
  { label: "Total Scans", value: "128", change: "+12%", positive: true },
  { label: "AI Detected", value: "63", change: "+8%", positive: false },
  { label: "Authentic", value: "45", change: "+22%", positive: true },
  { label: "Links Analyzed", value: "20", change: "+5%", positive: true },
];

const usageItems = [
  { label: "Scans Used", current: 63, max: 100, unit: "" },
  { label: "API Calls", current: 492, max: 5000, unit: "" },
  { label: "Storage", current: 1.2, max: 5, unit: "GB" },
];

interface ScanItem {
  id: string;
  name: string;
  type: "Image" | "Video" | "Audio" | "Text";
  source: string;
  result: "AI Generated" | "Authentic" | "Inconclusive";
  confidence: number;
  date: string;
  thumbnail: string;
  repo?: string;
}

const recentScans: ScanItem[] = [
  {
    id: "scan-001",
    name: "photo_portrait.png",
    type: "Image",
    source: "Upload",
    result: "AI Generated",
    confidence: 94,
    date: "12 min ago",
    thumbnail: "🖼️",
    repo: "media-uploads",
  },
  {
    id: "scan-002",
    name: "interview_clip.mp4",
    type: "Video",
    source: "URL",
    result: "Authentic",
    confidence: 88,
    date: "1 hr ago",
    thumbnail: "🎬",
    repo: "video-analysis",
  },
  {
    id: "scan-003",
    name: "news_article.txt",
    type: "Text",
    source: "Paste",
    result: "AI Generated",
    confidence: 81,
    date: "2 hrs ago",
    thumbnail: "📄",
    repo: "text-scans",
  },
  {
    id: "scan-004",
    name: "podcast_excerpt.mp3",
    type: "Audio",
    source: "Upload",
    result: "Inconclusive",
    confidence: 52,
    date: "3 hrs ago",
    thumbnail: "🎵",
    repo: "audio-forensics",
  },
  {
    id: "scan-005",
    name: "twitter_thread.txt",
    type: "Text",
    source: "URL",
    result: "AI Generated",
    confidence: 76,
    date: "5 hrs ago",
    thumbnail: "📝",
    repo: "social-monitor",
  },
  {
    id: "scan-006",
    name: "landscape_photo.jpg",
    type: "Image",
    source: "Upload",
    result: "Authentic",
    confidence: 97,
    date: "1 day ago",
    thumbnail: "🏞️",
    repo: "media-uploads",
  },
];

/* ═══════════ HELPERS ═══════════ */
function getResultColor(result: string) {
  switch (result) {
    case "AI Generated":
      return V.red;
    case "Authentic":
      return V.green;
    default:
      return V.amber;
  }
}

function getResultDot(result: string) {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: getResultColor(result),
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

/* ═══════════ MAIN PAGE ═══════════ */
export default function DashboardPage() {
  const [selectedScan, setSelectedScan] = useState<ScanItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScans = recentScans.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <style>{`
        .v-card {
          background: ${V.card};
          border: 1px solid ${V.border};
          border-radius: 8px;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .v-card:hover {
          border-color: ${V.borderHover};
          background: ${V.cardHover};
        }
        .v-scan-card {
          cursor: pointer;
        }
        .v-stat-card {
          padding: 20px;
        }
        .v-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #000;
          background: #f0f0f5;
          border: 1px solid #f0f0f5;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: ${V.font};
        }
        .v-btn-primary:hover {
          background: #fff;
        }
        .v-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: ${V.textSecondary};
          background: transparent;
          border: 1px solid ${V.border};
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: ${V.font};
        }
        .v-btn-secondary:hover {
          border-color: ${V.borderHover};
          color: ${V.text};
          background: ${V.card};
        }
        .v-input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          font-size: 14px;
          color: ${V.text};
          background: ${V.card};
          border: 1px solid ${V.border};
          border-radius: 6px;
          outline: none;
          font-family: ${V.font};
          transition: border-color 0.15s ease;
        }
        .v-input:focus {
          border-color: ${V.borderHover};
        }
        .v-input::placeholder {
          color: ${V.textMuted};
        }
        .v-progress-track {
          width: 100%;
          height: 4px;
          background: #1a1a1a;
          border-radius: 9999px;
          overflow: hidden;
        }
        .v-progress-fill {
          height: 100%;
          border-radius: 9999px;
          background: ${V.text};
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* ── Header Row: Title + Actions ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              fontWeight: 800,
              color: V.text,
              margin: 0,
              letterSpacing: "-0.03em",
              fontFamily: V.font,
            }}
          >
            Dashboard
          </h1>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link
            href="/dashboard/paste"
            className="v-btn-secondary inline-flex items-center gap-2"
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
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Paste Link
          </Link>

          <Link
            href="/dashboard/upload"
            className="v-btn-primary inline-flex items-center gap-2"
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Scan
          </Link>
        </div>
      </div>

      {/* ── Layout: Main + Sidebar ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* ── Left: Main Content ── */}
        <div>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: "24px" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={V.textMuted}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="v-input"
              type="text"
              placeholder="Search scans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: V.text,
                margin: 0,
                fontFamily: V.font,
              }}
            >
              Recent Scans
            </h2>
            <div style={{ display: "flex", gap: "4px" }}>
              {/* Grid / List toggle - visual only */}
              <button
                className="vercel-icon-btn"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  border: `1px solid ${V.border}`,
                  background: V.card,
                  color: V.text,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                className="vercel-icon-btn"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  border: `1px solid ${V.border}`,
                  background: "transparent",
                  color: V.textMuted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Scan Cards Grid (Vercel project-card style) ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {filteredScans.map((scan, i) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="v-card v-scan-card"
                onClick={() => setSelectedScan(scan)}
                style={{ padding: "20px" }}
              >
                {/* Top row: Icon + Name + Menu */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "6px",
                      background: "#111",
                      border: `1px solid ${V.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {scan.thumbnail}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: V.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginBottom: "2px",
                      }}
                    >
                      {scan.name}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: V.textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {scan.source} • {scan.type}
                    </div>
                  </div>

                  {/* Result indicator + three-dot */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                  >
                    {getResultDot(scan.result)}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: "none",
                        border: "none",
                        color: V.textMuted,
                        cursor: "pointer",
                        padding: "2px",
                        display: "flex",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Result & repo row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: getResultColor(scan.result),
                    }}
                  >
                    {scan.result}
                  </span>
                  <span style={{ color: V.textMuted, fontSize: "12px" }}>
                    ·
                  </span>
                  <span style={{ fontSize: "12px", color: V.textMuted }}>
                    {scan.confidence}% confidence
                  </span>
                </div>

                {/* Bottom: Date */}
                <div
                  style={{
                    fontSize: "12px",
                    color: V.textMuted,
                    paddingTop: "12px",
                    borderTop: `1px solid ${V.border}`,
                  }}
                >
                  {scan.date}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right Sidebar: Usage + Stats ── */}
        <div style={{ position: "sticky", top: "140px" }}>
          {/* Stats */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: V.text,
                  margin: 0,
                }}
              >
                Stats
              </h3>
              <span style={{ fontSize: "12px", color: V.textMuted }}>
                Last 30 days
              </span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="v-card v-stat-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: V.textMuted,
                        marginBottom: "4px",
                      }}
                    >
                      {stat.label}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: V.text,
                        fontFamily: V.mono,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {stat.value}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: stat.positive ? V.green : V.red,
                    }}
                  >
                    {stat.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Usage */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: V.text,
                  margin: 0,
                }}
              >
                Usage
              </h3>
              <button
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#000",
                  background: V.text,
                  border: "none",
                  borderRadius: "4px",
                  padding: "3px 10px",
                  cursor: "pointer",
                }}
              >
                Upgrade to Pro
              </button>
            </div>
            <div className="v-card" style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {usageItems.map((item) => (
                  <div key={item.label}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{ fontSize: "13px", color: V.textSecondary }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: V.textMuted,
                          fontFamily: V.mono,
                        }}
                      >
                        {item.current}
                        {item.unit} / {item.max}
                        {item.unit}
                      </span>
                    </div>
                    <div className="v-progress-track">
                      <div
                        className="v-progress-fill"
                        style={{
                          width: `${(item.current / item.max) * 100}%`,
                          background:
                            item.current / item.max > 0.8 ? V.amber : V.text,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: V.text,
                margin: "0 0 12px",
              }}
            >
              Alerts
            </h3>
            <div
              className="v-card"
              style={{ padding: "20px", textAlign: "center" }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: V.textSecondary,
                  marginBottom: "4px",
                }}
              >
                Get alerted for anomalies
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: V.textMuted,
                  marginBottom: "12px",
                }}
              >
                Automatically monitor your scans and get notified.
              </div>
              <button
                className="v-btn-secondary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "13px",
                }}
              >
                Enable Alerts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Responsive override for sidebar ── */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 300px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* ── Scan Detail Modal ── */}
      <AnimatePresence>
        {selectedScan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedScan(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 720,
                maxHeight: "85vh",
                overflowY: "auto",
                borderRadius: "12px",
                background: V.card,
                border: `1px solid ${V.border}`,
                boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: `1px solid ${V.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      background: "#111",
                      border: `1px solid ${V.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                    }}
                  >
                    {selectedScan.thumbnail}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: V.text,
                        fontFamily: V.mono,
                      }}
                    >
                      {selectedScan.name}
                    </div>
                    <div style={{ fontSize: "13px", color: V.textMuted }}>
                      Scanned {selectedScan.date} · {selectedScan.source}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedScan(null)}
                  style={{
                    background: "none",
                    border: `1px solid ${V.border}`,
                    borderRadius: "6px",
                    color: V.textSecondary,
                    cursor: "pointer",
                    padding: "6px",
                    display: "flex",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div
                style={{
                  padding: "24px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                {/* Left: Score */}
                <div>
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        border: `3px solid ${getResultColor(selectedScan.result)}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "32px",
                          fontWeight: 700,
                          color: getResultColor(selectedScan.result),
                          fontFamily: V.mono,
                          letterSpacing: "-0.04em",
                          lineHeight: 1,
                        }}
                      >
                        {selectedScan.confidence}%
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: V.textMuted,
                          marginTop: "4px",
                        }}
                      >
                        Confidence
                      </span>
                    </div>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: getResultColor(selectedScan.result),
                      }}
                    >
                      {getResultDot(selectedScan.result)}
                      {selectedScan.result}
                    </div>
                  </div>

                  {/* Metadata */}
                  {[
                    { label: "File Type", value: selectedScan.type },
                    { label: "Source", value: selectedScan.source },
                    { label: "Scanned", value: selectedScan.date },
                    { label: "File Name", value: selectedScan.name },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: `1px solid ${V.border}`,
                      }}
                    >
                      <span style={{ fontSize: "13px", color: V.textMuted }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: V.text,
                          fontWeight: 500,
                          fontFamily: V.mono,
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right: Risk + Patterns */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Risk Level */}
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: "#111",
                      border: `1px solid ${V.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: V.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "10px",
                      }}
                    >
                      Risk Level
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "3px",
                        marginBottom: "8px",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((level) => {
                        const riskLevel =
                          selectedScan.confidence >= 80
                            ? selectedScan.result === "AI Generated"
                              ? 4
                              : 1
                            : selectedScan.confidence >= 60
                              ? 3
                              : 2;
                        return (
                          <div
                            key={level}
                            style={{
                              flex: 1,
                              height: 4,
                              borderRadius: "9999px",
                              background:
                                level <= riskLevel
                                  ? getResultColor(selectedScan.result)
                                  : "#1a1a1a",
                            }}
                          />
                        );
                      })}
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: V.textSecondary,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {selectedScan.result === "AI Generated"
                        ? "High risk — content likely generated by AI"
                        : selectedScan.result === "Authentic"
                          ? "Low risk — content appears authentic"
                          : "Moderate risk — unable to determine origin"}
                    </p>
                  </div>

                  {/* Detected Patterns */}
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: "#111",
                      border: `1px solid ${V.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: V.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "10px",
                      }}
                    >
                      Detected Patterns
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {(selectedScan.result === "AI Generated"
                        ? [
                            { pattern: "GAN Artifacts", severity: "high" },
                            {
                              pattern: "Texture Inconsistency",
                              severity: "medium",
                            },
                            { pattern: "Metadata Anomaly", severity: "high" },
                          ]
                        : selectedScan.result === "Authentic"
                          ? [
                              { pattern: "Natural Noise", severity: "low" },
                              { pattern: "Consistent EXIF", severity: "low" },
                            ]
                          : [
                              {
                                pattern: "Partial Compression",
                                severity: "medium",
                              },
                              {
                                pattern: "Ambiguous Signatures",
                                severity: "medium",
                              },
                            ]
                      ).map((p) => (
                        <div
                          key={p.pattern}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "6px 8px",
                            borderRadius: "4px",
                            background: "#0a0a0a",
                          }}
                        >
                          <span style={{ fontSize: "13px", color: V.text }}>
                            {p.pattern}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              color:
                                p.severity === "high"
                                  ? V.red
                                  : p.severity === "medium"
                                    ? V.amber
                                    : V.green,
                            }}
                          >
                            {p.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explainability */}
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: "#111",
                      border: `1px solid ${V.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: V.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "10px",
                      }}
                    >
                      AI Explainability
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: V.textSecondary,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {selectedScan.result === "AI Generated"
                        ? "Multi-model analysis detected signatures consistent with generative AI. High-frequency artifacts and inconsistent noise suggest synthetic origin."
                        : selectedScan.result === "Authentic"
                          ? "Content passes all authenticity checks. Natural sensor noise, consistent lighting, and valid metadata indicate genuine origin."
                          : "Analysis was inconclusive due to heavy compression. We recommend re-scanning with a higher quality version."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "16px 24px",
                  borderTop: `1px solid ${V.border}`,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <button className="v-btn-secondary">Download Report</button>
                <button className="v-btn-primary">Re-scan</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
