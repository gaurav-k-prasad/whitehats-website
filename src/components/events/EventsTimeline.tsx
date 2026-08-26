"use client";

import CipherReveal from "@/components/ui/CipherReveal";
import { ClubEvent, sortEventsDescending } from "@/data/eventsData";
import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo, useState, useEffect } from "react";
import TimelineEventCard from "./TimelineEventCard";
import EventCard from "./EventCard";
import { LayoutGrid, ListTree, Search, Sparkles } from "lucide-react";

type EventFilterType = "All" | "Hackathon" | "CTF" | "Workshop" | "Seminar" | "Bootcamp";
type ViewMode = "timeline" | "grid";

const FILTER_OPTIONS: { label: string; value: EventFilterType }[] = [
  { label: "All Events", value: "All" },
  { label: "Hackathons", value: "Hackathon" },
  { label: "CTFs", value: "CTF" },
  { label: "Workshops", value: "Workshop" },
  { label: "Seminars", value: "Seminar" },
  { label: "Bootcamps", value: "Bootcamp" },
];

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

const SHORT_MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

function parseEventDate(dateStr: string): Date {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date(2026, 0, 1) : d;
}

function monthYearLabel(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} [ ${date.getFullYear()} ]`;
}

const TYPE_DOT_COLOR: Record<ClubEvent["type"], string> = {
  Hackathon: "bg-amber-400 border-amber-500 shadow-[0_0_15px_#fbbf24]",
  CTF: "bg-red-400 border-red-500 shadow-[0_0_15px_#f87171]",
  Workshop: "bg-cyan-400 border-cyan-500 shadow-[0_0_15px_#22d3ee]",
  Seminar: "bg-purple-400 border-purple-500 shadow-[0_0_15px_#c084fc]",
  Bootcamp: "bg-emerald-400 border-emerald-500 shadow-[0_0_15px_#34d399]",
};

interface EventsTimelineProps {
  events?: ClubEvent[];
}

export default function EventsTimeline({ events: initialEvents }: EventsTimelineProps) {
  const [eventsList, setEventsList] = useState<ClubEvent[]>(initialEvents || []);
  const [isLoading, setIsLoading] = useState(!initialEvents);
  const [activeFilter, setActiveFilter] = useState<EventFilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");

  useEffect(() => {
    if (!initialEvents) {
      fetch("/api/events")
        .then((res) => res.json())
        .then((data) => {
          setEventsList(data.events || []);
        })
        .catch(() => {
          setEventsList([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [initialEvents]);

  const filteredEvents = useMemo(() => {
    let base =
      activeFilter === "All" ? eventsList : eventsList.filter((e) => e.type === activeFilter);

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      base = base.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return sortEventsDescending(base);
  }, [activeFilter, eventsList, searchQuery]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <section id="past-events" className="w-full flex flex-col gap-8 pt-4 relative">
      {/* 1. Header Toolbar: Title, Search, Category Pills & View Switcher */}
      <div className="flex flex-col gap-4 border-b border-[#1E293B] pb-6 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-ping" />
            <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wider uppercase text-white">
              <CipherReveal text="// OPERATIONS TIMELINE" duration={400} />
            </h2>
            <span className="font-mono text-xs text-cyber-blue-light px-2.5 py-1 rounded-md bg-[#0B1120] border border-cyber-blue/30 font-bold shadow-sm">
              {isLoading ? "SYNCING..." : `${filteredEvents.length} OPERATIONS`}
            </span>
          </div>

          {/* Search & View Mode Switcher */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search operation or #tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050A15] border border-[#1E293B] focus:border-cyber-blue text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none transition-colors"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-lg bg-[#050A15] border border-[#1E293B]">
              <button
                onClick={() => setViewMode("timeline")}
                title="Timeline Chronology"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "timeline"
                    ? "bg-cyber-blue text-black font-bold shadow-neon-blue scale-105"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ListTree className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                title="Matrix Grid View"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-cyber-blue text-black font-bold shadow-neon-blue scale-105"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills with Framer Motion Animated Slider */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`relative px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-cyber-blue shadow-[0_0_15px_rgba(0,136,255,0.3)]"
                    : "text-slate-400 hover:text-slate-200 border border-[#1E293B]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTimelineFilter"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#121E36] border border-cyber-blue/60 rounded-lg -z-10 shadow-neon-blue"
                  />
                )}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
          <p className="font-mono text-xs text-cyber-blue font-bold tracking-widest uppercase animate-pulse">
            {"// SYNCHRONIZING OPERATIONS TIMELINE..."}
          </p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center gap-2 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40 font-mono">
          <p className="text-sm text-slate-300">
            {"// NO MATCHING OPERATIONS FOUND IN LOGS"}
          </p>
          <p className="text-xs text-slate-500">
            Try adjusting your keyword search or category filter.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Dense 3-Column Cyber Grid Matrix */
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Full-Width Expansive Vertical Timeline Stream */
        <div ref={containerRef} className="relative w-full flex flex-col gap-10 sm:gap-14 py-4">
          {/* Vertical Glowing Laser Track */}
          <div className="absolute left-4 md:left-24 top-4 bottom-4 w-[2px] bg-cyber-blue/20" />
          <div
            className="absolute left-4 md:left-24 top-4 bottom-4 w-[2px] pointer-events-none shadow-[0_0_15px_rgba(0,136,255,0.7)]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0, 136, 255, 0.2) 0%, rgba(0, 136, 255, 0.9) 25%, #00f0ff 50%, rgba(0, 136, 255, 0.9) 75%, rgba(0, 136, 255, 0.2) 100%)",
            }}
          />

          {filteredEvents.map((event, idx) => {
            const eventDate = parseEventDate(event.date);
            const label = monthYearLabel(eventDate);
            const dayStr = eventDate.getDate().toString().padStart(2, "0");
            const monthStr = SHORT_MONTHS[eventDate.getMonth()];
            const yearStr = eventDate.getFullYear().toString();

            const prevDate =
              idx > 0 ? parseEventDate(filteredEvents[idx - 1].date) : null;
            const showDivider =
              idx === 0 ||
              !prevDate ||
              prevDate.getMonth() !== eventDate.getMonth() ||
              prevDate.getFullYear() !== eventDate.getFullYear();

            const dotColor = TYPE_DOT_COLOR[event.type] || "bg-cyan-400 border-cyan-500 shadow-[0_0_15px_#22d3ee]";

            return (
              <React.Fragment key={event.id}>
                {/* Month Milestone Gate with Horizontal Laser Horizon */}
                {showDivider && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.35 }}
                    className="relative flex items-center pl-10 md:pl-24 z-20 my-2"
                  >
                    {/* Horizon Laser Scan Rays */}
                    <div className="hidden md:block absolute left-24 right-1/4 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-cyber-blue/70 via-cyber-blue/30 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-2 px-5 py-2 rounded-full bg-[#030712] border border-cyber-blue text-cyber-blue-light font-mono text-xs font-bold tracking-widest shadow-[0_0_20px_rgba(0,136,255,0.45)]">
                      <Sparkles className="w-3.5 h-3.5 text-cyber-blue animate-pulse" />
                      <span>{label}</span>
                    </div>
                  </motion.div>
                )}

                {/* Timeline Row: Date Callout on Left + Full-Width Horizontal Card on Right */}
                <div className="relative flex items-start gap-4 md:gap-6 w-full group">
                  {/* Desktop Date Milestone Callout with Hover Spring Physics */}
                  <motion.div
                    whileHover={{ scale: 1.1, x: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="hidden md:flex flex-col items-end w-20 shrink-0 pt-8 select-none font-mono cursor-default"
                  >
                    <span className="text-3xl font-black text-white tracking-tight leading-none drop-shadow-md group-hover:text-cyber-blue-light transition-colors">
                      {dayStr}
                    </span>
                    <span className="text-xs font-bold text-cyber-blue tracking-wider mt-0.5">
                      {monthStr}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {yearStr}
                    </span>
                  </motion.div>

                  {/* Central Node Marker with Multi-Layer Radar Wave */}
                  <div className="absolute left-4 md:left-24 -translate-x-1/2 top-10 z-20 flex items-center justify-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${dotColor} relative z-10`} />
                    <motion.div
                      animate={{
                        scale: [1, 2.2, 1],
                        opacity: [0.7, 0, 0.7],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: (idx % 3) * 0.4,
                      }}
                      className="absolute w-4 h-4 rounded-full bg-cyber-blue/50 pointer-events-none"
                    />
                  </div>

                  {/* Horizontal Connector Laser Line with Animated Photon Travel */}
                  <div className="absolute left-4 md:left-24 top-[48px] w-6 md:w-8 h-[2px] bg-cyber-blue/40 pointer-events-none overflow-hidden">
                    <motion.div
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: (idx % 3) * 0.3,
                      }}
                      className="w-full h-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
                    />
                  </div>

                  {/* Full-Width Event Card */}
                  <div className="w-full pl-8 md:pl-6 flex-1 min-w-0">
                    <TimelineEventCard event={event} index={idx} />
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* End of Operations Log Anchor */}
          <div className="relative flex items-center pl-10 md:pl-24 pt-6">
            <div className="absolute left-4 md:left-24 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-slate-600 border-2 border-[#030712] shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <span className="font-mono text-xs text-slate-400 tracking-widest bg-[#050A15] px-5 py-2 rounded-full border border-card-border shadow-lg">
              {"// END OF LOGGED OPERATIONS ARCHIVE"}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
