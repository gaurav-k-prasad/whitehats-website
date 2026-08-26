"use client";

import React from "react";
import CyberGrid from "@/components/ui/CyberGrid";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";

export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-main text-slate-100 selection:bg-cyber-blue selection:text-black relative overflow-hidden font-sans flex flex-col items-center justify-center">
      <CyberGrid />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 p-8 max-w-sm w-full">
        <ScanlineOverlay opacity="opacity-[0.03]" />

        {/* Cyber Radar / Pulse Loader */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div className="absolute inset-0 rounded-full border border-cyber-blue/30 border-dashed animate-spin [animation-duration:8s]" />
          
          {/* Middle counter-rotating ring */}
          <div className="absolute inset-2 rounded-full border border-cyber-blue/50 border-t-transparent border-b-transparent animate-spin [animation-duration:3s] [animation-direction:reverse]" />

          {/* Glowing pulse ring */}
          <div className="absolute inset-4 rounded-full bg-cyber-blue/10 animate-ping [animation-duration:2s]" />

          {/* Central core node */}
          <div className="relative w-6 h-6 rounded-full bg-cyber-blue shadow-[0_0_15px_#0088FF] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </div>
        </div>

        {/* Text and animated stream */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="font-mono text-sm font-bold text-cyber-blue tracking-[0.25em] uppercase flex items-center gap-1">
            <span>INITIALIZING SECTOR</span>
            <span className="inline-block animate-bounce">.</span>
            <span className="inline-block animate-bounce [animation-delay:0.2s]">.</span>
            <span className="inline-block animate-bounce [animation-delay:0.4s]">.</span>
          </div>

          <div className="font-mono text-[11px] text-slate-500 tracking-wider">
            {"// DECRYPTING_ASSETS • ESTABLISHING_SOCKET"}
          </div>
        </div>

        {/* Progress scan bar */}
        <div className="w-48 h-1 bg-[#0B1120] border border-card-border rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyber-blue to-transparent animate-[shimmer_1.5s_infinite] shadow-[0_0_8px_#0088FF]" />
        </div>
      </div>
    </div>
  );
}
