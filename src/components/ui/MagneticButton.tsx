"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 24,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Snappy spring physics for smooth, immediate cursor attraction and bounce-back
  const springX = useSpring(x, { stiffness: 240, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 240, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = element.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const offsetX = ((clientX - centerX) / (width / 2)) * strength;
    const offsetY = ((clientY - centerY) / (height / 2)) * strength;

    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
