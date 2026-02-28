"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Black background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#000",
          minHeight: "100vh"
        }}
      />

      {/* Antigravity Layer with original settings */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <Antigravity
          count={120}
          magnetRadius={3}
          ringRadius={3}
          waveSpeed={0.08}
          waveAmplitude={0.4}
          particleSize={0.25}
          lerpSpeed={0.015}
          color="#3b82f6"
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

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main className="w-full">
          <Hero />
          <HowItWorks />
          <Features />
          <UseCases />
          <Pricing />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
