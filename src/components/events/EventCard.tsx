"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClubEvent, formatEventDisplayDate } from "@/data/eventsData";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";

interface EventCardProps {
  event: ClubEvent;
}

const HEX_BINARY_CHARS = "0101010101ABCDEF0123456789%#$*&";

// Hook to handle deliberate terminal-style full text decryption scrambling
function useDecryptingText(originalText: string, isTriggered: boolean) {
  const [displayText, setDisplayText] = useState(originalText);

  useEffect(() => {
    if (!isTriggered) {
      return;
    }

    let frame = 0;
    const totalFrames = 22; // ~770ms total duration
    const fullScrambleFrames = 6; // First ~210ms: entire description scrambles completely
    const intervalTime = 35; // 35ms per tick

    const interval = setInterval(() => {
      frame++;

      if (frame <= fullScrambleFrames) {
        // Phase 1: 100% of the entire text scrambles
        setDisplayText(
          originalText
            .split("")
            .map((char) =>
              char === " " ? " " : HEX_BINARY_CHARS[Math.floor(Math.random() * HEX_BINARY_CHARS.length)]
            )
            .join("")
        );
      } else {
        // Phase 2: Progressive left-to-right decryption wave
        const progress = (frame - fullScrambleFrames) / (totalFrames - fullScrambleFrames);
        const resolvedLength = Math.floor(progress * originalText.length);

        setDisplayText(
          originalText
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < resolvedLength) {
                return originalText[index];
              }
              return HEX_BINARY_CHARS[Math.floor(Math.random() * HEX_BINARY_CHARS.length)];
            })
            .join("")
        );
      }

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayText(originalText);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isTriggered, originalText]);

  return displayText;
}

function renderTypeBadge(type: ClubEvent["type"]) {
  switch (type) {
    case "CTF":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-red-500/40 bg-red-500/10 text-red-400 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          CTF
        </span>
      );
    case "Workshop":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          WORKSHOP
        </span>
      );
    case "Seminar":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-purple-500/40 bg-purple-500/10 text-purple-300 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          SEMINAR
        </span>
      );
    case "Bootcamp":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          BOOTCAMP
        </span>
      );
  }
}

function renderStatusBadge(status?: ClubEvent["status"]) {
  if (!status) return null;
  switch (status) {
    case "ONGOING":
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase border border-emerald-500/50 bg-emerald-500/15 text-emerald-300 flex items-center gap-1.5 shadow-[0_0_10px_rgba(52,211,153,0.4)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ONGOING
        </span>
      );
    case "UPCOMING":
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase border border-cyber-blue/50 bg-cyber-blue/15 text-cyber-blue-light flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,136,255,0.3)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
          UPCOMING
        </span>
      );
    case "PAST":
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold tracking-widest uppercase border border-[#1E293B] bg-[#030712]/80 text-slate-400">
          PAST
        </span>
      );
  }
}

export default function EventCard({ event }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const decryptedDescription = useDecryptingText(event.description, isHovered);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.92,
        y: -10,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileHover={{ y: -5 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
        layout: { type: "spring", stiffness: 350, damping: 28 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <CyberCardBorder isHovered={isHovered} className="h-full select-none group shadow-xl" contentClassName="flex flex-col justify-between h-full">
        <ScanlineOverlay opacity="opacity-[0.03]" />

        <div>
          {/* Top Visual Graphic Block with Binary Matrix Overlay */}
          <div className="relative h-36 w-full bg-gradient-to-br from-[#060D1F] via-[#091326] to-[#0B1120] p-4 flex flex-col justify-between border-b border-[#1E293B] overflow-hidden">
            {/* Subtle Binary Code Matrix Watermark */}
            <div className="absolute inset-0 font-mono text-[9px] text-cyber-blue/[0.07] leading-tight select-none pointer-events-none p-2 break-all overflow-hidden">
              01000101 01010110 01000101 01001110 01010010 01010100 00100000 01010111 01001000 01001001 01010100 01000101 01001000 01000001 01010100 01010011 00100000 01010011 01000101 01000011 01010101 01010010 01001001 01010100 01011001 00100000 01001111 01010000 01010011
            </div>

            {/* Top Row: Type Badge & Dynamic Status Badge */}
            <div className="relative z-10 flex items-center justify-between">
              {renderTypeBadge(event.type)}
              {renderStatusBadge(event.status)}
            </div>

            {/* Large Stylized Event Title */}
            <div className="relative z-10">
              <h3 className="font-mono font-black text-lg sm:text-xl text-white group-hover:text-cyber-blue-light transition-colors line-clamp-1 tracking-tight">
                {event.title}
              </h3>
            </div>
          </div>

          {/* Metadata Bar (Date, Time, Location) */}
          <div className="px-4 py-2.5 bg-[#070D18] border-b border-[#1E293B]/70 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300">
              <svg className="w-3.5 h-3.5 text-cyber-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatEventDisplayDate(event.date)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          </div>

          {/* Content Block (Decrypted Description & Time) */}
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyber-blue-light/80">
              <svg className="w-3 h-3 text-cyber-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{event.time}</span>
            </div>

            <p className="text-xs text-[#94A3B8] font-mono leading-relaxed line-clamp-3 min-h-[3rem] transition-colors group-hover:text-slate-200">
              {decryptedDescription}
            </p>
          </div>
        </div>

        {/* Tags Footer */}
        <div className="px-4 pb-4 pt-1 flex flex-wrap gap-1.5">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-[#030712] border border-[#1E293B] text-slate-400 font-mono text-[10px]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CyberCardBorder>
    </motion.div>
  );
}
