"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IMPACT_STATS } from "@/data/eventsData";
import MagneticButton from "@/components/ui/MagneticButton";
import CipherReveal from "@/components/ui/CipherReveal";

export default function EventsHero() {
  const [typedCommand, setTypedCommand] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const fullCommand = "whoami";
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < fullCommand.length) {
        setTypedCommand(fullCommand.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setShowOutput(true);
          setTimeout(() => setShowPrompt(true), 400);
        }, 300);
      }
    }, 90);

    return () => clearInterval(typeInterval);
  }, []);

  const scrollToPastEvents = () => {
    const el = document.getElementById("past-events");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-2">
      {/* Left Column: Heading, Subtitle & CTA */}
      <div className="lg:col-span-6 flex flex-col items-start gap-5">
        {/* Monospace Sub-label */}
        <div className="font-mono text-xs text-cyber-blue tracking-widest uppercase">
          <CipherReveal text="// EVENTS & TACTICAL OPERATIONS" duration={350} />
        </div>

        {/* Animated Main Heading */}
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black font-mono tracking-tight leading-none">
          <span className="text-slate-100 block">
            <CipherReveal text="< OUR" delay={100} duration={350} />
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-blue-light to-blue-300 drop-shadow-[0_0_25px_rgba(0,136,255,0.45)] block">
            <CipherReveal text="EVENTS />" delay={250} duration={400} />
          </span>
        </h1>

        {/* Accent Bar */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-12 h-1 bg-cyber-blue/80 rounded-full"
        />

        {/* Description Body */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
          className="text-text-muted text-sm sm:text-base leading-relaxed max-w-lg"
        >
          Discover WhiteHats flagship capture the flag contests, specialized offensive security bootcamps, and technical seminars empowering the next generation of cybersecurity operators.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
          className="pt-2"
        >
          <MagneticButton strength={14}>
            <button
              onClick={scrollToPastEvents}
              className="px-6 py-3 rounded bg-cyber-blue hover:bg-cyber-blue-light text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-neon-blue hover:shadow-[0_0_25px_rgba(0,136,255,0.6)] flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Past Events</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Right Column: Terminal Window & Community Impact Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="lg:col-span-6 flex flex-col gap-4"
      >
        {/* Tactical Terminal Window */}
        <div className="rounded-xl border border-card-border bg-[#050A15] shadow-2xl overflow-hidden font-mono">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#030712] border-b border-card-border text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-[11px] text-slate-500">events-intel@whitehats</span>
            </div>
            <span className="text-[10px] text-cyber-blue font-bold">NODE_01</span>
          </div>

          <div className="p-4 sm:p-5 flex flex-col gap-2 text-xs sm:text-sm min-h-[110px]">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="text-cyber-blue font-bold">whitehats@club:~$</span>
              <span>{typedCommand}</span>
              {!showOutput && <span className="w-2 h-4 bg-cyber-blue inline-block animate-pulse" />}
            </div>

            {showOutput && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-400 font-bold pl-2 border-l-2 border-emerald-500/40"
              >
                whitehats-member
              </motion.div>
            )}

            {showPrompt && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-slate-200"
              >
                <span className="text-cyber-blue font-bold">whitehats@club:~$</span>
                <span className="w-2 h-4 bg-cyber-blue inline-block animate-pulse" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Community Impact Stats Block */}
        <div className="rounded-xl border border-card-border bg-[#0B1120]/90 p-4 sm:p-5 flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-card-border pb-2">
            <span className="font-mono text-[11px] font-bold text-cyber-blue-light tracking-widest uppercase">
              // COMMUNITY IMPACT
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {IMPACT_STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.15, duration: 0.4 }}
                className="flex flex-col gap-0.5 text-center p-2 rounded-lg bg-[#030712] border border-card-border"
              >
                <span className="font-mono text-lg sm:text-xl font-black text-white">
                  {stat.value}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-tight">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
