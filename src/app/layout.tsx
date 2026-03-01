import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Auth0Provider from "@/components/Auth0Provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "verif.Ai — Truth in the Age of AI",
  description:
    "Instantly verify the authenticity of images, videos, audio, and text. Detect AI-generated content with our powerful multi-modal detection engine. Try verif.Ai free.",
  keywords: [
    "AI detection",
    "deepfake detector",
    "content authenticity",
    "AI image detection",
    "fact checking",
    "verif.ai",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Auth0Provider>{children}</Auth0Provider>
      </body>
    </html>
  );
}
