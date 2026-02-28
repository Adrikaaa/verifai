"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function PastePage() {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return alert("Please paste something");

    // 🔥 Later connect this to API
    console.log("Pasted text:", text);

    alert("Frontend working ✅ (API not connected yet)");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Paste Link or Text
        </h1>

        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste URL or text here..."
          className="w-full mb-6 p-4 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 transition shadow-lg shadow-blue-900/40"
        >
          Analyze
        </button>

        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-purple-500 hover:text-purple-400"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
