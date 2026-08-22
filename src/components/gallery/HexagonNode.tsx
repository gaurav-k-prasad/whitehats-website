"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, MotionValue, useTransform } from "framer-motion";
import { GalleryItem } from "@/data/galleryData";
import { HEX_WIDTH, HEX_HEIGHT } from "./hexUtils";

interface HexagonNodeProps {
  item: GalleryItem;
  x: number;
  y: number;
  canvasX: MotionValue<number>;
  canvasY: MotionValue<number>;
  canvasScale: MotionValue<number>;
  maxRadius: number;
  onSelect: (item: GalleryItem) => void;
}

const HEX_CLIP_PATH = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export default function HexagonNode({
  item,
  x,
  y,
  canvasX,
  canvasY,
  canvasScale,
  maxRadius,
  onSelect,
}: HexagonNodeProps) {
  const [imageError, setImageError] = useState(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  // GPU-accelerated Fisheye Scale taking active zoom level into account
  const scale = useTransform(
    [canvasX, canvasY, canvasScale],
    (latest: number[]): number => {
      const [cx = 0, cy = 0, s = 1] = latest;
      // Calculate true visual position relative to the screen center
      const screenX = cx + x * s;
      const screenY = cy + y * s;
      const screenDist = Math.hypot(screenX, screenY);

      // Node at the center of the viewport is always 1.0 (Full Size!)
      const ratio = Math.min(1, screenDist / maxRadius);
      return Math.max(0.42, 1 - ratio * ratio * 0.58);
    }
  );

  // GPU-accelerated Fisheye Opacity taking active zoom level into account
  const opacity = useTransform(
    [canvasX, canvasY, canvasScale],
    (latest: number[]): number => {
      const [cx = 0, cy = 0, s = 1] = latest;
      const screenX = cx + x * s;
      const screenY = cy + y * s;
      const screenDist = Math.hypot(screenX, screenY);

      if (screenDist <= maxRadius) return 1;
      return Math.max(0, 1 - (screenDist - maxRadius) / 220);
    }
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Verify that pointer didn't move during drag
    if (pointerStartRef.current) {
      const distMoved = Math.hypot(
        e.clientX - pointerStartRef.current.x,
        e.clientY - pointerStartRef.current.y
      );
      if (distMoved > 6) {
        return; // User was dragging, do not open details
      }
    }
    onSelect(item);
  };

  return (
    <motion.div
      style={{
        left: x,
        top: y,
        scale,
        opacity,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      className="absolute select-none cursor-pointer origin-center -translate-x-1/2 -translate-y-1/2 hover:z-30 z-10 group"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {/* 2D HONEYCOMB HEXAGON TILE */}
      <div
        style={{
          width: HEX_WIDTH,
          height: HEX_HEIGHT,
        }}
        className="relative flex items-center justify-center select-none"
      >
        {/* Outer Hexagon Border / Electric Blue Glow Frame */}
        <div
          style={{
            clipPath: HEX_CLIP_PATH,
          }}
          className="absolute inset-0 bg-[#1E293B] group-hover:bg-[#0088FF] group-hover:shadow-[0_0_30px_rgba(0,136,255,0.9)] transition-all duration-200 pointer-events-none"
        />

        {/* Inner Hexagon Container (inset by 3px for crisp cyber border) */}
        <div
          style={{
            clipPath: HEX_CLIP_PATH,
            width: HEX_WIDTH - 6,
            height: HEX_HEIGHT - 6,
          }}
          className="absolute bg-[#0B1120] overflow-hidden flex items-center justify-center pointer-events-none select-none"
        >
          {/* Background Image (Clean full-bleed without overlay text) */}
          {item.imageUrl && !imageError ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              draggable={false}
              sizes="190px"
              className="object-cover transition-all duration-300 opacity-90 group-hover:opacity-100 group-hover:scale-105 group-hover:brightness-110 pointer-events-none select-none"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-center p-2 pointer-events-none select-none">
              <div className="w-10 h-10 rounded-full border border-dashed border-cyber-blue/60 flex items-center justify-center text-cyber-blue">
                <span className="font-mono text-xs font-bold">#{item.id}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
