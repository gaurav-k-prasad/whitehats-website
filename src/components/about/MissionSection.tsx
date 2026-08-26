"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ABOUT_MISSION } from "@/data/aboutData";
import CipherReveal from "@/components/ui/CipherReveal";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";

export default function MissionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-card-border pb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
        <h2 className="font-mono text-sm sm:text-base font-bold text-cyber-blue tracking-widest uppercase">
          <CipherReveal text={ABOUT_MISSION.label} duration={400} />
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CyberCardBorder className="shadow-xl" contentClassName="p-6 sm:p-10 relative">
          <ScanlineOverlay opacity="opacity-[0.025]" />
          <div className="absolute inset-0 font-mono text-[9px] text-cyber-blue/[0.05] leading-tight select-none pointer-events-none p-4 break-all overflow-hidden hidden sm:block">
            01010111 01001000 01001001 01010100 01000101 01001000 01000001 01010100 01010011 00100000 01001101 01001001 01010011 01010011 01001001 01001111 01001110 00100000 01000010 01010010 01001001 01000110 01000101
          </div>

          <h3 className="relative z-10 font-mono font-black text-2xl sm:text-3xl text-white mb-4">
            {ABOUT_MISSION.heading}
          </h3>
          <p className="relative z-10 text-text-muted text-sm sm:text-base leading-relaxed max-w-3xl">
            {ABOUT_MISSION.body}
          </p>
        </CyberCardBorder>
      </motion.div>
    </section>
  );
}
