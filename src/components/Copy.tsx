"use client";

import type { Transition } from "motion/react";
import { motion } from "motion/react";

interface ClipboardCopyProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const Copy = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}: ClipboardCopyProps) => {
  return (
    <div
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        <path d="M16 4h2a2 2 0 0 1 2 2v4" />
        <path d="M21 14H11" />

        {/* No animation, static arrow */}
        <path d="m15 10-4 4 4 4" />
      </svg>
    </div>
  );
};

export { Copy };
