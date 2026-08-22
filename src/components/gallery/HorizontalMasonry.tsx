"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryItem } from "@/data/galleryData";
import GalleryCard from "./GalleryCard";

interface HorizontalMasonryProps {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
}

export default function HorizontalMasonry({
  items,
  onSelect,
}: HorizontalMasonryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackbarRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const hasDraggedRef = useRef(false);
  const [numRows, setNumRows] = useState(3);

  // Responsive row count (2 rows on small/tablet, 3 rows on large screens)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 768) {
          setNumRows(2);
        } else {
          setNumRows(3);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Split filtered items into parallel horizontal rows
  const rowSlices = useMemo(() => {
    const rows: GalleryItem[][] = Array.from({ length: numRows }, () => []);
    items.forEach((item, index) => {
      rows[index % numRows].push(item);
    });
    return rows;
  }, [items, numRows]);

  // Track horizontal scroll progress without blocking vertical page scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll > 0) {
        const progress = Math.min(100, Math.max(0, (container.scrollLeft / maxScroll) * 100));
        setScrollProgress(Math.round(progress));
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [items.length]);

  // Mouse Drag-to-Scroll Panning handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsMouseDown(true);
    hasDraggedRef.current = false;
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftPos(container.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.3;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    container.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // Card click filter (ignores click if user was actively dragging)
  const handleCardSelect = (item: GalleryItem) => {
    if (hasDraggedRef.current) return;
    onSelect(item);
  };

  // Fast scroll navigation buttons
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -450, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 450, behavior: "smooth" });
    }
  };

  // Trackbar click to scrub position
  const handleTrackbarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackbarRef.current;
    const container = scrollContainerRef.current;
    if (!track || !container) return;
    const rect = track.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const maxScroll = container.scrollWidth - container.clientWidth;
    container.scrollTo({
      left: maxScroll * clickRatio,
      behavior: "smooth",
    });
  };

  if (items.length === 0) {
    return (
      <div className="w-full py-28 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-[#1E293B] rounded-2xl bg-[#0B1120]/40">
        <div className="w-12 h-12 rounded-full border border-cyber-blue/40 flex items-center justify-center text-cyber-blue font-mono text-lg animate-pulse">
          //
        </div>
        <p className="font-mono text-sm text-slate-300 font-bold tracking-wider uppercase">
          // NO ARCHIVE RECORDS MATCHING ACTIVE FILTER
        </p>
        <span className="font-mono text-xs text-slate-500">
          Try resetting category filters or adjusting search queries.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Horizontal Scrollable Track Container */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full overflow-x-auto overflow-y-visible pb-4 pt-1 px-4 sm:px-6 lg:px-8 select-none ${
          isMouseDown ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Dynamic Parallel Horizontal Rows with Natural Varied Card Widths */}
        <div className="flex flex-col gap-4 sm:gap-6 min-w-max">
          {rowSlices.map((rowItems, rowIndex) => (
            <div
              key={`row-${rowIndex}-${numRows}`}
              className="flex flex-row gap-4 sm:gap-6 items-stretch h-[240px] sm:h-[280px] md:h-[310px]"
            >
              <AnimatePresence mode="popLayout">
                {rowItems.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    onSelect={handleCardSelect}
                  />
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Cyber Horizontal Scroll Telemetry & Trackbar HUD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Left / Right Fast Scroll Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            aria-label="Scroll gallery left"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1120] hover:bg-cyber-blue/20 text-slate-300 hover:text-white border border-[#1E293B] hover:border-cyber-blue font-mono text-xs transition-colors cursor-pointer"
          >
            <span>←</span>
            <span className="hidden sm:inline">PREV</span>
          </button>

          <button
            onClick={scrollRight}
            aria-label="Scroll gallery right"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1120] hover:bg-cyber-blue/20 text-slate-300 hover:text-white border border-[#1E293B] hover:border-cyber-blue font-mono text-xs transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">NEXT</span>
            <span>→</span>
          </button>
        </div>

        {/* Center Interactive Trackbar (Clickable to scrub) */}
        <div className="flex items-center gap-3 w-full sm:w-80">
          <span className="font-mono text-[10px] text-slate-500 font-bold shrink-0">
            0%
          </span>
          <div
            ref={trackbarRef}
            onClick={handleTrackbarClick}
            className="relative flex-1 h-2 bg-[#1E293B] hover:bg-[#283548] rounded-full overflow-hidden cursor-pointer transition-colors"
          >
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-cyber-blue rounded-full shadow-neon-blue"
              style={{ width: `${scrollProgress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <span className="font-mono text-[10px] text-cyber-blue-light font-bold shrink-0">
            {scrollProgress}%
          </span>
        </div>

        {/* Telemetry Hint */}
        <div className="font-mono text-[11px] text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
          <span>DRAG TRACK OR USE ARROW BUTTONS TO PAN</span>
        </div>
      </div>
    </div>
  );
}
