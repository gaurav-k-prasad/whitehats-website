"use client";

import React from "react";

interface ScanlineOverlayProps {
  className?: string;
  opacity?: string;
}

export default function ScanlineOverlay({
  className = "",
  opacity = "opacity-[0.04]",
}: ScanlineOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none z-20 overflow-hidden ${opacity} ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 136, 255, 0.4) 2px, rgba(0, 136, 255, 0.4) 4px)",
      }}
    />
  );
}
