"use client";

import { motion, useInView, Variants } from "framer-motion";
import React, { useRef } from "react";
import CipherReveal from "@/components/ui/CipherReveal";
import MagneticButton from "@/components/ui/MagneticButton";

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
}: PageHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-2"
    >
      {/* Left Column: Heading & Description (Matches Home Page proportions) */}
      <div className="lg:col-span-6 flex flex-col items-start gap-5">
        {/* Monospace Sub-label with CipherReveal */}
        <motion.div
          className="font-mono text-xs text-cyber-blue tracking-widest uppercase"
          variants={LABEL_VARIANTS}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <CipherReveal text={label} duration={350} />
        </motion.div>

        {/* Animated Main Heading with Decryption Scramble */}
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black font-mono tracking-tight leading-none">
          <span className="text-slate-100 block">
            <CipherReveal text={headingPrefix} delay={100} duration={400} />
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-blue-light to-blue-300 drop-shadow-[0_0_25px_rgba(0,136,255,0.45)] block">
            <CipherReveal text={headingSuffix} delay={250} duration={450} />
          </span>
        </h1>

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

        {/* Optional Action / CTA Slot with Magnetic Pull */}
        {children && (
          <motion.div
            className="pt-2"
            variants={CHILDREN_VARIANTS}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <MagneticButton strength={12}>{children}</MagneticButton>
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
