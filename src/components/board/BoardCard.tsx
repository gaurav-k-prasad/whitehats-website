"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BoardMember } from "@/data/boardData";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";

interface BoardCardProps {
  member: BoardMember;
  isLarge?: boolean;
}

export default function BoardCard({ member, isLarge = false }: BoardCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full select-none"
    >
      <CyberCardBorder isHovered={isHovered} className="h-full group shadow-xl" contentClassName="p-4 sm:p-5 flex flex-col justify-between h-full">
        <ScanlineOverlay opacity="opacity-[0.03]" />

        {/* Top Image Section with strict portrait aspect ratio */}
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-card-border bg-[#121826] flex items-center justify-center group-hover:border-cyber-blue/40 transition-colors">
          {/* Technical CSS Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B25_1px,transparent_1px),linear-gradient(to_bottom,#1E293B25_1px,transparent_1px)] bg-[size:1rem_1rem] pointer-events-none z-10 opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,136,255,0.1)_0%,transparent_70%)] pointer-events-none z-10" />

          {/* Top-Left: Glowing Status Dot */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#030712]/80 backdrop-blur-md px-2 py-1 rounded-md border border-card-border">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue shadow-[0_0_8px_#0088FF] animate-pulse" />
            <span className="text-[9px] font-mono text-slate-400 font-semibold tracking-wider">ACTIVE</span>
          </div>

          {/* Top-Right: ID Tag */}
          <div className="absolute top-3 right-3 z-20 bg-[#030712]/80 backdrop-blur-md px-2 py-1 rounded-md border border-card-border text-[10px] font-mono text-cyber-blue-light font-bold">
            {member.id}
          </div>

          {/* Board Member Image or Fallback */}
          {member.imageUrl && !imageError ? (
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="relative flex flex-col items-center justify-center gap-2 select-none opacity-40 group-hover:opacity-75 transition-opacity duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-dashed border-cyber-blue/50 flex items-center justify-center text-cyber-blue">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-cyber-blue/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
                // OPERATOR ID
              </span>
            </div>
          )}

          {/* Vignette & Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-80 pointer-events-none z-10" />

          {/* Bottom Corner Accent Lines */}
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyber-blue/50 z-20" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyber-blue/50 z-20" />
        </div>

        {/* Bottom Text Section */}
        <div className="flex flex-col gap-1.5 pt-4">
          <h3
            className={`font-mono font-bold text-white group-hover:text-cyber-blue-light transition-colors ${
              isLarge ? "text-lg sm:text-xl" : "text-base sm:text-lg"
            }`}
          >
            {member.name}
          </h3>
          <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm text-cyber-blue font-semibold tracking-wide">
            <span>&gt;</span>
            <span>{member.role}</span>
          </div>
        </div>
      </CyberCardBorder>
    </motion.div>
  );
}
