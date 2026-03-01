"use client";
import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
});

export default function Login() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Black background */}
      <div className="absolute inset-0 z-0" style={{ background: "#000" }} />

      {/* Antigravity Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <div className="absolute inset-0 opacity-90"></div>

        <div className="absolute inset-0 opacity-95">
          <Antigravity
            count={120}
            magnetRadius={3}
            ringRadius={3}
            waveSpeed={0.08}
            waveAmplitude={0.4}
            particleSize={0.8}
            lerpSpeed={0.015}
            color="#A855F7"
            autoAnimate
            particleVariance={0.5}
            rotationSpeed={0.05}
            depthFactor={0.8}
            pulseSpeed={1}
            particleShape="capsule"
            fieldStrength={4}
            followMouse={true}
            mouseStrength={0.6}
            motionIntensity={0.4}
          />
        </div>
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-8 z-20">
        <a href="/" style={{ textDecoration: "none" }}>
          <img
            src="/logo.png"
            alt="Verif.Ai"
            style={{ height: "32px", objectFit: "contain" }}
          />
        </a>
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-semibold text-white text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Login to continue to your account
          </p>

          {/* Auth0 Login */}
          <a
            href="/auth/login"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              background: "#1d4ed8",
              color: "#fff",
              fontWeight: 500,
              marginBottom: "16px",
              transition: "background 0.2s",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Continue with Auth0
          </a>

          <p className="text-center text-gray-500 text-xs mb-6">
            Secure authentication powered by Auth0
          </p>

          <p className="text-center text-gray-400 text-sm">
            {"Don't have an account? "}
            <a
              href="/auth/login?screen_hint=signup"
              style={{ color: "#a855f7", textDecoration: "none" }}
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
