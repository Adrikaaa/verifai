"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Start detecting with basic tools",
    features: [
      "10 scans/day",
      "Image & text detection",
      "Basic reports",
      "Browser extension",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Normal",
    price: "$9",
    period: "/month",
    description: "Great for regular users needing better accuracy",
    features: [
      "100 scans/day",
      "All media types",
      "Enhanced reports",
      "API access (1K calls/mo)",
      "Priority queue",
    ],
    cta: "Upgrade to Normal",
    highlighted: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

export default function Pricing() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <section id="pricing" style={{ position: "relative" }}>
      <div className="section" style={{ textAlign: "center" }}>
        <span className="section-label">Pricing</span>
        <h2 className="section-title" style={{ margin: "0 auto 0.75rem" }}>
          Simple Pricing for Everyone
        </h2>
        <p
          className="section-subtitle"
          style={{ margin: "0 auto 4rem", textAlign: "center" }}
        >
          Start for free. Upgrade if you need more.
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
            alignItems: "start",
          }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className="glass-card"
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{
                padding: "2.5rem 2rem",
                textAlign: "left",
                position: "relative",
                borderColor: plan.highlighted
                  ? "rgba(82, 39, 255, 0.3)"
                  : hoveredPlan === plan.name
                    ? "rgba(255, 255, 255, 0.12)"
                    : undefined,
              }}
            >
              {plan.highlighted && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#5227FF",
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "0.3rem 1rem",
                    borderRadius: "9999px",
                  }}
                >
                  Best Value
                </div>
              )}

              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "#f0f0f5",
                }}
              >
                {plan.name}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#5c5f73",
                  marginBottom: "1.5rem",
                }}
              >
                {plan.description}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.25rem",
                  marginBottom: "2rem",
                }}
              >
                <span
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: "#f0f0f5",
                    letterSpacing: "-0.04em",
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  }}
                >
                  {plan.price}
                </span>
                <span style={{ fontSize: "0.9rem", color: "#5c5f73" }}>
                  {plan.period}
                </span>
              </div>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      fontSize: "0.9rem",
                      color: "#8b8fa3",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3EF2C5"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={
                  plan.name === "Free" ? "/signup" : "/checkout?plan=normal"
                }
                className={plan.highlighted ? "btn-primary" : "btn-secondary"}
                style={{
                  width: "100%",
                  textAlign: "center",
                  ...(plan.highlighted
                    ? {
                        background: "#5227FF",
                        boxShadow: "0 2px 16px rgba(82, 39, 255, 0.3)",
                      }
                    : {}),
                }}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
