"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="section"
        style={{
          textAlign: "center",
          paddingTop: "5rem",
          paddingBottom: "5rem",
        }}
      >
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: "1rem",
            background: "rgba(82, 39, 255, 0.1)",
            border: "1px solid rgba(82, 39, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5227FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            marginBottom: "1rem",
            color: "#f0f0f5",
          }}
        >
          Ready to verify the truth?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "1.1rem",
            color: "#8b8fa3",
            maxWidth: 480,
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
          }}
        >
          Join thousands of professionals already using verif.Ai to combat
          misinformation. Start for free today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "3.5rem",
          }}
        >
          <Link href="/dashboard" className="btn-primary pulse-glow">
            Get Started Free
          </Link>
          <a href="#features" className="btn-secondary">
            Learn More
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "50K+", label: "Users" },
            { value: "2M+", label: "Scans completed" },
            { value: "4.9/5", label: "Avg rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#f0f0f5",
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#5c5f73",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
