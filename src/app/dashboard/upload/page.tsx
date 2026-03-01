"use client";

import React, { useState, DragEvent, useRef } from "react";
import Link from "next/link";
import ScanResultPanel, { type ScanResult } from "@/components/ScanResultPanel";

type Status = "idle" | "analysing" | "done" | "error";

const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/mpeg"];
const MAX_MB = 200;

export default function UploadPage() {
  const [isDragging, setIsDragging]     = useState(false);
  const [file, setFile]                 = useState<File | null>(null);
  const [status, setStatus]             = useState<Status>("idle");
  const [error, setError]               = useState<string | null>(null);
  const [result, setResult]             = useState<ScanResult | null>(null);
  const [procSec, setProcSec]           = useState<number | undefined>();
  const [elapsed, setElapsed]           = useState(0);
  const timerRef                        = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  const pickFile = (f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type) && !f.name.match(/\.(mp4|webm|mov|avi|mkv|mpeg)$/i)) {
      setError("Only video files are supported (mp4, webm, mov, avi, mkv, mpeg)."); return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File exceeds ${MAX_MB} MB limit.`); return;
    }
    setFile(f); setError(null); setResult(null); setStatus("idle");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) pickFile(f);
  };

  const clearFile = () => { setFile(null); setResult(null); setError(null); setStatus("idle"); };

  const analyse = async () => {
    if (!file) return;
    setStatus("analysing"); setError(null); setResult(null); setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
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

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-4 py-12 text-white">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-1 text-center">Upload Video</h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Upload a video file to scan for AI generation or deepfakes
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
            isDragging ? "border-[#3EF2C5] bg-[#3EF2C5]/5" : file ? "border-white/20 cursor-default" : "border-white/20 hover:border-blue-500"
          }`}
        >
          <input
            ref={fileInputRef} type="file" className="hidden"
            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska,video/mpeg,.mp4,.webm,.mov,.avi,.mkv,.mpeg"
            onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f); }}
          />
          {!file ? (
            <>
              <div className="text-4xl mb-3">🎬</div>
              <p className="text-white font-medium">Click or drag &amp; drop a video</p>
              <p className="text-gray-500 text-xs mt-2">MP4 · WebM · MOV · AVI · MKV — up to {MAX_MB} MB</p>
            </>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl">🎥</div>
              <p className="text-white font-medium text-sm">{file.name}</p>
              <p className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              <button onClick={e => { e.stopPropagation(); clearFile(); }} className="text-red-400 hover:text-red-300 text-xs">
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
        )}

        {/* Analyse button */}
        <button
          onClick={analyse}
          disabled={!file || status === "analysing"}
          className="w-full mt-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "analysing" ? `Analysing… ${fmt(elapsed)}` : "Analyse Video"}
        </button>

        {/* Processing notice */}
        {status === "analysing" && (
          <p className="text-center text-gray-500 text-xs mt-3">
            This can take 2–5 minutes depending on video length. Please keep this tab open.
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
