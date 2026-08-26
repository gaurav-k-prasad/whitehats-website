"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Globe,
  Radio,
  Sparkles,
  Terminal,
  Shield,
  Zap,
  Cpu,
  Flame,
} from "lucide-react";
import { ClubEvent, formatEventDisplayDate } from "@/data/eventsData";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import { CloudinaryImage } from "@/components/ui/cloudinary";

interface TimelineEventCardProps {
  event: ClubEvent;
  index?: number;
}

const TYPE_STYLES: Record<
  ClubEvent["type"],
  {
    text: string;
    dot: string;
    border: string;
    bg: string;
    glow: string;
    accentBorder: string;
    icon: typeof Shield;
    gradient: string;
    spotlight: string;
  }
> = {
  Hackathon: {
    text: "text-amber-300",
    dot: "bg-amber-400 shadow-[0_0_12px_#fbbf24]",
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.4)]",
    accentBorder: "border-l-amber-400",
    icon: Flame,
    gradient: "from-amber-950/40 via-[#0B1120] to-[#050A15]",
    spotlight: "rgba(251, 191, 36, 0.14)",
  },
  CTF: {
    text: "text-red-400",
    dot: "bg-red-400 shadow-[0_0_12px_#f87171]",
    border: "border-red-500/40",
    bg: "bg-red-500/10",
    glow: "shadow-[0_0_20px_rgba(248,113,113,0.4)]",
    accentBorder: "border-l-red-500",
    icon: Zap,
    gradient: "from-red-950/40 via-[#0B1120] to-[#050A15]",
    spotlight: "rgba(248, 113, 113, 0.14)",
  },
  Workshop: {
    text: "text-cyan-300",
    dot: "bg-cyan-400 shadow-[0_0_12px_#22d3ee]",
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
    glow: "shadow-[0_0_20px_rgba(34,211,238,0.4)]",
    accentBorder: "border-l-cyan-400",
    icon: Terminal,
    gradient: "from-cyan-950/40 via-[#0B1120] to-[#050A15]",
    spotlight: "rgba(0, 217, 255, 0.14)",
  },
  Seminar: {
    text: "text-purple-300",
    dot: "bg-purple-400 shadow-[0_0_12px_#c084fc]",
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
    glow: "shadow-[0_0_20px_rgba(192,132,252,0.4)]",
    accentBorder: "border-l-purple-400",
    icon: Shield,
    gradient: "from-purple-950/40 via-[#0B1120] to-[#050A15]",
    spotlight: "rgba(192, 132, 252, 0.14)",
  },
  Bootcamp: {
    text: "text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_12px_#34d399]",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.4)]",
    accentBorder: "border-l-emerald-400",
    icon: Cpu,
    gradient: "from-emerald-950/40 via-[#0B1120] to-[#050A15]",
    spotlight: "rgba(52, 211, 153, 0.14)",
  },
};

function renderStatusBadge(status?: ClubEvent["status"]) {
  if (!status) return null;
  switch (status) {
    case "ONGOING":
      return (
        <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase border border-emerald-500/50 bg-emerald-500/20 text-emerald-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.5)] backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          ONGOING
        </span>
      );
    case "UPCOMING":
      return (
        <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase border border-cyber-blue/50 bg-cyber-blue/20 text-cyber-blue-light flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,136,255,0.5)] backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
          UPCOMING
        </span>
      );
    case "PAST":
      return (
        <span className="px-2.5 py-1 rounded text-[9px] font-mono font-semibold tracking-widest uppercase bg-[#030712]/90 border border-[#1E293B] text-slate-400 backdrop-blur-md">
          PAST EVENT
        </span>
      );
  }
}

export default function TimelineEventCard({ event, index = 0 }: TimelineEventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const styles = TYPE_STYLES[event.type] || TYPE_STYLES.Workshop;
  const TypeIcon = styles.icon;
  const hasImage = Boolean(event.imageUrl && event.imageUrl.trim().length > 0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 3) * 0.08,
      }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full relative"
    >
      <CyberCardBorder
        isHovered={isHovered}
        className={`shadow-2xl group transition-all duration-300 border-l-2 ${styles.accentBorder} w-full relative overflow-hidden`}
        contentClassName="overflow-hidden bg-[#060B18] w-full relative"
      >
        {/* Dynamic Interactive Cursor Spotlight Follower */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, ${styles.spotlight}, transparent 75%)`,
            }}
          />
        )}

        {hasImage ? (
          /* =========================================================================
             A. 2-Column Split Layout for Events WITH Cover Image
             ========================================================================= */
          <div className="flex flex-col lg:flex-row w-full relative z-10">
            {/* Left Image Column (36% on desktop) */}
            <div className="relative lg:w-[36%] min-h-[220px] sm:min-h-[260px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-[#1E293B] overflow-hidden bg-[#070D1D] flex flex-col justify-between p-4 group">
              <CloudinaryImage
                src={event.imageUrl!}
                alt={event.title}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#060B18]/40 to-[#060B18] pointer-events-none" />

              {/* Top Badges */}
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 flex items-center justify-between gap-2"
              >
                <span
                  className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md ${styles.border} ${styles.bg} ${styles.text} ${styles.glow} flex items-center gap-1.5 transition-transform group-hover:scale-105`}
                >
                  <TypeIcon className="w-3.5 h-3.5" />
                  <span>{event.type}</span>
                </span>

                {renderStatusBadge(event.status)}
              </motion.div>

              {/* Bottom Mode & Node Identifier */}
              <div className="relative z-10 flex items-center justify-between gap-2 pt-16 lg:pt-0 font-mono text-[10px]">
                {event.mode && (
                  <span className="px-2.5 py-1 rounded-md text-slate-300 bg-[#030712]/80 border border-[#1E293B] backdrop-blur-md flex items-center gap-1">
                    {event.mode === "Online" ? (
                      <Globe className="w-3 h-3 text-cyan-400" />
                    ) : (
                      <Radio className="w-3 h-3 text-emerald-400" />
                    )}
                    <span>{event.mode}</span>
                  </span>
                )}

                <span className="text-cyber-blue-light/80 font-bold bg-[#030712]/70 px-2 py-0.5 rounded border border-[#1E293B] ml-auto">
                  {`// OP: 0x${(index + 1).toString(16).toUpperCase().padStart(2, "0")}`}
                </span>
              </div>
            </div>

            {/* Right Dossier Column (64% on desktop) */}
            <div className="p-5 sm:p-7 lg:w-[64%] flex flex-col justify-between gap-5">
              <div className="flex flex-col gap-3.5">
                {/* Title with Neon Glow Transition */}
                <div>
                  <h3 className="font-mono font-bold text-xl sm:text-2xl text-white group-hover:text-cyber-blue-light transition-colors leading-tight drop-shadow-sm group-hover:drop-shadow-[0_0_12px_rgba(0,136,255,0.5)]">
                    {event.title}
                  </h3>
                </div>

                {/* Metadata Pills: Date, Time, Venue with spring hover */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono text-slate-300">
                  <motion.div
                    whileHover={{ scale: 1.03, borderColor: "rgba(0, 136, 255, 0.4)" }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#030712] border border-[#1E293B] transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-cyber-blue shrink-0" />
                    <span className="truncate">{formatEventDisplayDate(event.date)}</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03, borderColor: "rgba(0, 136, 255, 0.4)" }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#030712] border border-[#1E293B] transition-colors"
                  >
                    <Clock className="w-4 h-4 text-cyber-blue shrink-0" />
                    <span className="truncate">{event.time}</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03, borderColor: "rgba(0, 136, 255, 0.4)" }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#030712] border border-[#1E293B] transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </motion.div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {event.description}
                </p>

                {/* Key Highlights & Tracks Grid */}
                {event.highlights && event.highlights.length > 0 && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#030712] border border-[#1E293B] flex flex-col gap-2.5 group-hover:border-cyber-blue/30 transition-colors">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-cyber-blue tracking-wider uppercase">
                      <Sparkles className="w-3 h-3 text-cyber-blue animate-pulse" />
                      <span>{"// KEY HIGHLIGHTS & TRACKS"}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {event.highlights.map((highlight, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-start gap-2 text-xs text-slate-300 font-sans group/item cursor-default"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyber-blue shrink-0 mt-0.5 group-hover/item:text-cyan-300 transition-colors" />
                          <span className="group-hover/item:text-white transition-colors">
                            {highlight}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tags & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E293B]">
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={{ scale: 1.06, y: -2 }}
                      transition={{ duration: 0.15 }}
                      className="px-2.5 py-1 rounded-md bg-[#030712] border border-[#1E293B] text-slate-400 font-mono text-[11px] hover:text-cyber-blue hover:border-cyber-blue/50 transition-all cursor-default"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>

                {event.registrationUrl && (
                  <motion.a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-blue hover:bg-cyber-blue-light text-black font-mono text-xs font-bold transition-all shadow-neon-blue ml-auto group/btn"
                  >
                    <span>REGISTER NOW</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             B. Full-Width Clean Card for Events WITHOUT Cover Image
             ========================================================================= */
          <div className="p-5 sm:p-7 flex flex-col justify-between gap-4 w-full relative z-10">
            <div className="flex flex-col gap-3.5">
              {/* Top Integrated Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border ${styles.border} ${styles.bg} ${styles.text} ${styles.glow} flex items-center gap-1.5 transition-transform group-hover:scale-105`}
                  >
                    <TypeIcon className="w-3.5 h-3.5" />
                    <span>{event.type}</span>
                  </span>

                  {event.mode && (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-300 bg-[#030712] border border-[#1E293B] flex items-center gap-1">
                      {event.mode === "Online" ? (
                        <Globe className="w-3 h-3 text-cyan-400" />
                      ) : (
                        <Radio className="w-3 h-3 text-emerald-400" />
                      )}
                      <span>{event.mode}</span>
                    </span>
                  )}

                  <span className="text-slate-500 font-mono text-[10px]">
                    {`// OP: 0x${(index + 1).toString(16).toUpperCase().padStart(2, "0")}`}
                  </span>
                </div>

                {renderStatusBadge(event.status)}
              </div>

              {/* Title */}
              <div>
                <h3 className="font-mono font-bold text-xl sm:text-2xl text-white group-hover:text-cyber-blue-light transition-colors leading-tight drop-shadow-sm group-hover:drop-shadow-[0_0_12px_rgba(0,136,255,0.5)]">
                  {event.title}
                </h3>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono text-slate-300">
                <motion.div
                  whileHover={{ scale: 1.03, borderColor: "rgba(0, 136, 255, 0.4)" }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-[#030712] border border-[#1E293B] transition-colors"
                >
                  <Calendar className="w-4 h-4 text-cyber-blue shrink-0" />
                  <span className="truncate">{formatEventDisplayDate(event.date)}</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03, borderColor: "rgba(0, 136, 255, 0.4)" }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-[#030712] border border-[#1E293B] transition-colors"
                >
                  <Clock className="w-4 h-4 text-cyber-blue shrink-0" />
                  <span className="truncate">{event.time}</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03, borderColor: "rgba(0, 136, 255, 0.4)" }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-[#030712] border border-[#1E293B] transition-colors"
                >
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </motion.div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {event.description}
              </p>

              {/* Key Highlights & Tracks Grid */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#030712] border border-[#1E293B] flex flex-col gap-2.5 group-hover:border-cyber-blue/30 transition-colors">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-cyber-blue tracking-wider uppercase">
                    <Sparkles className="w-3 h-3 text-cyber-blue animate-pulse" />
                    <span>{"// KEY HIGHLIGHTS & TRACKS"}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {event.highlights.map((highlight, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-start gap-2 text-xs text-slate-300 font-sans group/item cursor-default"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyber-blue shrink-0 mt-0.5 group-hover/item:text-cyan-300 transition-colors" />
                        <span className="group-hover/item:text-white transition-colors">
                          {highlight}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tags & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E293B]">
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.06, y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="px-2.5 py-1 rounded-md bg-[#030712] border border-[#1E293B] text-slate-400 font-mono text-[11px] hover:text-cyber-blue hover:border-cyber-blue/50 transition-all cursor-default"
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>

              {event.registrationUrl && (
                <motion.a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-blue hover:bg-cyber-blue-light text-black font-mono text-xs font-bold transition-all shadow-neon-blue ml-auto group/btn"
                >
                  <span>REGISTER NOW</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </motion.a>
              )}
            </div>
          </div>
        )}
      </CyberCardBorder>
    </motion.div>
  );
}
