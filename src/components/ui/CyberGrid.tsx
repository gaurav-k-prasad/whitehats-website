"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CyberGrid() {
  const { scrollY } = useScroll();
  // 0.5x parallax shift for floating tactical nodes and grid depth
  const yParallax = useTransform(scrollY, [0, 1000], [0, -150]);
  const yParallaxSlow = useTransform(scrollY, [0, 1000], [0, -80]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Deep Ambient Radial Gradient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-cyber-blue/[0.07] rounded-full blur-[160px]" />
      <div className="absolute bottom-10 right-1/4 w-[700px] h-[350px] bg-cyber-blue/[0.04] rounded-full blur-[140px]" />

      {/* 2. Tactical Dot-Matrix Pattern with Radial Mask */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#0088FF_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.12] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_60%,transparent_100%)]"
      />

      {/* 3. Subtle Cyber Grid Blueprint Lines */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B20_1px,transparent_1px),linear-gradient(to_bottom,#1E293B20_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_30%,#000_50%,transparent_100%)]"
      />

      {/* 4. Topographical / Horizon Scan Line (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cyberGridFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0088FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#0088FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0088FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="120" x2="100%" y2="120" stroke="url(#cyberGridFade)" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="0" y1="420" x2="100%" y2="420" stroke="url(#cyberGridFade)" strokeWidth="1" strokeDasharray="8 8" />
        <line x1="0" y1="780" x2="100%" y2="780" stroke="url(#cyberGridFade)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* 5. Parallax Floating Circuit Nodes */}
      <motion.div style={{ y: yParallax }} className="absolute inset-0">
        {/* Node 1 */}
        <div className="absolute top-[18%] left-[8%] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue shadow-[0_0_10px_#0088FF] animate-pulse" />
          <span className="font-mono text-[9px] text-cyber-blue/30 tracking-widest uppercase">
            // NODE_ALPHA_01
          </span>
        </div>

        {/* Node 2 */}
        <div className="absolute top-[45%] right-[10%] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyber-blue/80 shadow-[0_0_12px_#0088FF]" />
          <span className="font-mono text-[9px] text-cyber-blue/30 tracking-widest uppercase">
            // SEC_GRID_44
          </span>
        </div>

        {/* Node 3 */}
        <div className="absolute top-[75%] left-[12%] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_10px_#34D399]" />
          <span className="font-mono text-[9px] text-emerald-400/30 tracking-widest uppercase">
            // TELEMETRY_SYNC
          </span>
        </div>
      </motion.div>

      {/* 6. Slower Parallax Layer for Depth */}
      <motion.div style={{ y: yParallaxSlow }} className="absolute inset-0">
        <div className="absolute top-[32%] left-[85%] w-24 h-24 rounded-full border border-cyber-blue/[0.08] border-dashed animate-spin [animation-duration:40s]" />
        <div className="absolute top-[62%] right-[80%] w-32 h-32 rounded-full border border-cyber-blue/[0.06] border-dashed animate-spin [animation-duration:55s] [animation-direction:reverse]" />
      </motion.div>
    </div>
  );
}
