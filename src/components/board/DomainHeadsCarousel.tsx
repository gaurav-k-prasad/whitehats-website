"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, PanInfo } from "framer-motion";
import { BoardMember } from "@/data/boardData";
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

interface DomainHeadsCarouselProps {
  members?: BoardMember[];
}

export default function DomainHeadsCarousel({ members: initialMembers }: DomainHeadsCarouselProps) {
  const [domainMembers, setDomainMembers] = useState<BoardMember[]>(() => {
    if (initialMembers) {
      return shuffleArray(initialMembers.filter((m) => m.category === "Domain Heads"));
    }
    return [];
  });
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(() => !!initialMembers);
  const isDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    if (initialMembers) return;

    fetch("/api/board")
      .then((res) => res.json())
      .then((data) => {
        const list = data.members || [];
        const rawDomainMembers = list.filter((m: BoardMember) => m.category === "Domain Heads");
        setDomainMembers(shuffleArray(rawDomainMembers));
        setIsMounted(true);
      })
      .catch(() => {
        setDomainMembers([]);
        setIsMounted(true);
      });
  }, [initialMembers]);

  const handleNext = useCallback(() => {
    if (domainMembers.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % domainMembers.length);
  }, [domainMembers.length]);

  const handlePrev = useCallback(() => {
    if (domainMembers.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + domainMembers.length) % domainMembers.length);
  }, [domainMembers.length]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Drag End handler with swipe velocity threshold
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 50;
    const swipeVelocity = 400;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -swipeVelocity) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocity) {
      handlePrev();
    }

    // Debounce drag state to prevent unwanted card click right after release
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  // Card click: focus this card or trigger card action if already active
  const handleCardClick = (index: number) => {
    if (isDraggingRef.current) return;
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
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
            {"// DOMAIN HEADS"}
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

      {/* 3D Coverflow Container */}
      <div className="relative w-full h-[600px] sm:h-[650px] flex items-center justify-center overflow-visible">
        {domainMembers.map((member, index) => {
          const count = domainMembers.length;
          // Calculate relative circular index difference
          let offset = index - activeIndex;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;

          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          // Compute 3D translations & scales (scaled 20% unified to 400px width)
          const xOffset = offset * 245; // horizontal separation
          const zOffset = -Math.abs(offset) * 165; // depth
          const scale = isCenter ? 1 : Math.max(0.72, 1 - Math.abs(offset) * 0.16);
          const opacity = isCenter ? 1 : Math.max(0.45, 1 - Math.abs(offset) * 0.3);
          const rotateY = offset * -18; // 3D angle rotation
          const zIndex = 30 - Math.abs(offset) * 5;

          return (
            <motion.div
              key={member.id}
              onClick={() => handleCardClick(index)}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              animate={{
                x: xOffset,
                z: zOffset,
                scale,
                opacity,
                rotateY,
                filter: isCenter
                  ? "brightness(1) blur(0px)"
                  : "brightness(0.7) blur(1.5px)",
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 28,
                mass: 0.8,
              }}
              style={{
                zIndex,
                position: "absolute",
                transformStyle: "preserve-3d",
                cursor: isCenter ? "grab" : "pointer",
                width: "min(400px, 88vw)",
              }}
              whileTap={isCenter ? { cursor: "grabbing" } : {}}
            >
              <div className="relative group h-full">
                <BoardCard member={member} isCenter={isCenter} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Pagination Indicator */}
      <div className="flex justify-center items-center gap-2 pt-2">
        {domainMembers.map((member, index) => (
          <button
            key={member.id}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to ${member.name}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === activeIndex
                ? "w-8 bg-cyber-blue shadow-neon-blue"
                : "w-2 bg-[#1E293B] hover:bg-slate-500"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
