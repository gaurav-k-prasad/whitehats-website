"use client";

import React from "react";
import { motion } from "framer-motion";

const DOMAINS = [
  { name: "RESEARCH & EXPLOITATION", status: "ONLINE", code: "SEC-01" },
  { name: "OFFENSIVE RED TEAMING", status: "ACTIVE", code: "OPS-02" },
  { name: "INFRASTRUCTURE & DEVSECOPS", status: "OPTIMAL", code: "INF-03" },
  { name: "COMMUNITY & DIRECTIVES", status: "ONLINE", code: "COM-04" },
];

export default function BoardHeroGraphic() {
  return (
    <div className="relative w-full rounded-xl border border-card-border bg-[#050A15]/95 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#030712] border-b border-card-border text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[11px] text-slate-500">executive-matrix@whitehats</span>
        </div>
        <span className="text-[10px] text-cyber-blue font-bold tracking-wider">
          AUTH_LEVEL_5
        </span>
      </div>

      {/* Body Area */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-[11px]">
          <span className="text-cyber-blue-light font-bold tracking-wider">
            // DOMAIN DIRECTIVES STATUS
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SYNCHRONIZED
          </span>
        </div>

        {/* Domains List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {DOMAINS.map((domain, i) => (
            <motion.div
              key={domain.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.35 }}
              className="p-2.5 rounded-lg bg-[#030712] border border-[#1E293B] flex flex-col gap-1"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>{domain.code}</span>
                <span className="text-cyber-blue font-bold">{domain.status}</span>
              </div>
              <span className="text-slate-200 font-semibold text-[11px] tracking-tight">
                {domain.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Telemetry Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1E293B] text-[10px] text-slate-500">
          <span>COUNCIL: ACTIVE</span>
          <span className="text-slate-400">ENCRYPT: ECDSA-P384</span>
        </div>
      </div>
    </div>
  );
}
