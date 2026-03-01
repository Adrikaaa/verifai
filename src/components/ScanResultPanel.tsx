"use client";

import React, { useState } from "react";

interface NewsItem {
  title: string;
  url:   string;
  source: string;
  date:  string;
}

interface Personality {
  name:       string;
  confidence: number;
  frameIndex: number;
  news:       NewsItem[];
}

interface ClaimResult {
  claim:       string;
  searchQuery: string;
  news:        NewsItem[];
  supported:   boolean;
}

interface SpeechAnalysis {
  transcript: string;
  language:   string;
  claims:     ClaimResult[];
}

interface SceneMatch {
  frameIndex:    number;
  caption:       string;
  matchedImages: { title: string; url: string; source: string; thumbnail: string }[];
  matchedNews:   NewsItem[];
  isKnownScene:  boolean;
}

export interface ScanResult {
  verdict:      "AI" | "SUSPICIOUS" | "NOT AI";
  confidence:   "HIGH" | "MEDIUM" | "LOW";
  overallScore: number;
  reason:       string;
  scores: {
    face_deepfake:  number;
    full_deepfake:  number;
    ai_image:       number;
    fft_artifacts:  number;
    ela_forgery:    number;
    temporal:       number;
    audio_anomaly:  number;
  };
  caption:        string;
  factCheck:      NewsItem[];
  clipIdentity: {
    title:       string;
    uploader:    string;
    platform:    string;
    uploadDate:  string;
    viewCount:   number | null;
    likeCount:   number | null;
    isKnownClip: boolean;
    clipNews:    NewsItem[];
    originalUrl: string;
  };
  personalities:    Personality[];
  audioLabel:       string;
  speechAnalysis?:  SpeechAnalysis;
  sceneSearch?:     SceneMatch[];
  framesAnalysed:   number;
  durationSec:      number;
  processingTimeSec?: number;
}

const SIGNAL_LABELS: Record<string, string> = {
  face_deepfake: "Face Deepfake",
  full_deepfake: "Frame AI",
  ai_image:      "AI Image",
  fft_artifacts: "FFT Artifacts",
  ela_forgery:   "ELA Forgery",
  temporal:      "Temporal",
  audio_anomaly: "Audio",
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
  const color =
    pct >= 60 ? "#ef4444" :
    pct >= 35 ? "#f59e0b" :
    "#3EF2C5";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#8b8fa3" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color }}>{pct}%</span>
      </div>
      <div style={{ background: "#1a1a1a", borderRadius: 99, height: 6, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block", padding: "8px 10px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid #1a1a1a", borderRadius: 8,
        textDecoration: "none", marginBottom: 6,
        transition: "background 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
      onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
    >
      <p style={{ margin: 0, fontSize: 13, color: "#f0f0f5", lineHeight: 1.4 }}>{item.title}</p>
      <p style={{ margin: "4px 0 0", fontSize: 11, color: "#5c5f73" }}>
        {item.source}{item.date ? ` · ${item.date}` : ""}
      </p>
    </a>
  );
}

export default function ScanResultPanel({ result, processingTimeSec }: { result: ScanResult; processingTimeSec?: number }) {
  const [feedbackType, setFeedbackType] = useState<"agree" | "disagree" | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const verdictColor =
    result.verdict === "AI"         ? "#ef4444" :
    result.verdict === "SUSPICIOUS" ? "#f59e0b" :
    "#3EF2C5";

  const verdictEmoji =
    result.verdict === "AI"         ? "🤖" :
    result.verdict === "SUSPICIOUS" ? "⚠️" :
    "✅";

  const label =
    result.verdict === "AI"         ? "AI Generated" :
    result.verdict === "SUSPICIOUS" ? "Suspicious"   :
    "Likely Authentic";

  return (
    <div style={{
      background: "#0a0a0a", border: "1px solid #1a1a1a",
      borderRadius: 16, padding: 24, width: "100%",
      color: "#f0f0f5", fontFamily: "var(--font-geist-sans, Inter, sans-serif)",
    }}>
      {/* ── Verdict header ── */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{verdictEmoji}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: verdictColor }}>{label}</div>
        <div style={{ fontSize: 13, color: "#8b8fa3", marginTop: 4 }}>
          {result.confidence} confidence · AI score: {Math.round(result.overallScore * 100)}%
        </div>
        {processingTimeSec && (
          <div style={{ fontSize: 11, color: "#5c5f73", marginTop: 4 }}>
            Analysed {result.framesAnalysed} frames · {result.durationSec}s video · {processingTimeSec}s processing
          </div>
        )}
      </div>

      {/* ── Reason ── */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a",
        borderRadius: 10, padding: "12px 14px", marginBottom: 20,
        fontSize: 13, color: "#c5c7d4", lineHeight: 1.6,
      }}>
        {result.reason}
      </div>

      {/* ── Signal bars ── */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 11, fontWeight: 600, color: "#5c5f73", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
          Forensic Signals
        </h4>
        {Object.entries(result.scores).map(([key, val]) => (
          <ScoreBar key={key} label={SIGNAL_LABELS[key] || key} value={val} />
        ))}
      </div>

      {/* ── Personalities ── */}
      {result.personalities?.length > 0 && ((
        ) => {
          const top = result.personalities[0];
          const rest = result.personalities.slice(1);
          return (
            <div style={{ marginBottom: 20, borderTop: "1px solid #1a1a1a", paddingTop: 16 }}>
              <h4 style={{ fontSize: 11, fontWeight: 600, color: "#5c5f73", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
                👤 Recognised Personalities
              </h4>
              {/* Top match — with news */}
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a",
                borderRadius: 10, padding: "10px 14px", marginBottom: 10,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: top.news?.length ? 8 : 0 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{top.name}</span>
                  <span style={{ fontSize: 12, color: "#3EF2C5" }}>{(top.confidence * 100).toFixed(1)}% match</span>
                </div>
                {top.news?.slice(0, 3).map((n, i) => <NewsCard key={i} item={n} />)}
              </div>
              {/* Other matches — name + confidence only, no news */}
              {rest.map(p => (
                <div key={p.name} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a",
                  borderRadius: 10, padding: "10px 14px", marginBottom: 10,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                    <span style={{ fontSize: 12, color: "#8b8fa3" }}>{(p.confidence * 100).toFixed(1)}% match</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

      {/* ── Clip Identity ── */}
      {result.clipIdentity?.title && (
        <div style={{ marginBottom: 20, borderTop: "1px solid #1a1a1a", paddingTop: 16 }}>
          <h4 style={{ fontSize: 11, fontWeight: 600, color: "#5c5f73", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
            🎬 Clip Identity
          </h4>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, padding: "2px 8px", background: result.clipIdentity.isKnownClip ? "rgba(62,242,197,0.1)" : "rgba(255,255,255,0.05)", color: result.clipIdentity.isKnownClip ? "#3EF2C5" : "#8b8fa3", borderRadius: 99, border: `1px solid ${result.clipIdentity.isKnownClip ? "#3EF2C5" : "#333"}` }}>
                {result.clipIdentity.isKnownClip ? "🟢 Known Clip" : "⚪ Unknown Clip"}
              </span>
              <span style={{ fontSize: 11, padding: "2px 8px", background: "rgba(255,255,255,0.05)", color: "#8b8fa3", borderRadius: 99, border: "1px solid #333" }}>
                {result.clipIdentity.platform}
              </span>
            </div>
            <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14 }}>{result.clipIdentity.title}</p>
            {result.clipIdentity.uploader && <p style={{ margin: "0 0 4px", fontSize: 12, color: "#8b8fa3" }}>by {result.clipIdentity.uploader}</p>}
            {result.clipIdentity.viewCount && (
              <p style={{ margin: 0, fontSize: 12, color: "#5c5f73" }}>
                {result.clipIdentity.viewCount.toLocaleString()} views
                {result.clipIdentity.uploadDate ? ` · ${result.clipIdentity.uploadDate}` : ""}
              </p>
            )}
            {result.clipIdentity.clipNews?.length > 0 && (
              <div style={{ marginTop: 10 }}>
                {result.clipIdentity.clipNews.slice(0, 3).map((n, i) => <NewsCard key={i} item={n} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Fact Check ── */}
      {result.factCheck?.length > 0 && (
        <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16 }}>
          <h4 style={{ fontSize: 11, fontWeight: 600, color: "#5c5f73", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
            📰 Related News
            {result.caption && <span style={{ fontWeight: 400, color: "#5c5f73", marginLeft: 6 }}>— "{result.caption}"</span>}
          </h4>
          {result.factCheck.map((n, i) => <NewsCard key={i} item={n} />)}
        </div>
      )}

      {/* ── Speech Analysis ── */}
      {result.speechAnalysis?.transcript && (
        <div style={{ marginBottom: 20, borderTop: "1px solid #1a1a1a", paddingTop: 16, marginTop: 20 }}>
          <h4 style={{ fontSize: 11, fontWeight: 600, color: "#5c5f73", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
            🎙️ Speech Analysis
          </h4>

          {/* Transcript */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a",
            borderRadius: 10, padding: "12px 14px", marginBottom: 12,
          }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, color: "#5c5f73", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Transcript {result.speechAnalysis.language ? `(${result.speechAnalysis.language})` : ""}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "#c5c7d4", lineHeight: 1.6, fontStyle: "italic" }}>
              &ldquo;{result.speechAnalysis.transcript.length > 500
                ? result.speechAnalysis.transcript.slice(0, 500) + "…"
                : result.speechAnalysis.transcript}&rdquo;
            </p>
          </div>

          {/* Claims */}
          {result.speechAnalysis.claims?.length > 0 && (
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#8b8fa3" }}>
                {result.speechAnalysis.claims.length} claim{result.speechAnalysis.claims.length !== 1 ? "s" : ""} extracted
                &nbsp;·&nbsp;
                {result.speechAnalysis.claims.filter(c => c.supported).length} corroborated by news
              </p>
              {result.speechAnalysis.claims.map((claim, ci) => (
                <div key={ci} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a",
                  borderRadius: 10, padding: "10px 14px", marginBottom: 8,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: claim.news?.length ? 8 : 0 }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#f0f0f5", flex: 1 }}>
                      &ldquo;{claim.claim}&rdquo;
                    </p>
                    <span style={{
                      flexShrink: 0, marginLeft: 8, fontSize: 11, fontWeight: 600,
                      padding: "2px 8px", borderRadius: 99,
                      background: claim.supported ? "rgba(62,242,197,0.1)" : "rgba(239,68,68,0.1)",
                      color: claim.supported ? "#3EF2C5" : "#ef4444",
                      border: `1px solid ${claim.supported ? "rgba(62,242,197,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}>
                      {claim.supported ? "✓ Found" : "✗ No match"}
                    </span>
                  </div>
                  {claim.news?.map((n, ni) => <NewsCard key={ni} item={n} />)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Scene Search ── */}
      {result.sceneSearch && result.sceneSearch.length > 0 && (
        <div style={{ marginBottom: 20, borderTop: "1px solid #1a1a1a", paddingTop: 16 }}>
          <h4 style={{ fontSize: 11, fontWeight: 600, color: "#5c5f73", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
            🔎 Reverse Scene Search
          </h4>
          {result.sceneSearch.map((scene, si) => (
            <div key={si} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a",
              borderRadius: 10, padding: "10px 14px", marginBottom: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p style={{ margin: 0, fontSize: 13, color: "#c5c7d4", fontStyle: "italic" }}>
                  Frame {scene.frameIndex}: &ldquo;{scene.caption}&rdquo;
                </p>
                <span style={{
                  flexShrink: 0, marginLeft: 8, fontSize: 11, fontWeight: 600,
                  padding: "2px 8px", borderRadius: 99,
                  background: scene.isKnownScene ? "rgba(62,242,197,0.1)" : "rgba(255,255,255,0.05)",
                  color: scene.isKnownScene ? "#3EF2C5" : "#8b8fa3",
                  border: `1px solid ${scene.isKnownScene ? "rgba(62,242,197,0.3)" : "#333"}`,
                }}>
                  {scene.isKnownScene ? "🟢 Known" : "⚪ New"}
                </span>
              </div>
              {scene.matchedNews?.length > 0 && (
                <div style={{ marginBottom: scene.matchedImages?.length ? 8 : 0 }}>
                  {scene.matchedNews.slice(0, 3).map((n, ni) => <NewsCard key={ni} item={n} />)}
                </div>
              )}
              {scene.matchedImages?.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {scene.matchedImages.slice(0, 4).map((img, ii) => (
                    <a key={ii} href={img.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11, color: "#3b82f6", textDecoration: "none" }}
                      title={img.title}
                    >
                      {img.source || "image"} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Feedback ── */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16, marginTop: 20 }}>
        <h4 style={{ fontSize: 11, fontWeight: 600, color: "#5c5f73", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
          💬 Feedback
        </h4>
        {feedbackSent ? (
          <div style={{
            background: "rgba(62,242,197,0.08)", border: "1px solid rgba(62,242,197,0.25)",
            borderRadius: 10, padding: "14px 16px", textAlign: "center",
          }}>
            <p style={{ margin: 0, fontSize: 14, color: "#3EF2C5", fontWeight: 600 }}>Thanks for your feedback!</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#8b8fa3" }}>Your input helps improve VerifAI.</p>
          </div>
        ) : (
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a",
            borderRadius: 10, padding: "14px 16px",
          }}>
            <p style={{ margin: "0 0 10px", fontSize: 13, color: "#c5c7d4" }}>
              Do you agree with this analysis?
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button
                onClick={() => setFeedbackType("agree")}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, cursor: "pointer",
                  border: feedbackType === "agree" ? "2px solid #3EF2C5" : "1px solid #333",
                  background: feedbackType === "agree" ? "rgba(62,242,197,0.1)" : "transparent",
                  color: feedbackType === "agree" ? "#3EF2C5" : "#8b8fa3",
                  fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                }}
              >
                👍 Agree
              </button>
              <button
                onClick={() => setFeedbackType("disagree")}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, cursor: "pointer",
                  border: feedbackType === "disagree" ? "2px solid #ef4444" : "1px solid #333",
                  background: feedbackType === "disagree" ? "rgba(239,68,68,0.1)" : "transparent",
                  color: feedbackType === "disagree" ? "#ef4444" : "#8b8fa3",
                  fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                }}
              >
                👎 Disagree
              </button>
            </div>
            {feedbackType && (
              <>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder={feedbackType === "disagree"
                    ? "Tell us what you think is wrong with this analysis…"
                    : "Any additional comments? (optional)"}
                  rows={3}
                  style={{
                    width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid #333",
                    borderRadius: 8, padding: "10px 12px", color: "#f0f0f5", fontSize: 13,
                    resize: "vertical", fontFamily: "inherit", outline: "none",
                    marginBottom: 10,
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "#555"}
                  onBlur={e => e.currentTarget.style.borderColor = "#333"}
                />
                <button
                  onClick={() => {
                    // Log feedback to console (could POST to an endpoint)
                    console.log("[VerifAI Feedback]", {
                      type: feedbackType,
                      text: feedbackText,
                      verdict: result.verdict,
                      overallScore: result.overallScore,
                    });
                    setFeedbackSent(true);
                  }}
                  style={{
                    width: "100%", padding: "8px 0", borderRadius: 8, cursor: "pointer",
                    background: "#3b82f6", border: "none", color: "#fff",
                    fontSize: 13, fontWeight: 600, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}
                >
                  Submit Feedback
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
