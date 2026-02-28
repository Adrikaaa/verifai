"use client";

import React, { useState, DragEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async () => {
    if (!file) return alert("Upload file first");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/scans", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.error);
    }

    router.push(`/dashboard/scans/${data.scanId}`);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) {
      handleFile(uploadedFile);
    }
  };

  const handleFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    simulateUpload();

    if (uploadedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setPreview(null);
    }
  };

  const simulateUpload = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Upload Your File
        </h2>

        <p className="text-gray-400 text-sm text-center mb-6">
          Drag & drop your file below or click to browse
        </p>

        {/* Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition relative overflow-hidden ${
            isDragging
              ? "border-purple-500 bg-purple-500/10"
              : "border-white/20 hover:border-blue-500"
          }`}
        >
          <input
            type="file"
            className="hidden"
            id="fileUpload"
            onChange={(e) => {
              const uploadedFile = e.target.files?.[0];
              if (uploadedFile) {
                handleFile(uploadedFile);
              }
            }}
          />

          {!file ? (
            <label htmlFor="fileUpload" className="cursor-pointer block">
              <div className="text-purple-400 text-4xl mb-4">⬆</div>
              <p className="text-white font-medium">Click to upload</p>
              <p className="text-gray-500 text-xs mt-2">
                PNG, JPG, PDF up to 10MB
              </p>
            </label>
          ) : (
            <div className="space-y-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-lg max-h-48 mx-auto object-contain"
                />
              ) : (
                <div className="text-gray-400 text-sm py-6">{file.name}</div>
              )}

              <div className="text-sm text-gray-400">
                {(file.size / 1024).toFixed(2)} KB
              </div>

              <button
                onClick={removeFile}
                className="text-red-400 hover:text-red-500 text-sm"
              >
                Remove file
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        {progress > 0 && (
          <div className="mt-6">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2 text-right">{progress}%</p>
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleSubmit}
          disabled={!file}
          className="w-full mt-6 py-3 rounded-xl
            bg-[#1E3A8A] hover:bg-[#1E40AF]
            text-white font-semibold
            transition-all duration-300
            shadow-lg shadow-blue-900/40
            hover:shadow-blue-800/60
            disabled:opacity-40"
        >
          Analyze
        </button>

        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-purple-500 hover:text-purple-400 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
