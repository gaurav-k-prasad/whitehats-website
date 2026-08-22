"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: (staggerDelay = 0.08) => ({
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  }),
};

export const STAGGER_ITEM_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function StaggerReveal({
  children,
  className = "",
  staggerDelay = 0.08,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      variants={CONTAINER_VARIANTS}
      custom={staggerDelay}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={STAGGER_ITEM_VARIANTS} className={className}>
      {children}
    </motion.div>
  );
}
