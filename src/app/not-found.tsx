"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
});

export default function NotFoundPage() {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Antigravity
          count={180}
          magnetRadius={3}
          ringRadius={3}
          waveSpeed={0.1}
          waveAmplitude={0.5}
          particleSize={0.75}
          lerpSpeed={0.02}
          color="#A855F7"
          autoAnimate
          particleVariance={0.6}
          rotationSpeed={0.05}
          depthFactor={1.2}
          pulseSpeed={1.1}
          particleShape="capsule"
          fieldStrength={5}
          followMouse
          mouseStrength={0.7}
          motionIntensity={0.5}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center mb-8"
        >
          <img
            src="/404-illustration.png"
            alt="Not Found"
            style={{ width: "260px", opacity: 0.9 }}
          />
        </motion.div>

        {/* Title */}
        <h1
          style={{
            fontSize: "2.6rem",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            marginBottom: "12px",
          }}
        >
          Page Not Found
        </h1>

        {/* Subtitle */}
        <p
          style={{
            maxWidth: 420,
            margin: "0 auto",
            color: "#8b8fa3",
            fontSize: "1rem",
            lineHeight: 1.6,
            marginBottom: "32px",
          }}
        >
          The page you're looking for doesn’t exist or may have been moved.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              background: "#3b82f6",
              color: "#fff",
              fontWeight: 500,
              fontSize: "0.95rem",
            }}
          >
            Go Home →
          </Link>

          <Link
            href="/dashboard"
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              background: "transparent",
              border: "1px solid #333",
              color: "#8b8fa3",
              fontWeight: 500,
              fontSize: "0.95rem",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
