"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
});

export default function Signup() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {};

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* 🔵 Black background */}
      <div className="absolute inset-0 z-0" style={{ background: "#000" }} />

      {/* 🔹 Antigravity Layers (UNCHANGED) */}
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

      {/* ✨ LOGIN CARD */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-semibold text-white text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Login to continue to your account
          </p>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Button */}
          <button
            onClick={onLogin}
            className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-900/40"
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="px-3 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Signup Link */}
          <p className="text-center text-gray-400 text-sm">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-purple-500 hover:text-purple-400 transition"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
