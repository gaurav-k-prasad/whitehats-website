"use client";

import React from "react";
import { motion } from "framer-motion";
import { GALLERY_ITEMS } from "@/data/galleryData";

export default function GalleryHeroGraphic() {
  return (
    <div className="relative w-full rounded-xl border border-card-border bg-[#050A15]/95 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#030712] border-b border-card-border text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[11px] text-slate-500">archival-scanner@whitehats</span>
        </div>
        <span className="text-[10px] text-cyber-blue font-bold tracking-wider">
          INDEX_VAULT
        </span>
      </div>

      {/* Body Area */}
      <div className="p-5 flex flex-col gap-4">
        {/* Reticle Scanner Graphic */}
        <div className="relative h-28 w-full rounded-lg bg-[#030712] border border-[#1E293B] flex items-center justify-center overflow-hidden">
          {/* Subtle Grid Matrix */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] bg-[size:14px_14px] opacity-60" />

          {/* Animated Scanning Crosshair Line */}
          <motion.div
            animate={{ y: [-40, 40, -40] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent shadow-[0_0_10px_#0088FF]"
          />

          {/* Center Target Box */}
          <div className="relative z-10 w-16 h-16 border border-cyber-blue/40 rounded flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-ping" />
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyber-blue" />
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyber-blue" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyber-blue" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyber-blue" />
          </div>

          <div className="absolute bottom-2 left-3 text-[9px] text-slate-500">
            RADAR: 360° SWEEP
          </div>
          <div className="absolute top-2 right-3 text-[9px] text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            FEED ONLINE
          </div>
        </div>

        {/* Telemetry Stream */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="p-2 rounded bg-[#030712] border border-[#1E293B] flex flex-col gap-0.5">
            <span className="text-white font-bold text-xs">{GALLERY_ITEMS.length}</span>
            <span className="text-slate-500">FRAMES</span>
          </div>
          <div className="p-2 rounded bg-[#030712] border border-[#1E293B] flex flex-col gap-0.5">
            <span className="text-cyber-blue font-bold text-xs">4K</span>
            <span className="text-slate-500">DYNAMIC</span>
          </div>
          <div className="p-2 rounded bg-[#030712] border border-[#1E293B] flex flex-col gap-0.5">
            <span className="text-emerald-400 font-bold text-xs">0-LOSS</span>
            <span className="text-slate-500">ENCODING</span>
          </div>
        </div>
      </div>
    </div>
  );
}
