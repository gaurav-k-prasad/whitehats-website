"use client";

import React, { useState } from "react";

interface CyberCardBorderProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  isHovered?: boolean;
}

export default function CyberCardBorder({
  children,
  className = "",
  contentClassName = "",
  isHovered: externalHovered,
}: CyberCardBorderProps) {
  const [internalHovered, setInternalHovered] = useState(false);
  const hovered = externalHovered !== undefined ? externalHovered : internalHovered;

  return (
    <div
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
      className={`relative rounded-xl overflow-hidden bg-card-bg border border-card-border transition-colors duration-300 ${
        hovered ? "border-cyber-blue/60" : "border-card-border"
      } ${className}`}
    >
      {/* 1. Corner Targeting Brackets */}
      <div className="absolute top-0 left-0 w-3.5 h-3.5 pointer-events-none z-20">
        <svg className="w-full h-full" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 13V1H13"
            stroke={hovered ? "#33A9FF" : "#0088FF"}
            strokeWidth="2"
            strokeOpacity={hovered ? 1 : 0.6}
            className="transition-colors duration-200"
          />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-3.5 h-3.5 pointer-events-none z-20">
        <svg className="w-full h-full" viewBox="0 0 14 14" fill="none">
          <path
            d="M13 13V1H1"
            stroke={hovered ? "#33A9FF" : "#0088FF"}
            strokeWidth="2"
            strokeOpacity={hovered ? 1 : 0.6}
            className="transition-colors duration-200"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-3.5 h-3.5 pointer-events-none z-20">
        <svg className="w-full h-full" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 1V13H13"
            stroke={hovered ? "#33A9FF" : "#0088FF"}
            strokeWidth="2"
            strokeOpacity={hovered ? 1 : 0.6}
            className="transition-colors duration-200"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 pointer-events-none z-20">
        <svg className="w-full h-full" viewBox="0 0 14 14" fill="none">
          <path
            d="M13 1V13H1"
            stroke={hovered ? "#33A9FF" : "#0088FF"}
            strokeWidth="2"
            strokeOpacity={hovered ? 1 : 0.6}
            className="transition-colors duration-200"
          />
        </svg>
      </div>

      {/* 2. Liquid Perimeter Line Tracing on Hover */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 rounded-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="12"
          stroke="#0088FF"
          strokeWidth="1.5"
          strokeDasharray="80 160"
          className="transition-all duration-700 ease-out"
          style={{
            strokeDashoffset: hovered ? 0 : 240,
            opacity: hovered ? 0.9 : 0,
            filter: "drop-shadow(0 0 8px #0088FF)",
          }}
        />
      </svg>

      {/* Child Content */}
      <div className={`relative z-10 w-full h-full ${contentClassName}`}>{children}</div>
    </div>
  );
}
