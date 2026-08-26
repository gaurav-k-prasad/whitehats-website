"use client";

import CipherReveal from "@/components/ui/CipherReveal";
import { ClubEvent, EVENTS_DATA } from "@/data/eventsData";
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import TimelineEventCard from "./TimelineEventCard";

type EventFilterType = "All" | "CTF" | "Workshop" | "Seminar" | "Bootcamp";

const FILTER_OPTIONS: { label: string; value: EventFilterType }[] = [
  { label: "All Events", value: "All" },
  { label: "CTF", value: "CTF" },
  { label: "Workshop", value: "Workshop" },
  { label: "Seminar", value: "Seminar" },
  { label: "Bootcamp", value: "Bootcamp" },
];

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

function parseEventDate(dateStr: string): Date {
  const [day, mon, year] = dateStr.split(" ");
  const monthIndex = MONTHS[mon as keyof typeof MONTHS] ?? 0;
  return new Date(parseInt(year, 10), monthIndex, parseInt(day, 10));
}

function monthYearLabel(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} [ ${date.getFullYear()} ]`;
}

const TYPE_LINE_COLOR: Record<ClubEvent["type"], string> = {
  CTF: "bg-red-400",
  Workshop: "bg-cyan-400",
  Seminar: "bg-purple-400",
  Bootcamp: "bg-emerald-400",
};

export default function EventsTimeline() {
  const [activeFilter, setActiveFilter] = useState<EventFilterType>("All");

  const filteredEvents = useMemo(() => {
    const base =
      activeFilter === "All" ? EVENTS_DATA : EVENTS_DATA.filter((e) => e.type === activeFilter);
    // Most recent operation first, matching an operations-log feel.
    return [...base].sort(
      (a, b) => parseEventDate(b.date).getTime() - parseEventDate(a.date).getTime()
    );
  }, [activeFilter]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <section id="past-events" className="w-full flex flex-col gap-8 pt-4">
      {/* Header Bar: Title & Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wider uppercase text-white">
            <CipherReveal text="// OPERATIONS TIMELINE" duration={400} />
          </h2>
          <span className="font-mono text-xs text-slate-500 px-2 py-0.5 rounded bg-[#0B1120] border border-[#1E293B]">
            {filteredEvents.length} RECORDS
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#0B1120] border border-[#1E293B]">
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`relative px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all duration-200 cursor-pointer ${isActive
                  ? "bg-[#1E293B] text-[#0088FF] border border-cyber-blue/40 shadow-[0_0_12px_rgba(0,136,255,0.2)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#121826] border border-transparent"
                  }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center gap-2 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
          <p className="font-mono text-sm text-slate-400">
            // NO ARCHIVED OPERATIONS FOUND UNDER THIS CATEGORY
          </p>
        </div>
      ) : (
        <div ref={containerRef} className="relative flex flex-col gap-10 sm:gap-14 py-4">
          {/* Central spine base track */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-[2px] bg-cyber-blue/20" />

          {/* Dynamic Scroll Neon Glow overlay track */}
          <div
            className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-[2px] pointer-events-none shadow-[0_0_15px_rgba(0,136,255,0.8)]"
            style={{
              background: "linear-gradient(to bottom, rgba(0, 136, 255, 0.15) 0%, rgba(0, 136, 255, 0.9) 35%, #00f0ff 50%, rgba(0, 136, 255, 0.9) 65%, rgba(0, 136, 255, 0.15) 100%)",
              backgroundAttachment: "fixed",
            }}
          />

          {filteredEvents.map((event, idx) => {
            const eventDate = parseEventDate(event.date);
            const label = monthYearLabel(eventDate);
            const prevDate =
              idx > 0 ? parseEventDate(filteredEvents[idx - 1].date) : null;
            const showDivider =
              idx === 0 ||
              !prevDate ||
              prevDate.getMonth() !== eventDate.getMonth() ||
              prevDate.getFullYear() !== eventDate.getFullYear();

            const align: "left" | "right" = idx % 2 === 0 ? "left" : "right";
            const lineColor = TYPE_LINE_COLOR[event.type];

            return (
              <React.Fragment key={event.id}>
                {/* Month / Year divider chip on the spine */}
                {showDivider && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.35 }}
                    className="relative flex items-center md:justify-center pl-10 md:pl-0 z-20 my-2"
                  >
                    <span className="relative z-10 md:mx-auto px-4 py-1.5 rounded-full bg-[#030712] border border-cyber-blue text-cyber-blue-light font-mono text-[11px] font-bold tracking-widest shadow-[0_0_15px_rgba(0,136,255,0.4)]">
                      {label}
                    </span>
                  </motion.div>
                )}

                {/* Event row */}
                <div className="relative flex md:justify-center items-start">
                  {/* Node on the spine */}
                  <div
                    className={`absolute left-4 md:left-1/2 -translate-x-1/2 top-10 z-20 w-3.5 h-3.5 rounded-full border-2 border-[#030712] ${lineColor} shadow-[0_0_12px_rgba(0,136,255,0.8)]`}
                  />

                  {/* Horizontal connector line from spine directly into card */}
                  {/* Mobile connector */}
                  <div
                    className={`md:hidden absolute left-4 top-[46px] h-[2px] w-6 ${lineColor} opacity-80 shadow-[0_0_8px_rgba(0,136,255,0.6)]`}
                  />

                  {/* Desktop connector */}
                  <div
                    className={`hidden md:block absolute top-[46px] h-[2px] w-12 ${lineColor} opacity-80 shadow-[0_0_8px_rgba(0,136,255,0.6)] z-10 ${align === "left" ? "right-1/2" : "left-1/2"
                      }`}
                  />

                  {/* Card slot */}
                  <div
                    className={`w-full pl-10 md:pl-0 md:w-1/2 ${align === "left" ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
                      }`}
                  >
                    <TimelineEventCard event={event} align={align} />
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* End of log marker */}
          <div className="relative flex items-center gap-3 pl-10 md:pl-0 md:justify-center pt-4">
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-600 border-2 border-[#030712] shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
            <span className="md:mx-auto font-mono text-[11px] text-slate-500 tracking-widest bg-[#030712] px-3 py-1 rounded border border-card-border/60">
              // END OF LOGGED OPERATIONS
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
