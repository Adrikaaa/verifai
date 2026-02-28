"use client";

import { motion } from "framer-motion";

export default function ExtensionPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 text-white">
      {/* HERO SECTION */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Install the VerifAI Browser Extension
        </h1>

        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
          Detect AI-generated images, videos, text, and profiles directly on any
          website.
        </p>

        <a
          href="#"
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition"
        >
          Download for Chrome →
        </a>

        <p className="text-gray-500 text-sm mt-3">
          Firefox, Edge & Brave support coming soon.
        </p>
      </div>

      {/* FEATURE CARDS (MetaMask-style) */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {[
          {
            title: "Scan Anything On The Web",
            desc: "Right-click AI detection for images, video, and text.",
            icon: "🧠",
          },
          {
            title: "Instant Link Verification",
            desc: "Detect fakes on social media, news sites, and more.",
            icon: "🔗",
          },
          {
            title: "Sync With Dashboard",
            desc: "All extension scans appear automatically in your dashboard.",
            icon: "☁️",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:border-gray-600 transition"
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* INSTALL STEPS (MetaMask-style) */}
      <h2 className="text-2xl font-semibold mb-6">How to Install</h2>

      <div className="space-y-6">
        {[
          {
            step: "STEP 01",
            title: "Add VerifAI to Chrome",
            desc: "Open the Chrome Web Store and click *Add Extension*.",
          },
          {
            step: "STEP 02",
            title: "Pin the Extension",
            desc: "Click the puzzle icon and pin VerifAI for quick access.",
          },
          {
            step: "STEP 03",
            title: "Start Scanning",
            desc: "Right-click on any image, video, or text to analyze instantly.",
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl"
          >
            <p className="text-sm text-gray-500 mb-1">{s.step}</p>
            <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
            <p className="text-gray-400 text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
