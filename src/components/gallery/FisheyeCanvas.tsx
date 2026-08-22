"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { GalleryItem } from "@/data/galleryData";
import { generateHexSpiral } from "./hexUtils";
import HexagonNode from "./HexagonNode";

interface FisheyeCanvasProps {
  items: GalleryItem[];
}

// Compute responsive default zoom level based on display width
function getDefaultZoom(width: number): number {
  return width >= 1024 ? 1.75 : 1.25; // 170% for desktop/large screens, 125% for mobile/tablets
}

export default function FisheyeCanvas({ items }: FisheyeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const selectedItemRef = useRef<GalleryItem | null>(null);
  selectedItemRef.current = selectedItem;

  const [isMounted, setIsMounted] = useState(false);
  const isDraggingRef = useRef(false);

  // Viewport dimensions
  const [viewport, setViewport] = useState({
    width: 1920,
    height: 1080,
  });

  // Continuous Canvas Pan & Zoom motion values (Hardware-accelerated)
  const canvasX = useMotionValue(0);
  const canvasY = useMotionValue(0);
  const canvasScale = useMotionValue(1.75); // Will be initialized on mount to responsive default

  // Display zoom percentage for HUD
  const [zoomPercent, setZoomPercent] = useState(170);

  useEffect(() => {
    setIsMounted(true);
    const winWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
    const winHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

    setViewport({ width: winWidth, height: winHeight });

    // Set initial responsive default zoom
    const defZoom = getDefaultZoom(winWidth);
    canvasScale.set(defZoom);
    setZoomPercent(Math.round(defZoom * 100));

    const handleResize = () => {
      if (typeof window !== "undefined") {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);

    // Track zoom percentage changes
    const unsubScale = canvasScale.on("change", (val) => {
      setZoomPercent(Math.round(val * 100));
    });

    // Listen for Escape key to dismiss active modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Mouse scroll wheel zoom handler attached directly to window
    const handleWheel = (e: WheelEvent) => {
      // Allow scrolling inside modal when open
      if (selectedItemRef.current) return;

      e.preventDefault();
      const zoomDelta = -e.deltaY * 0.002;
      const currentScale = canvasScale.get();
      const nextScale = Math.min(3.0, Math.max(0.4, currentScale + zoomDelta));
      canvasScale.set(nextScale);
    };

    // Mobile two-finger pinch-to-zoom handlers
    let initialPinchDist: number | null = null;
    let initialScale = 1;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialScale = canvasScale.get();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDist !== null) {
        if (!selectedItemRef.current) {
          e.preventDefault();
        }
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = currentDist / initialPinchDist;
        const nextScale = Math.min(3.0, Math.max(0.4, initialScale * factor));
        canvasScale.set(nextScale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialPinchDist = null;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      unsubScale();
    };
  }, [canvasScale]);

  // Recalculate dense spiral coordinates for all currently filtered items
  const spiralCoords = useMemo(() => {
    return generateHexSpiral(items.length);
  }, [items.length]);

  // Max radial distortion radius
  const maxRadius = useMemo(() => {
    return Math.max(550, Math.min(viewport.width, viewport.height) * 0.7);
  }, [viewport.width, viewport.height]);

  // Select item only when NOT dragging
  const handleSelectNode = useCallback((item: GalleryItem) => {
    if (isDraggingRef.current) return;
    setSelectedItem(item);
  }, []);

  // Zoom control buttons
  const zoomIn = () => {
    const current = canvasScale.get();
    animate(canvasScale, Math.min(3.0, current + 0.25), {
      type: "spring",
      stiffness: 300,
      damping: 25,
    });
  };

  const zoomOut = () => {
    const current = canvasScale.get();
    animate(canvasScale, Math.max(0.4, current - 0.25), {
      type: "spring",
      stiffness: 300,
      damping: 25,
    });
  };

  const resetZoom = () => {
    const defZoom = getDefaultZoom(viewport.width);
    animate(canvasScale, defZoom, {
      type: "spring",
      stiffness: 300,
      damping: 25,
    });
  };

  // Smoothly re-center the canvas origin (0, 0) and reset zoom
  const handleRecenter = () => {
    const defZoom = getDefaultZoom(viewport.width);
    animate(canvasX, 0, {
      type: "spring",
      stiffness: 240,
      damping: 26,
    });
    animate(canvasY, 0, {
      type: "spring",
      stiffness: 240,
      damping: 26,
    });
    animate(canvasScale, defZoom, {
      type: "spring",
      stiffness: 240,
      damping: 26,
    });
  };

  if (!isMounted) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#030712] gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
        <span className="font-mono text-xs text-cyber-blue-light tracking-widest uppercase">
          // LOADING GALLERY...
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ touchAction: "none", userSelect: "none", WebkitUserSelect: "none" }}
      className="w-full h-screen overflow-hidden bg-[#030712] relative select-none cursor-grab active:cursor-grabbing"
    >
      {/* Ambient Cyber Grid Matrix Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#1E293B15_1px,transparent_1px),linear-gradient(to_bottom,#1E293B15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_65%_65%_at_50%_50%,#000_70%,transparent_100%)] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,136,255,0.06)_0%,transparent_70%)] z-0" />

      {/* Origin Crosshair Telemetry */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 z-0">
        <div className="w-96 h-96 rounded-full border border-dashed border-cyber-blue" />
        <div className="w-[600px] h-px bg-cyber-blue absolute top-1/2 left-1/2 -translate-x-1/2" />
        <div className="h-[600px] w-px bg-cyber-blue absolute top-1/2 left-1/2 -translate-y-1/2" />
      </div>

      {/* Massive Infinite Drag & Zoom Canvas */}
      <motion.div
        style={{
          x: canvasX,
          y: canvasY,
          scale: canvasScale,
          left: viewport.width / 2,
          top: viewport.height / 2,
          touchAction: "none",
          userSelect: "none",
        }}
        drag
        dragConstraints={{
          left: -5000,
          right: 5000,
          top: -5000,
          bottom: 5000,
        }}
        dragElastic={0.12}
        dragMomentum={true}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30, power: 0.18 }}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 80);
        }}
        className="absolute origin-center"
      >
        {/* Massive interactive hit-testing background plane so dragging works in all spaces between cells */}
        <div className="absolute w-[12000px] h-[12000px] -translate-x-1/2 -translate-y-1/2 bg-transparent pointer-events-auto" />

        {/* Honeycomb Nodes */}
        {items.map((item, index) => {
          const coord = spiralCoords[index] || { x: 0, y: 0, q: 0, r: 0 };

          return (
            <HexagonNode
              key={item.id}
              item={item}
              x={coord.x}
              y={coord.y}
              canvasX={canvasX}
              canvasY={canvasY}
              canvasScale={canvasScale}
              maxRadius={maxRadius}
              onSelect={handleSelectNode}
            />
          );
        })}
      </motion.div>

      {/* Viewport Bottom-Left Zoom & Recenter HUD */}
      <div className="fixed bottom-6 left-6 z-30 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0B1120]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#1E293B] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          {/* Zoom Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={zoomOut}
              aria-label="Zoom out"
              className="w-7 h-7 rounded-lg bg-[#121826] hover:bg-cyber-blue/20 text-slate-300 hover:text-white border border-[#1E293B] hover:border-cyber-blue/50 flex items-center justify-center font-mono text-sm font-bold transition-colors cursor-pointer"
            >
              −
            </button>
            <button
              onClick={resetZoom}
              aria-label="Reset zoom"
              className="px-2.5 h-7 rounded-lg bg-[#121826] hover:bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30 flex items-center justify-center font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              {zoomPercent}%
            </button>
            <button
              onClick={zoomIn}
              aria-label="Zoom in"
              className="w-7 h-7 rounded-lg bg-[#121826] hover:bg-cyber-blue/20 text-slate-300 hover:text-white border border-[#1E293B] hover:border-cyber-blue/50 flex items-center justify-center font-mono text-sm font-bold transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          <span className="text-slate-700 font-mono text-xs">|</span>

          {/* Re-center Button */}
          <button
            onClick={handleRecenter}
            className="px-3 h-7 rounded-lg bg-[#121826] hover:bg-cyber-blue/20 text-cyber-blue hover:text-cyber-blue-light border border-cyber-blue/40 font-mono text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            &gt;_ RE-CENTER
          </button>
        </div>
      </div>

      {/* ALWAYS CENTERED VIEWPORT DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
            {/* Dark blurred background backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Centered Modal Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl sm:max-w-2xl bg-[#0B1120]/95 backdrop-blur-2xl border-2 border-cyber-blue rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,136,255,0.45)] text-slate-100 flex flex-col gap-5 max-h-[88vh] overflow-y-auto z-10"
            >
              {/* Ambient Corner Accents */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyber-blue pointer-events-none" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyber-blue pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyber-blue pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyber-blue pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-card-border pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
                  <span className="font-mono text-xs font-bold text-cyber-blue-light tracking-widest uppercase">
                    // ARCHIVE NODE #{selectedItem.id} // {selectedItem.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-xs font-mono px-3 py-1 rounded-lg border border-[#1E293B] hover:border-cyber-blue bg-[#121826] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>✕</span>
                  <span className="hidden sm:inline text-[10px] text-slate-500">ESC</span>
                </button>
              </div>

              {/* Title & Tags */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                  &gt; {selectedItem.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/30 font-semibold">
                    {selectedItem.date}
                  </span>
                  {selectedItem.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] text-slate-400 px-2 py-0.5 rounded bg-[#121826] border border-[#1E293B]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Uncropped Full Media View */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#1E293B] bg-[#121826] flex items-center justify-center">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  fill
                  draggable={false}
                  className="object-cover"
                  sizes="640px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 font-mono text-[10px] text-slate-400 bg-[#030712]/80 px-2.5 py-0.5 rounded border border-[#1E293B]">
                  SECURE ARCHIVE RECORD // 200 OK
                </div>
              </div>

              {/* Description & Quote */}
              {selectedItem.description && (
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {selectedItem.description}
                </p>
              )}

              {selectedItem.quote && (
                <blockquote className="border-l-2 border-cyber-blue pl-3.5 py-1.5 bg-cyber-blue/10 rounded-r-lg font-mono text-xs sm:text-sm text-cyber-blue-light italic">
                  {selectedItem.quote}
                </blockquote>
              )}

              {/* Metrics HUD Row */}
              {selectedItem.metrics && selectedItem.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {selectedItem.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="p-2.5 rounded-lg border border-[#1E293B] bg-[#030712]/70 flex flex-col gap-0.5"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
