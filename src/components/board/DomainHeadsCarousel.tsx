"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, PanInfo } from "framer-motion";
import { BOARD_DATA, BoardMember } from "@/data/boardData";
import BoardCard from "./BoardCard";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function DomainHeadsCarousel() {
  const rawDomainMembers = BOARD_DATA.filter((m) => m.category === "Domain Heads");
  const [domainMembers, setDomainMembers] = useState<BoardMember[]>(rawDomainMembers);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  // Randomize the entire order of Domain Heads on mount
  useEffect(() => {
    setDomainMembers(shuffleArray(rawDomainMembers));
    setIsMounted(true);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % domainMembers.length);
  }, [domainMembers.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + domainMembers.length) % domainMembers.length);
  }, [domainMembers.length]);

  // Keyboard navigation support (Left/Right Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 35;
    const velocityThreshold = 200;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }

    // Delay clearing dragging state slightly to prevent click event trigger
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  if (!isMounted) {
    return (
      <section className="flex flex-col gap-8 pt-4 pb-12 min-h-[600px] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8 pt-4 pb-12 overflow-hidden select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0088FF] shadow-neon-blue" />
          <h2 className="font-mono text-sm sm:text-base font-bold text-[#0088FF] tracking-widest uppercase">
            // DOMAIN HEADS
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 ml-3">
            <button
              onClick={handlePrev}
              aria-label="Previous board member"
              className="p-2 rounded-lg border border-[#1E293B] hover:border-cyber-blue/60 bg-[#0B1120] text-slate-300 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next board member"
              className="p-2 rounded-lg border border-[#1E293B] hover:border-cyber-blue/60 bg-[#0B1120] text-slate-300 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Cover Flow Carousel Stage */}
      <div
        className="relative w-full h-[580px] sm:h-[640px] md:h-[680px] flex items-center justify-center touch-pan-y"
        style={{ perspective: "1400px" }}
      >
        {domainMembers.map((member: BoardMember, index: number) => {
          // Calculate modular offset relative to active center item
          let offset = index - activeIndex;
          const half = Math.floor(domainMembers.length / 2);
          if (offset > half) offset -= domainMembers.length;
          if (offset < -half) offset += domainMembers.length;

          // Only render visible cards near the viewport (distance <= 3)
          const isVisible = Math.abs(offset) <= 3;
          if (!isVisible) return null;

          const isCenter = offset === 0;

          // Compute 3D translations & rotations with generous scale & spacing
          const xTranslation = offset * 250; // horizontal separation
          const rotateY = offset * -28; // 3D angle away from center
          const scale = isCenter ? 1 : Math.max(0.72, 1 - Math.abs(offset) * 0.14);
          const zIndex = 30 - Math.abs(offset) * 6;
          const opacity = isCenter ? 1 : Math.max(0.4, 1 - Math.abs(offset) * 0.25);

          return (
            <motion.div
              key={member.id}
              className="absolute cursor-pointer w-[290px] sm:w-[360px] md:w-[400px] touch-pan-y"
              animate={{
                x: xTranslation,
                rotateY: rotateY,
                scale: scale,
                zIndex: zIndex,
                opacity: opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 26,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (isDraggingRef.current) return;
                setActiveIndex(index);
              }}
            >
              <div
                className={`transition-all duration-300 ${
                  isCenter
                    ? "drop-shadow-[0_0_35px_rgba(0,136,255,0.45)]"
                    : "pointer-events-auto"
                }`}
              >
                <BoardCard member={member} isLarge={isCenter} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Pagination Dots */}
      <div className="flex items-center justify-center gap-2 pt-4">
        {domainMembers.map((member, idx) => (
          <button
            key={member.id}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to ${member.name}`}
            className={`transition-all duration-300 rounded-full ${
              idx === activeIndex
                ? "w-8 h-2 bg-[#0088FF] shadow-neon-blue"
                : "w-2.5 h-2.5 bg-[#1E293B] hover:bg-slate-600"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
