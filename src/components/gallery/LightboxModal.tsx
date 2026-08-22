"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryItem } from "@/data/galleryData";

interface LightboxModalProps {
  selectedItem: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
}

// Terminal typewriter text readout effect
function TerminalTypewriter({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      <span className="inline-block w-2 h-4 bg-cyber-blue ml-1 animate-pulse" />
    </span>
  );
}

export default function LightboxModal({
  selectedItem,
  items,
  onClose,
  onSelect,
}: LightboxModalProps) {
  const currentIndex = selectedItem
    ? items.findIndex((i) => i.id === selectedItem.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelect(items[currentIndex - 1]);
    } else if (items.length > 0) {
      onSelect(items[items.length - 1]);
    }
  }, [currentIndex, items, onSelect]);

  const handleNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < items.length - 1) {
      onSelect(items[currentIndex + 1]);
    } else if (items.length > 0) {
      onSelect(items[0]);
    }
  }, [currentIndex, items, onSelect]);

  // Lock body scroll when modal is open to prevent background window scrolling
  useEffect(() => {
    if (!selectedItem) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedItem]);

  // Keyboard navigation
  useEffect(() => {
    if (!selectedItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#030712]/95 backdrop-blur-md"
          />

          {/* Morph Target Modal with Shared Element Transition */}
          <motion.div
            layoutId={`gallery-card-${selectedItem.id}`}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 28,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-[#0B1120] border border-[#1E293B] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] text-slate-100 z-10 max-h-[90vh] sm:max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Scrollable Inner Content Area */}
            <div className="w-full overflow-y-auto grid grid-cols-1 lg:grid-cols-12 flex-1">
              {/* LEFT / TOP: Shared Element Image Container */}
              <div className="lg:col-span-7 relative bg-[#030712] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-card-border p-4 sm:p-6">
                <motion.div
                  layoutId={`gallery-image-${selectedItem.id}`}
                  className="relative w-full aspect-4/3 sm:aspect-16/10 lg:aspect-auto lg:h-full min-h-[260px] sm:min-h-[380px] rounded-xl overflow-hidden border border-[#1E293B]"
                >
                  <Image
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 650px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/90 via-transparent to-transparent pointer-events-none" />

                  {/* Bottom Verified Badge on Image */}
                  <div className="absolute bottom-3 left-3 font-mono text-[10px] text-slate-300 bg-[#030712]/90 backdrop-blur-xs px-2.5 py-1 rounded border border-[#1E293B] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
                    <span>SECURE INTEL ARCHIVE // RECORD #{selectedItem.id}</span>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT: Terminal-Style Data Readout & Typing Effect */}
              <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between gap-5 bg-[#0B1120]">
                {/* Header & Controls */}
                <div className="flex items-center justify-between border-b border-card-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyber-blue-light tracking-widest uppercase">
                      &gt;_ NODE_INTEL.SYS
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {items.length > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handlePrev}
                          aria-label="Previous record"
                          className="px-2 py-0.5 rounded bg-[#121826] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#1E293B] font-mono text-xs transition-colors cursor-pointer"
                        >
                          ←
                        </button>
                        <span className="font-mono text-[10px] text-slate-500 px-1">
                          {currentIndex + 1}/{items.length}
                        </span>
                        <button
                          onClick={handleNext}
                          aria-label="Next record"
                          className="px-2 py-0.5 rounded bg-[#121826] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#1E293B] font-mono text-xs transition-colors cursor-pointer"
                        >
                          →
                        </button>
                      </div>
                    )}

                    <button
                      onClick={onClose}
                      className="text-xs font-mono px-2.5 py-1 rounded border border-[#1E293B] hover:border-slate-600 bg-[#121826] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Terminal Typing Readout Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40">
                      {selectedItem.category}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      STATUS: VERIFIED
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight min-h-[2.5rem]">
                    &gt; <TerminalTypewriter text={selectedItem.title} speed={20} />
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="font-mono text-xs text-cyber-blue-light font-semibold">
                      DATE: {selectedItem.date}
                    </span>
                    <span className="font-mono text-xs text-slate-500">|</span>
                    <span className="font-mono text-xs text-slate-400">
                      YEAR: {selectedItem.year}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedItem.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] text-slate-300 px-2 py-0.5 rounded bg-[#121826] border border-[#1E293B]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Mission Summary & Quote */}
                <div className="flex flex-col gap-2.5 bg-[#030712]/60 p-3.5 rounded-xl border border-[#1E293B]">
                  <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    // MISSION DEBRIEF
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {selectedItem.description}
                  </p>
                  {selectedItem.quote && (
                    <blockquote className="border-l-2 border-cyber-blue pl-3 py-1 bg-cyber-blue/10 rounded-r font-mono text-xs text-cyber-blue-light italic">
                      {selectedItem.quote}
                    </blockquote>
                  )}
                </div>

                {/* Metrics HUD Row */}
                {selectedItem.metrics && selectedItem.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedItem.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="p-2 rounded-lg border border-[#1E293B] bg-[#030712] flex flex-col gap-0.5 text-center"
                      >
                        <span className="font-mono text-[9px] text-slate-500 tracking-wider">
                          {m.label}
                        </span>
                        <span className="font-mono text-xs font-bold text-cyber-blue">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
