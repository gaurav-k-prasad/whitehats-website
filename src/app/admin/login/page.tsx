"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, AlertTriangle } from "lucide-react";
import CyberGrid from "@/components/ui/CyberGrid";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";
import CipherReveal from "@/components/ui/CipherReveal";
import MagneticButton from "@/components/ui/MagneticButton";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Credentials required to establish command session.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed: Access Denied");
        setLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("Network or server connection disrupted.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <CyberGrid />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <CyberCardBorder className="shadow-2xl" contentClassName="p-6 sm:p-8 flex flex-col gap-6">
          <ScanlineOverlay opacity="opacity-[0.04]" />

          {/* Header */}
          <div className="flex flex-col items-center text-center gap-3 border-b border-card-border pb-6">
            <div className="w-12 h-12 rounded-xl border border-cyber-blue/40 bg-cyber-blue/10 flex items-center justify-center text-cyber-blue shadow-neon-blue">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 font-mono text-xs text-cyber-blue tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-cyber-blue animate-ping" />
                <CipherReveal text="// RESTRICTED ACCESS" duration={400} />
              </div>
              <h1 className="text-xl sm:text-2xl font-mono font-bold text-white mt-1">
                OPERATOR VAULT
              </h1>
            </div>
            <p className="text-xs font-mono text-slate-400 max-w-xs">
              Authenticate with authorized WhiteHats administrative credentials to proceed.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2.5 p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyber-blue" />
                <span>OPERATOR ID / EMAIL</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@whitehats.club"
                className="w-full rounded-lg bg-[#030712] border border-[#1E293B] px-3.5 py-2.5 text-sm text-slate-100 font-mono placeholder:text-slate-600 outline-none focus:border-cyber-blue/70 focus:shadow-[0_0_0_3px_rgba(0,136,255,0.15)] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyber-blue" />
                <span>SECURITY CIPHER (PASSWORD)</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg bg-[#030712] border border-[#1E293B] px-3.5 py-2.5 text-sm text-slate-100 font-mono placeholder:text-slate-600 outline-none focus:border-cyber-blue/70 focus:shadow-[0_0_0_3px_rgba(0,136,255,0.15)] transition-all"
              />
            </div>

            <div className="pt-2">
              <MagneticButton className="w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center text-sm py-3 px-4 rounded-lg bg-cyber-blue text-black font-mono font-bold hover:bg-cyber-blue-light flex items-center justify-center gap-2 shadow-neon-blue transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                      AUTHENTICATING...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>INITIALIZE SESSION</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </MagneticButton>
            </div>
          </form>
        </CyberCardBorder>
      </motion.div>
    </div>
  );
}
