"use client";

import { motion } from "framer-motion";
import { Chrome, Download, Shield, Globe, Compass, Monitor } from "lucide-react";

interface ExtensionPromptProps {
  title?: string;
  description?: string;
  compact?: boolean;
}

export default function ExtensionPrompt({ 
  title = "Real-Time Protection in Your Browser",
  description = "Add our browser extension to detect AI content instantly while browsing social media, news sites, and messaging platforms.",
  compact = false 
}: ExtensionPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-card"
      style={{
        padding: compact ? "1.2rem" : "1.5rem",
        marginTop: "2rem",
        textAlign: "center",
        border: "1px solid rgba(168, 85, 247, 0.3)",
        background: "rgba(168, 85, 247, 0.08)",
        boxShadow: "0 0 15px rgba(168, 85, 247, 0.15)",
        maxWidth: "800px",
        margin: "2rem auto 0",
      }}
    >
      {/* Browser Icons */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "1rem", 
        marginBottom: "1rem",
        flexWrap: "wrap"
      }}>
        {[
          { icon: <Chrome size={20} />, name: "Chrome", color: "#4285F4" },
          { icon: <Globe size={20} />, name: "Firefox", color: "#FF6611" },
          { icon: <Compass size={20} />, name: "Safari", color: "#006CFF" },
          { icon: <Monitor size={20} />, name: "Edge", color: "#0078D4" }
        ].map((browser) => {
          const bgColor1 = browser.color + "20";
          const bgColor2 = browser.color + "40";
          const borderColor = browser.color + "40";
          const shadowColor = browser.color + "30";
          
          return (
            <div
              key={browser.name}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${bgColor1}, ${bgColor2})`,
                border: `1px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 2px 10px ${shadowColor}`,
                transition: "all 0.3s ease",
              }}
              title={browser.name}
            >
              <div style={{ color: browser.color }}>
                {browser.icon}
              </div>
            </div>
          );
        })}
      </div>

      <h3
        style={{
          fontSize: compact ? "1rem" : "1.1rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          color: "#f8fafc",
          background: "linear-gradient(135deg, #a855f7, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "0.85rem",
          color: "#cbd5e1",
          lineHeight: 1.5,
          marginBottom: "1rem",
          maxWidth: "500px",
          margin: "0 auto 1rem",
        }}
      >
        {description}
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(168, 85, 247, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.2rem",
            fontSize: "0.85rem",
            fontWeight: 600,
            background: "linear-gradient(135deg, #a855f7, #3b82f6)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
          onClick={() => {
            // Open Chrome Web Store or extension download
            window.open("#", "_blank");
          }}
        >
          <Download size={14} />
          Add Extension
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "rgba(168, 85, 247, 0.15)" }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.2rem",
            fontSize: "0.85rem",
            fontWeight: 600,
            background: "rgba(168, 85, 247, 0.08)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            borderRadius: "8px",
            color: "#f8fafc",
            cursor: "pointer",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
          onClick={() => {
            // Scroll to extension section or open documentation
            document.getElementById("extension")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Shield size={14} />
          Learn More
        </motion.button>
      </div>

      <div
        style={{
          marginTop: "0.75rem",
          fontSize: "0.75rem",
          color: "#94a3b8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <Shield size={12} />
        <span>Free for personal use • Works on all major browsers</span>
      </div>
    </motion.div>
  );
}
