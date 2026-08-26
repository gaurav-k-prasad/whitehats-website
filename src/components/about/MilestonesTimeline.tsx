"use client";

import React from "react";
import { motion } from "framer-motion";
import { ABOUT_MILESTONES } from "@/data/aboutData";
import CipherReveal from "@/components/ui/CipherReveal";

export default function MilestonesTimeline() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-card-border pb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
        <h2 className="font-mono text-sm sm:text-base font-bold text-cyber-blue tracking-widest uppercase">
          <CipherReveal text="// TIMELINE LOG" duration={400} />
        </h2>
      </div>

      <div className="relative flex flex-col gap-8 pl-6 sm:pl-8">
        {/* Vertical spine */}
        <div className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-cyber-blue via-card-border to-transparent" />

        {ABOUT_MILESTONES.map((milestone, idx) => (
          <motion.div
            key={`${milestone.year}-${milestone.title}`}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Node */}
            <div className="absolute -left-6 sm:-left-8 top-1 w-3.5 h-3.5 rounded-full bg-[#030712] border-2 border-cyber-blue shadow-[0_0_10px_rgba(0,136,255,0.6)]" />

            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs font-bold text-cyber-blue tracking-widest">
                {milestone.year}
              </span>
              <h3 className="font-mono font-bold text-base sm:text-lg text-white">
                {milestone.title}
              </h3>
              <p className="text-text-muted text-xs sm:text-sm leading-relaxed max-w-2xl">
                {milestone.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
