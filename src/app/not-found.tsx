"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CyberGrid from "@/components/ui/CyberGrid";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";
import MagneticButton from "@/components/ui/MagneticButton";
import CipherReveal from "@/components/ui/CipherReveal";

export default function NotFound() {
  const [ipAddress] = useState(() => {
    const seg1 = Math.floor(Math.random() * 150) + 50;
    const seg2 = Math.floor(Math.random() * 200) + 10;
    return `192.${seg1}.${seg2}.108`;
  });

  return (
    <div className="min-h-screen bg-bg-main text-slate-100 selection:bg-cyber-blue selection:text-black relative overflow-x-hidden font-sans flex flex-col justify-between">
      <CyberGrid />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-6">
        <Navbar />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 sm:py-16 flex flex-col items-center justify-center my-auto">
        <CyberCardBorder className="w-full shadow-2xl" contentClassName="p-6 sm:p-10 flex flex-col items-center text-center relative">
          <ScanlineOverlay opacity="opacity-[0.05]" />

          {/* Glitch Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/40 text-red-400 font-mono text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-red-500 -ml-4" />
            <span>ERR_TARGET_NOT_FOUND // 404</span>
          </div>

          {/* Big Glitch 404 Headline */}
          <div className="relative mb-4 select-none">
            <h1 className="font-mono text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 drop-shadow-[0_0_25px_rgba(0,136,255,0.3)]">
              404
            </h1>
            <div className="absolute inset-0 font-mono text-7xl sm:text-9xl font-black tracking-tighter text-red-500/20 translate-x-[2px] translate-y-[2px] blur-[1px] pointer-events-none" aria-hidden="true">
              404
            </div>
            <div className="absolute inset-0 font-mono text-7xl sm:text-9xl font-black tracking-tighter text-cyber-blue/30 -translate-x-[2px] -translate-y-[2px] blur-[1px] pointer-events-none" aria-hidden="true">
              404
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wider uppercase mb-3">
            <CipherReveal text="ACCESS VECTOR UNRESOLVED" duration={450} />
          </h2>

          <p className="text-text-muted text-sm sm:text-base max-w-lg leading-relaxed font-mono mb-8">
            The requested sub-routine, payload, or route does not exist on this sector. It may have been quarantined, moved, or scrubbed from the active registry.
          </p>

          {/* Diagnostic Console Box */}
          <div className="w-full max-w-lg bg-[#030712] border border-card-border rounded-lg p-4 font-mono text-xs text-left mb-8 space-y-1.5 shadow-inner">
            <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-card-border/50">
              <span>{"// SYSTEM DIAGNOSTICS"}</span>
              <span className="text-red-400 font-semibold">STATUS: ANOMALY</span>
            </div>
            <div className="text-slate-400">
              <span className="text-cyber-blue">origin_ip:</span> {ipAddress}
            </div>
            <div className="text-slate-400">
              <span className="text-cyber-blue">protocol:</span> HTTPS/TLS 1.3
            </div>
            <div className="text-slate-400">
              <span className="text-cyber-blue">threat_level:</span> LOW [NON-MALICIOUS TRAFFIC]
            </div>
            <div className="text-slate-400">
              <span className="text-cyber-blue">suggested_action:</span> RETURN_TO_ROOT_GATEWAY
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton strength={15}>
              <Link
                href="/"
                className="px-6 py-2.5 rounded-lg bg-cyber-blue text-black font-mono text-xs sm:text-sm font-bold tracking-wider uppercase hover:bg-cyber-blue-light transition-all shadow-[0_0_15px_rgba(0,136,255,0.4)] flex items-center gap-2"
              >
                <span>&larr; Return to Root</span>
              </Link>
            </MagneticButton>

            <MagneticButton strength={15}>
              <Link
                href="/events"
                className="px-6 py-2.5 rounded-lg bg-card-bg border border-card-border hover:border-cyber-blue/60 text-white font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all"
              >
                <span>View Operations</span>
              </Link>
            </MagneticButton>
          </div>
        </CyberCardBorder>
      </main>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pb-8">
        <Footer />
      </div>
    </div>
  );
}
