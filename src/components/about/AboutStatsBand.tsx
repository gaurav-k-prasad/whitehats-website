"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ABOUT_STATS, AboutStat } from "@/data/aboutData";

export default function AboutStatsBand() {
  const stats: AboutStat[] = ABOUT_STATS;

  useEffect(() => {
    fetch("/api/admin/me")
      .then(() => fetch("/api/admin/board")) // warm check
      .catch(() => {});
  }, []);

  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: idx * 0.08, duration: 0.4 }}
          className="flex flex-col gap-1 items-center text-center p-4 sm:p-5 rounded-xl bg-card-bg border border-card-border hover:border-cyber-blue/40 transition-colors"
        >
          <span className="font-mono text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-blue-light">
            {stat.value}
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] text-text-muted uppercase tracking-wider">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </section>
  );
}
