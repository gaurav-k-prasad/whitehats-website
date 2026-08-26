"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function subscribePointer(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(hover: hover) and (pointer: fine)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getPointerSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export default function CustomCursor() {
  const isEnabled = useSyncExternalStore(subscribePointer, getPointerSnapshot, () => false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for trailing outer ring
  const ringX = useSpring(mouseX, { stiffness: 320, damping: 24, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 320, damping: 24, mass: 0.4 });

  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Target hover detection across links, buttons, and interactive cards
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        "a, button, input, select, textarea, [role='button'], .cursor-pointer, [data-cursor='pointer']"
      );

      setIsHovered(!!interactive);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !related.closest("a, button, input, select, textarea, [role='button'], .cursor-pointer, [data-cursor='pointer']")) {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isEnabled, mouseX, mouseY]);

  if (!isEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* 1. Instant Inner Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.5 : isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.95 : 1,
        }}
        transition={{ duration: 0.15 }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyber-blue shadow-[0_0_12px_#0088FF] pointer-events-none"
      />

      {/* 2. Trailing Morphing Target Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovered ? 1.5 : 1,
          borderRadius: isHovered ? "4px" : "9999px",
          borderColor: isHovered ? "#33A9FF" : "rgba(0, 136, 255, 0.5)",
          boxShadow: isHovered
            ? "0 0 18px rgba(0, 136, 255, 0.7)"
            : "0 0 0px transparent",
        }}
        transition={{ duration: 0.18 }}
        className="fixed top-0 left-0 w-8 h-8 border border-cyber-blue/50 flex items-center justify-center pointer-events-none"
      >
        {/* Sci-Fi Corner Brackets on Target Lock */}
        {isHovered && (
          <div className="absolute inset-0 p-0.5 pointer-events-none">
            <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyber-blue" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cyber-blue" />
            <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-cyber-blue" />
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyber-blue" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
