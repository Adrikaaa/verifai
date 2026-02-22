"use client";

import { motion } from "framer-motion";
import { Folders } from "./Folders";
import { ScanText } from "./ScanText";
import { ReportIcon } from "./ReportIcon";

const steps = [
  {
    number: "01",
    title: "Upload Your Content",
    description:
      "Drop any image, text, video, or audio into our platform. Supports all major formats and batch uploads.",
    icon: <Folders />,
  },
  {
    number: "02",
    title: "AI Analyzes Instantly",
    description:
      "Our multi-model ensemble scans for deepfakes, GAN artifacts, text patterns, and audio manipulation signatures.",
    icon: <ScanText />,
  },
  {
    number: "03",
    title: "Get Your Report",
    description:
      "Receive a detailed authenticity breakdown with confidence scores, heatmaps, and actionable insights.",
    icon: <ReportIcon />,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
} as const;

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ position: "relative" }}>
      <div className="section" style={{ textAlign: "center" }}>
        <span className="section-label">How It Works</span>
        <h2 className="section-title" style={{ margin: "0 auto 0.75rem" }}>
          Three Steps to Truth
        </h2>
        <p
          className="section-subtitle"
          style={{ margin: "0 auto 4rem", textAlign: "center" }}
        >
          From upload to insight in seconds — no expertise required.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            position: "relative",
          }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="glass-card"
              style={{
                padding: "2.5rem 2rem",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                {step.icon}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: "#5c5f73",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                STEP {step.number}
              </div>
              <h3
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                  color: "#f0f0f5",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#8b8fa3",
                  lineHeight: 1.6,
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
