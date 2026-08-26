"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CyberGrid from "@/components/ui/CyberGrid";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";
import MagneticButton from "@/components/ui/MagneticButton";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected errors
    console.error("Critical Runtime Sector Failure:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-main text-slate-100 selection:bg-cyber-blue selection:text-black relative overflow-x-hidden font-sans flex flex-col justify-between">
      <CyberGrid />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-6">
        <Navbar />
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 sm:py-16 flex flex-col items-center justify-center my-auto">
        <CyberCardBorder className="w-full shadow-2xl" contentClassName="p-6 sm:p-10 flex flex-col items-center text-center relative">
          <ScanlineOverlay opacity="opacity-[0.06]" />

          {/* Fault Indicator Chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-amber-400 -ml-4" />
            <span>ERR_RUNTIME_EXCEPTION // 500</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wider uppercase mb-3">
            SECTOR EXCEPTION ENCOUNTERED
          </h1>

          <p className="text-text-muted text-xs sm:text-sm max-w-md leading-relaxed font-mono mb-6">
            A pipeline deadlock or unexpected execution state occurred while processing this request. The subsystem is attempting recovery.
          </p>

          {/* Error Diagnostics Terminal */}
          <div className="w-full max-w-md bg-[#030712] border border-card-border rounded-lg p-4 font-mono text-xs text-left mb-8 space-y-1.5 shadow-inner">
            <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-card-border/50">
              <span>// EXCEPTION TRACE</span>
              <span className="text-amber-400 font-semibold">SIGSEGV / INTERRUPT</span>
            </div>
            <div className="text-slate-400 truncate">
              <span className="text-cyber-blue">message:</span> {error.message || "An unknown runtime failure occurred."}
            </div>
            {error.digest && (
              <div className="text-slate-400">
                <span className="text-cyber-blue">digest_hash:</span> {error.digest}
              </div>
            )}
            <div className="text-slate-400">
              <span className="text-cyber-blue">recovery_policy:</span> AUTO_REINITIALIZE
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton strength={15}>
              <button
                onClick={() => reset()}
                className="px-6 py-2.5 rounded-lg bg-cyber-blue text-black font-mono text-xs sm:text-sm font-bold tracking-wider uppercase hover:bg-cyber-blue-light transition-all shadow-[0_0_15px_rgba(0,136,255,0.4)] flex items-center gap-2 cursor-pointer"
              >
                <span>Reboot Sector (Retry)</span>
              </button>
            </MagneticButton>

            <MagneticButton strength={15}>
              <Link
                href="/"
                className="px-6 py-2.5 rounded-lg bg-card-bg border border-card-border hover:border-cyber-blue/60 text-white font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all"
              >
                <span>Root Gateway</span>
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
