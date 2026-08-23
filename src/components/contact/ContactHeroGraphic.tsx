"use client";

import React from "react";
import { motion } from "framer-motion";

const LOG_LINES = [
  { label: "HANDSHAKE", status: "OK" },
  { label: "TLS_1_3", status: "SECURE" },
  { label: "ROUTE", status: "whitehats@club" },
  { label: "QUEUE", status: "READY" },
];

export default function ContactHeroGraphic() {
  return (
    <div className="relative w-full rounded-xl border border-card-border bg-[#050A15]/95 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#030712] border-b border-card-border text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[11px] text-slate-500">inbox@whitehats</span>
        </div>
        <span className="text-[10px] text-cyber-blue font-bold tracking-wider">
          SECURE_LINK
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-[11px]">
          <span className="text-cyber-blue-light font-bold tracking-wider">
            // CHANNEL DIAGNOSTICS
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {LOG_LINES.map((line, i) => (
            <motion.div
              key={line.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.35 }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#030712] border border-[#1E293B]"
            >
              <span className="text-[10px] text-slate-500 tracking-widest">{line.label}</span>
              <span className="text-slate-200 font-semibold text-[11px]">{line.status}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#1E293B] text-[10px] text-slate-500">
          <span>PING: 12ms</span>
          <span className="text-slate-400">ENCRYPT: AES-256-GCM</span>
        </div>
      </div>
    </div>
  );
}
