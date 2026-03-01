"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import ScanResultPanel, { type ScanResult } from "@/components/ScanResultPanel";

type Status = "idle" | "analysing" | "done" | "error";

export default function PastePage() {
  const [url, setUrl]           = useState("");
  const [status, setStatus]     = useState<Status>("idle");
  const [error, setError]       = useState<string | null>(null);
  const [result, setResult]     = useState<ScanResult | null>(null);
  const [procSec, setProcSec]   = useState<number | undefined>();
  const [elapsed, setElapsed]   = useState(0);
  const timerRef                = useRef<ReturnType<typeof setInterval> | null>(null);

  const analyse = async () => {
    const trimmed = url.trim();
    if (!trimmed) { setError("Please enter a video URL."); return; }
    try { new URL(trimmed); } catch { setError("Please enter a valid URL."); return; }

    setStatus("analysing"); setError(null); setResult(null); setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);

    try {
      const res = await fetch("/api/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      setProcSec(data.processingTimeSec);
      setResult(data.result as ScanResult);
      setStatus("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const reset = () => { setUrl(""); setResult(null); setError(null); setStatus("idle"); setElapsed(0); };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-4 py-12 text-white">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold mb-1 text-center">Paste Video URL</h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Paste a link to a YouTube, Instagram, Twitter/X, or any direct video URL
        </p>

        {/* Input row */}
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={e => { setUrl(e.target.value); setError(null); }}
            onKeyDown={e => e.key === "Enter" && status !== "analysing" && analyse()}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={status === "analysing"}
            className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition disabled:opacity-50"
          />
          {status === "done" && (
            <button onClick={reset} className="px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition text-sm">
              Clear
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
        )}

        {/* Button */}
        <button
          onClick={analyse}
          disabled={!url.trim() || status === "analysing"}
          className="w-full mt-4 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "analysing" ? `Analysing… ${fmt(elapsed)}` : "Analyse"}
        </button>

        {/* Processing notice */}
        {status === "analysing" && (
          <p className="text-center text-gray-500 text-xs mt-3">
            Downloading and analysing the video. This can take 2–5 minutes. Keep this tab open.
          </p>
        )}

        {/* Results */}
        {status === "done" && result && (
          <div className="mt-8">
            <ScanResultPanel result={result} processingTimeSec={procSec} />
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-purple-500 hover:text-purple-400 transition text-sm">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

