"use client";

import React from "react";

export default function ProjectHeroGraphic() {
  return (
    <div className="relative w-full rounded-xl border border-card-border bg-[#050A15]/95 shadow-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-6 overflow-hidden">
      {/* Glow Halo Backdrop */}
      <div className="absolute inset-0 bg-cyber-blue/10 blur-3xl rounded-full pointer-events-none" />

      {/* 3D Cyber Cube Container */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center shrink-0">
        {/* Outer Rotating Radar Ring */}
        <div className="absolute inset-1 border border-cyber-blue/20 rounded-full border-dashed animate-spin [animation-duration:25s] pointer-events-none" />
        <div className="absolute inset-5 border border-cyber-blue-light/15 rounded-full pointer-events-none shadow-[0_0_20px_rgba(0,136,255,0.2)]" />

        {/* 3D Cube Isometric Graphic */}
        <div className="relative z-10 w-24 h-24 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_0_25px_rgba(0,136,255,0.7)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Face */}
            <polygon
              points="100,30 165,65 100,100 35,65"
              fill="url(#cubeTopGrad)"
              stroke="#33A9FF"
              strokeWidth="1.5"
            />
            {/* Left Face */}
            <polygon
              points="35,65 100,100 100,175 35,140"
              fill="url(#cubeLeftGrad)"
              stroke="#0088FF"
              strokeWidth="1.5"
            />
            {/* Right Face */}
            <polygon
              points="100,100 165,65 165,140 100,175"
              fill="url(#cubeRightGrad)"
              stroke="#0088FF"
              strokeWidth="1.5"
            />

            {/* Code Emblems on faces */}
            <text
              x="68"
              y="125"
              fill="#33A9FF"
              fontSize="18"
              fontWeight="bold"
              fontFamily="monospace"
              opacity="0.9"
              transform="rotate(-15 68 125) skewY(20)"
            >
              &lt;/&gt;
            </text>
            <text
              x="122"
              y="140"
              fill="#33A9FF"
              fontSize="18"
              fontWeight="bold"
              fontFamily="monospace"
              opacity="0.9"
              transform="rotate(15 122 140) skewY(-20)"
            >
              &lt;/&gt;
            </text>

            <defs>
              <linearGradient id="cubeTopGrad" x1="100" y1="30" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#33A9FF" stopOpacity="0.8" />
                <stop stopColor="#0088FF" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="cubeLeftGrad" x1="35" y1="65" x2="100" y2="175" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0088FF" stopOpacity="0.7" />
                <stop stopColor="#030712" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="cubeRightGrad" x1="165" y1="65" x2="100" y2="175" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0055AA" stopOpacity="0.7" />
                <stop stopColor="#0B1120" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Diagnostic Status Lines */}
      <div className="flex flex-col gap-2 font-mono text-xs tracking-wide">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-cyber-blue font-bold">&gt;</span>
          <span>scanning repos...</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-cyber-blue font-bold">&gt;</span>
          <span>compiling modules...</span>
        </div>
        <div className="flex items-center gap-2 text-cyber-blue-light font-semibold">
          <span className="text-cyber-blue font-bold">&gt;</span>
          <span>securing tomorrow.</span>
        </div>
      </div>
    </div>
  );
}
