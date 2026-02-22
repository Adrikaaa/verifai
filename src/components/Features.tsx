"use client";

import { motion } from "framer-motion";
import Img from "./images";
import Play from "./play";
import { Copy } from "./Copy";
import { PlugIcon } from "lucide-react";
import { Headphones } from "lucide-react";

const bentoItems = [
  {
    title: "Image Detection",
    description:
      "Detect GAN-generated, diffusion model, and photoshopped images with pixel-level analysis.",
    stat: "99.7%",
    statLabel: "accuracy",
    icon: <Img />,
    gridArea: "span 1 / span 1",
  },
  {
    title: "Text Analysis",
    description:
      "Identify ChatGPT, Claude, Gemini, and other LLM-generated text across 50+ languages.",
    stat: "99.8%",
    statLabel: "accuracy",
    icon: <Copy />,
    gridArea: "span 1 / span 1",
  },
  {
    title: "Video Verification",
    description:
      "Frame-by-frame deepfake analysis with temporal consistency checks.",
    stat: "98.5%",
    statLabel: "accuracy",
    icon: <Play />,
    gridArea: "span 1 / span 1",
  },
  {
    title: "Audio Forensics",
    description:
      "Voice cloning and AI speech detection with spectral analysis.",
    stat: "97.2%",
    statLabel: "accuracy",
    icon: <Headphones />,
    gridArea: "span 1 / span 1",
  },
  {
    title: "Browser Extension",
    description:
      "Real-time alerts on social media, news sites, and messaging platforms.",
    stat: "Real-time",
    statLabel: "scanning",
    icon: <PlugIcon />,
    gridArea: "span 1 / span 2",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
} as const;

export default function Features() {
  return (
    <section id="features" style={{ position: "relative" }}>
      <div className="section" style={{ textAlign: "center" }}>
        <span className="section-label">Multi-Modal Detection</span>
        <h2 className="section-title" style={{ margin: "0 auto 0.75rem" }}>
          Every Format. Every Threat.
        </h2>
        <p
          className="section-subtitle"
          style={{ margin: "0 auto 4rem", textAlign: "center" }}
        >
          Our AI engine analyzes content across all media types with
          state-of-the-art detection models.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.25rem",
          }}
        >
          {bentoItems.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="glass-card"
              style={{
                padding: "2rem",
                textAlign: "left",
                gridColumn: item.gridArea.includes("span 2")
                  ? "span 2"
                  : "span 1",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "1rem",
                }}
              >
                {item.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "#f0f0f5",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#8b8fa3",
                  lineHeight: 1.6,
                  marginBottom: "1.25rem",
                }}
              >
                {item.description}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "#f0f0f5",
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {item.stat}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#5c5f73",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.statLabel}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Media query for mobile */}
      <style jsx>{`
        @media (max-width: 640px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
