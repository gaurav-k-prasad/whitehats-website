"use client";

import React, { useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";

export default function ContributeBanner() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full"
    >
      <CyberCardBorder
        isHovered={isHovered}
        className="w-full shadow-xl"
        contentClassName="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative"
      >
        <ScanlineOverlay opacity="opacity-[0.03]" />

        {/* Background Matrix/Subtle Glow */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-cyber-blue/5 blur-2xl pointer-events-none" />

        {/* Left Info: Prompt & Description */}
        <div className="flex items-start gap-4 z-10">
          <div className="w-10 h-10 rounded-lg bg-[#030712] border border-cyber-blue/40 flex items-center justify-center text-cyber-blue font-mono font-bold shrink-0 shadow-[0_0_10px_rgba(0,136,255,0.2)]">
            &gt;_
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-mono font-bold text-base sm:text-lg text-white">
              Have an idea worth building?
            </h3>
            <p className="text-[#94A3B8] text-xs sm:text-sm max-w-xl">
              Contribute to our projects and help us build a safer digital world. We welcome pull requests, security audits, and novel research.
            </p>
          </div>
        </div>

        {/* Right Button with Magnetic attraction */}
        <div className="z-10 shrink-0 self-start sm:self-center">
          <MagneticButton strength={20}>
            <a
              href="https://github.com/TheWhitehatsclub-vit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-cyber-blue/80 bg-cyber-blue/15 hover:bg-cyber-blue text-cyber-blue hover:text-black font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-neon-blue cursor-pointer whitespace-nowrap"
            >
              <span>Contribute With Us</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </MagneticButton>
        </div>
      </CyberCardBorder>
    </div>
  );
}
