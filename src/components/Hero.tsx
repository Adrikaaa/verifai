"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="section"
        style={{ paddingTop: "8rem", paddingBottom: "4rem" }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label" style={{ marginBottom: "2rem" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#3EF2C5",
                display: "inline-block",
                boxShadow: "0 0 8px rgba(62, 242, 197, 0.6)",
              }}
            />
            VERIF.AI
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            maxWidth: 700,
            marginBottom: "1.5rem",
            color: "#f0f0f5",
          }}
        >
          AI can fake anything.
          <br />
          <span style={{ color: "#8b8fa3" }}>We help you see the truth.</span>
        </motion.h1>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: "1.125rem",
            color: "#5c5f73",
            maxWidth: 520,
            lineHeight: 1.65,
            marginBottom: "2.5rem",
          }}
        >
          Advanced AI detection for images, text, video, and audio. Instant
          authenticity reports with 99.8% accuracy.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "5rem",
          }}
        >
          <a href="#pricing" className="btn-primary">
            Start Detecting Free →
          </a>
          <a href="#how-it-works" className="btn-secondary">
            See How It Works →
          </a>
        </motion.div>

        {/* Stats 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            display: "flex",
            gap: "3.5rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "1M+", label: "Files analyzed daily" },
            { value: "99.8%", label: "Detection accuracy" },
            { value: "<2s", label: "Average scan time" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "#f0f0f5",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#5c5f73",
                  marginTop: "0.25rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>*/}
      </div>
    </section>
  );
}
