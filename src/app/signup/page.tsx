"use client";
import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
});

export default function Signup() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Black Background */}
      <div className="absolute inset-0 z-0 bg-black" />

      {/* Antigravity (UNCHANGED) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <div className="absolute inset-0 opacity-90">
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
        <Link href="/">
          <img src="/logo.png" alt="Verif.Ai" className="h-8 object-contain" />
        </Link>
      </div>

      {/* Signup Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-semibold text-white text-center mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Join Verif.AI and get started
          </p>

          {/* Auth0 Signup */}
          <a
            href="/auth/login?screen_hint=signup"
            className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-900/40 mb-4"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Create Account with Auth0
          </a>

          <p className="text-center text-gray-500 text-xs mb-6">
            Secure authentication powered by Auth0
          </p>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-purple-500 hover:text-purple-400 transition"
              style={{ textDecoration: "none" }}
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
