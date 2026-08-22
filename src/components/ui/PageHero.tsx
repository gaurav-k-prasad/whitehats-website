"use client";

import { motion, useInView, Variants } from "framer-motion";
import React, { useRef } from "react";

interface PageHeroProps {
  /** The small monospace label shown above the heading e.g. "// PROJECTS" */
  label: string;
  /** White part of the heading */
  headingPrefix: string;
  /** Gradient blue part of the heading */
  headingSuffix: string;
  /** Body paragraph text */
  description: string;
  /** Optional slot for a CTA button / extra content under the description */
  children?: React.ReactNode;
  /** Optional right column graphic/component */
  rightSlot?: React.ReactNode;
  /** Animation variant for the heading */
  variant?: "glitch" | "typewriter" | "cipher" | "slide-up";
}

const LABEL_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const LINE_VARIANTS: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const DESC_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.55, ease: "easeOut" } },
};

const CHILDREN_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.7, ease: "easeOut" } },
};

// --- Glitch Heading (Projects) ---
function GlitchHeading({ prefix, suffix }: { prefix: string; suffix: string }) {
  return (
    <motion.h1
      className="text-4xl sm:text-5xl xl:text-6xl font-black font-mono tracking-tight leading-none"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className="text-slate-100 inline-block"
        animate={{ x: [0, -2, 1, -1, 0], opacity: [1, 0.8, 1, 0.9, 1] }}
        transition={{ duration: 0.08, delay: 0.7, times: [0, 0.25, 0.5, 0.75, 1] }}
      >
        {prefix}
      </motion.span>
      <br />
      <motion.span
        className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-blue-light to-blue-300 drop-shadow-[0_0_25px_rgba(0,136,255,0.45)] inline-block"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
      >
        {suffix}
      </motion.span>
    </motion.h1>
  );
}

// --- Typewriter Heading (Events) ---
function TypewriterHeading({ prefix, suffix }: { prefix: string; suffix: string }) {
  return (
    <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black font-mono tracking-tight leading-none">
      <motion.span
        className="text-slate-100 inline-block"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {prefix}
      </motion.span>
      <br />
      <motion.span
        className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-blue-light to-blue-300 drop-shadow-[0_0_25px_rgba(0,136,255,0.45)] inline-block"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {suffix}
      </motion.span>
    </h1>
  );
}

// --- Cipher Heading (Board) ---
function CipherHeading({ prefix, suffix }: { prefix: string; suffix: string }) {
  return (
    <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black font-mono tracking-tight leading-none">
      <motion.span
        className="text-slate-100 inline-block whitespace-nowrap"
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {prefix}
      </motion.span>
      <br />
      <motion.span
        className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-blue-light to-blue-300 drop-shadow-[0_0_25px_rgba(0,136,255,0.45)] inline-block whitespace-nowrap"
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {suffix}
      </motion.span>
    </h1>
  );
}

// --- Slide Up Heading (Gallery) ---
function SlideUpHeading({ prefix, suffix }: { prefix: string; suffix: string }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 w-0.5 bg-cyber-blue shadow-[0_0_12px_#0088FF] z-10"
        initial={{ top: "0%", height: "0%" }}
        animate={{ top: "0%", height: "100%" }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeIn" }}
      />
      <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black font-mono tracking-tight leading-none">
        <div className="overflow-hidden">
          <motion.span
            className="text-slate-100 inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {prefix}
          </motion.span>
        </div>
        <div className="overflow-hidden">
          <motion.span
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-blue-light to-blue-300 drop-shadow-[0_0_25px_rgba(0,136,255,0.45)] inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {suffix}
          </motion.span>
        </div>
      </h1>
    </div>
  );
}

// Default right-column HUD if no custom rightSlot provided
function DefaultHUD() {
  return (
    <div className="relative flex items-center justify-center w-full h-[320px] rounded-xl border border-card-border bg-[#050A15]/90 p-6 shadow-2xl overflow-hidden font-mono">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none" />

      {/* Rotating Radar Rings */}
      <div className="absolute w-52 h-52 rounded-full border border-cyber-blue/15 border-dashed animate-spin [animation-duration:24s] pointer-events-none" />
      <div className="absolute w-36 h-36 rounded-full border border-cyber-blue/20 animate-spin [animation-duration:16s] [animation-direction:reverse] pointer-events-none" />
      <div className="absolute w-4 h-4 rounded-full bg-cyber-blue shadow-[0_0_16px_#0088FF] animate-pulse" />

      {/* Telemetry markers */}
      <div className="absolute top-4 left-4 text-[10px] text-cyber-blue font-bold tracking-wider">
        SYS_STATUS: ACTIVE
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 tracking-wider">
        ENCRYPT: AES-256-GCM
      </div>
      <div className="absolute bottom-4 left-4 text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        SECURE_LINK
      </div>
    </div>
  );
}

export default function PageHero({
  label,
  headingPrefix,
  headingSuffix,
  description,
  children,
  rightSlot,
  variant = "glitch",
}: PageHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  function renderHeading() {
    switch (variant) {
      case "glitch":
        return <GlitchHeading prefix={headingPrefix} suffix={headingSuffix} />;
      case "typewriter":
        return <TypewriterHeading prefix={headingPrefix} suffix={headingSuffix} />;
      case "cipher":
        return <CipherHeading prefix={headingPrefix} suffix={headingSuffix} />;
      case "slide-up":
        return <SlideUpHeading prefix={headingPrefix} suffix={headingSuffix} />;
    }
  }

  return (
    <section
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-2"
    >
      {/* Left Column: Heading & Description (Matches Home Page proportions) */}
      <div className="lg:col-span-6 flex flex-col items-start gap-5">
        {/* Monospace Sub-label */}
        <motion.div
          className="font-mono text-xs text-cyber-blue tracking-widest uppercase"
          variants={LABEL_VARIANTS}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {label}
        </motion.div>

        {/* Animated Heading */}
        {renderHeading()}

        {/* Accent Bar */}
        <motion.div
          className="w-12 h-1 bg-cyber-blue/80 rounded-full"
          variants={LINE_VARIANTS}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        />

        {/* Description Body */}
        <motion.p
          className="text-text-muted text-sm sm:text-base leading-relaxed max-w-lg"
          variants={DESC_VARIANTS}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {description}
        </motion.p>

        {/* Optional Action / CTA Slot */}
        {children && (
          <motion.div
            className="pt-2"
            variants={CHILDREN_VARIANTS}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {children}
          </motion.div>
        )}
      </div>

      {/* Right Column: Custom Graphic / HUD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="lg:col-span-6 flex items-center justify-center w-full"
      >
        {rightSlot ? rightSlot : <DefaultHUD />}
      </motion.div>
    </section>
  );
}
