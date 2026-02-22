"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Newspaper,
  Palette,
  Scale,
} from "lucide-react";

const useCases = [
  {
    title: "Journalism & Media",
    description:
      "Verify source material authenticity before publication. Protect editorial integrity.",
    icon: <Newspaper />,
  },
  {
    title: "Brands & Marketing",
    description:
      "Monitor for fake endorsements, manipulated reviews, and counterfeit content.",
    icon: <Building2 />,
  },
  {
    title: "Education",
    description:
      "Detect AI-generated assignments, preserve academic integrity across institutions.",
    icon: <GraduationCap />,
  },
  {
    title: "HR & Recruitment",
    description:
      "Verify candidate submissions, screen for AI-generated cover letters and portfolios.",
    icon: <BriefcaseBusiness />,
  },
  {
    title: "Legal & Compliance",
    description:
      "Authenticate evidence, verify document integrity for legal proceedings.",
    icon: <Scale />,
  },
  {
    title: "Content Creators",
    description:
      "Prove your work is original. Protect your intellectual property from AI theft.",
    icon: <Palette />,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
} as const;

export default function UseCases() {
  return (
    <section id="use-cases" style={{ position: "relative" }}>
      <div className="section" style={{ textAlign: "center" }}>
        <span className="section-label">Use Cases</span>
        <h2 className="section-title" style={{ margin: "0 auto 0.75rem" }}>
          Built for Every Industry
        </h2>
        <p
          className="section-subtitle"
          style={{ margin: "0 auto 4rem", textAlign: "center" }}
        >
          From newsrooms to classrooms — verif.Ai adapts to your workflow.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {useCases.map((uc) => (
            <motion.div
              key={uc.title}
              variants={itemVariants}
              className="glass-card"
              style={{
                padding: "2rem",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                {uc.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "#f0f0f5",
                }}
              >
                {uc.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#8b8fa3",
                  lineHeight: 1.6,
                }}
              >
                {uc.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
