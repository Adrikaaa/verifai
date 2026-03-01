"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "Features", href: "#how-it-works" },
  { label: "Docs", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? "rgba(0, 0, 0, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255, 255, 255, 0.06)"
          : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        {/* Logo */}
        {/* Logo */}
        <a
          href="#"
          id="navbar-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
          }}
        >
          <img
            src="/logo.png" // <-- change path if needed
            alt="Verif.Ai"
            style={{
              height: "32px", // size of your PNG
              objectFit: "contain",
            }}
          />
        </a>
        {/* Desktop Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.25rem",
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#8b8fa3",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f5")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8b8fa3")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div
          className="hidden md:flex"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <Link
            href="/signup"
            id="nav-signin"
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#8b8fa3",
              textDecoration: "none",
              transition: "color 0.2s ease",
              padding: "0.5rem 0.75rem",
            }}
            onMouseEnter={(e: any) => (e.currentTarget.style.color = "#f0f0f5")}
            onMouseLeave={(e: any) => (e.currentTarget.style.color = "#8b8fa3")}
          >
            Sign in
          </Link>
          <Link
            href="/#pricing"
            id="nav-get-started"
            style={{
              padding: "0.55rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#fff",
              background: "#3653E1",
              borderRadius: "9999px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 12px rgba(54, 83, 225, 0.3)",
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.background = "#2A45C9";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(54, 83, 225, 0.4)";
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.background = "#3653E1";
              e.currentTarget.style.boxShadow =
                "0 2px 12px rgba(54, 83, 225, 0.3)";
            }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            color: "#f0f0f5",
            cursor: "pointer",
            padding: "0.5rem",
          }}
          aria-label="Toggle mobile menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            style={{
              background: "rgba(0, 0, 0, 0.97)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              padding: "1rem 1.5rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#8b8fa3",
                  textDecoration: "none",
                  padding: "0.5rem 0",
                }}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/#pricing"
              onClick={() => setMobileOpen(false)}
              style={{
                textAlign: "center",
                marginTop: "0.5rem",
                padding: "0.75rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#fff",
                background: "#3653E1",
                borderRadius: "9999px",
                textDecoration: "none",
              }}
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
