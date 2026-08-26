"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { ClubEvent, formatEventDisplayDate } from "@/data/eventsData";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";
import { CloudinaryImage } from "@/components/ui/cloudinary";

interface TimelineEventCardProps {
  event: ClubEvent;
  align: "left" | "right";
}

const TYPE_STYLES: Record<
  ClubEvent["type"],
  { text: string; dot: string; border: string; bg: string; glow: string; accentBorder: string }
> = {
  CTF: {
    text: "text-red-400",
    dot: "bg-red-400",
    border: "border-red-500/40",
    bg: "bg-red-500/10",
    glow: "shadow-[0_0_12px_rgba(248,113,113,0.35)]",
    accentBorder: "border-l-red-500",
  },
  Workshop: {
    text: "text-cyan-300",
    dot: "bg-cyan-400",
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
    glow: "shadow-[0_0_12px_rgba(34,211,238,0.35)]",
    accentBorder: "border-l-cyan-400",
  },
  Seminar: {
    text: "text-purple-300",
    dot: "bg-purple-400",
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
    glow: "shadow-[0_0_12px_rgba(192,132,252,0.35)]",
    accentBorder: "border-l-purple-400",
  },
  Bootcamp: {
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_12px_rgba(52,211,153,0.35)]",
    accentBorder: "border-l-emerald-400",
  },
};

function renderTimelineStatusBadge(status?: ClubEvent["status"]) {
  if (!status) return null;
  switch (status) {
    case "ONGOING":
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase border border-emerald-500/50 bg-emerald-500/20 text-emerald-300 flex items-center gap-1.5 shadow-[0_0_10px_rgba(52,211,153,0.4)] backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ONGOING
        </span>
      );
    case "UPCOMING":
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase border border-cyber-blue/50 bg-cyber-blue/20 text-cyber-blue-light flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,136,255,0.3)] backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
          UPCOMING
        </span>
      );
    case "PAST":
      return (
        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold tracking-widest uppercase bg-[#030712]/80 border border-[#1E293B] text-slate-400 backdrop-blur-md">
          PAST
        </span>
      );
  }
}

export default function TimelineEventCard({ event, align }: TimelineEventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const styles = TYPE_STYLES[event.type] || TYPE_STYLES.Workshop;
  const hasImage = Boolean(event.imageUrl && event.imageUrl.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -20 : 20, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full"
    >
      <CyberCardBorder
        isHovered={isHovered}
        className={`shadow-xl group transition-all duration-300 ${!hasImage ? `border-l-2 ${styles.accentBorder}` : ""}`}
        contentClassName="flex flex-col overflow-hidden"
      >
        <ScanlineOverlay opacity="opacity-[0.025]" />

        {/* 1. Optional Hero Visual Banner (Only rendered when event has a valid image) */}
        {hasImage && (
          <div className="relative h-36 sm:h-44 w-full overflow-hidden border-b border-[#1E293B] bg-[#070D1D]">
            <CloudinaryImage
              src={event.imageUrl!}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 520px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Seamless Vignette & Cyber Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/30 to-transparent pointer-events-none" />

            {/* Type badge overlay */}
            <div className="absolute top-3 left-3 z-10">
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md ${styles.border} ${styles.bg} ${styles.text} ${styles.glow} flex items-center gap-1.5`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} animate-pulse`} />
                {event.type}
              </span>
            </div>

            {/* Status indicator badge */}
            <div className="absolute top-3 right-3 z-10">
              {renderTimelineStatusBadge(event.status)}
            </div>
          </div>
        )}

        {/* 2. Card Content Area */}
        <div className="p-4 sm:p-5 flex flex-col gap-3">
          {/* Top metadata row for cards WITHOUT image */}
          {!hasImage && (
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-[#1E293B]/60">
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border ${styles.border} ${styles.bg} ${styles.text} ${styles.glow} flex items-center gap-1.5`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} animate-pulse`} />
                {event.type}
              </span>

              <div className="flex items-center gap-2">
                {renderTimelineStatusBadge(event.status)}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <h3 className="font-mono font-bold text-base sm:text-lg text-white group-hover:text-cyber-blue-light transition-colors leading-snug">
              {event.title}
            </h3>
          </div>

          {/* Time, Date, Venue Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-2 p-1.5 rounded bg-[#030712]/70 border border-[#1E293B]">
              <Calendar className="w-3.5 h-3.5 text-cyber-blue shrink-0" />
              <span className="truncate">{formatEventDisplayDate(event.date)}</span>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded bg-[#030712]/70 border border-[#1E293B]">
              <Clock className="w-3.5 h-3.5 text-cyber-blue shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3">
            {event.description}
          </p>

          {/* Tags & Action Link */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1E293B]/60">
            <div className="flex flex-wrap gap-1.5">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-[#030712] border border-[#1E293B] text-slate-400 font-mono text-[10px]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {event.registrationUrl && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cyber-blue/10 hover:bg-cyber-blue border border-cyber-blue/30 text-cyber-blue hover:text-black font-mono text-[11px] font-bold transition-all ml-auto"
              >
                <span>Register</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </CyberCardBorder>
    </motion.div>
  );
}
