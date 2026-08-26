"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClubEvent } from "@/data/eventsData";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";
import { CloudinaryImage } from "@/components/ui/cloudinary";

interface TimelineEventCardProps {
  event: ClubEvent;
  align: "left" | "right";
}

const TYPE_STYLES: Record<
  ClubEvent["type"],
  { text: string; dot: string; border: string; bg: string; glow: string }
> = {
  CTF: {
    text: "text-red-400",
    dot: "bg-red-400",
    border: "border-red-500/40",
    bg: "bg-red-500/10",
    glow: "shadow-[0_0_10px_rgba(248,113,113,0.5)]",
  },
  Workshop: {
    text: "text-cyan-300",
    dot: "bg-cyan-400",
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
    glow: "shadow-[0_0_10px_rgba(34,211,238,0.5)]",
  },
  Seminar: {
    text: "text-purple-300",
    dot: "bg-purple-400",
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
    glow: "shadow-[0_0_10px_rgba(192,132,252,0.5)]",
  },
  Bootcamp: {
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_10px_rgba(52,211,153,0.5)]",
  },
};

export default function TimelineEventCard({ event, align }: TimelineEventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const styles = TYPE_STYLES[event.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -24 : 24, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full"
    >
      <CyberCardBorder isHovered={isHovered} className="shadow-xl group" contentClassName="flex flex-col">
        <ScanlineOverlay opacity="opacity-[0.03]" />

        {/* Cover image / gradient fallback */}
        <div className="relative h-28 sm:h-32 w-full overflow-hidden border-b border-[#1E293B]">
          {event.imageUrl ? (
            <CloudinaryImage
              src={event.imageUrl}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#060D1F] via-[#091326] to-[#0B1120] flex items-center justify-center">
              <div className="absolute inset-0 font-mono text-[9px] text-cyber-blue/[0.07] leading-tight select-none pointer-events-none p-2 break-all overflow-hidden">
                01010111 01001000 01001001 01010100 01000101 01001000 01000001 01010100 01010011 00100000 01001111 01010000 01010011
              </div>
              <span className={`relative z-10 font-mono text-[10px] tracking-widest uppercase ${styles.text}`}>
                // NO_VISUAL_ARCHIVED
              </span>
            </div>
          )}

          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${styles.border} ${styles.bg} ${styles.text} flex items-center gap-1.5 backdrop-blur-sm`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} animate-pulse`} />
              {event.type}
            </span>
          </div>
          <div className="absolute top-2.5 right-2.5 z-10 font-mono text-[10px] text-slate-400 bg-[#030712]/70 px-1.5 py-0.5 rounded backdrop-blur-sm">
            {event.id}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-mono font-black text-base sm:text-lg text-white group-hover:text-cyber-blue-light transition-colors">
            {event.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cyber-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {event.date}
            </span>
            <span>{event.time}</span>
            <span className="text-slate-500">{event.location}</span>
          </div>

          <p className="text-xs text-[#94A3B8] font-mono leading-relaxed line-clamp-2">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-[#030712] border border-[#1E293B] text-slate-400 font-mono text-[10px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </CyberCardBorder>
    </motion.div>
  );
}
