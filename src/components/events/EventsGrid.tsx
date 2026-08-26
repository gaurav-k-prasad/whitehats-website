"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClubEvent, sortEventsDescending } from "@/data/eventsData";
import EventCard from "./EventCard";
import CipherReveal from "@/components/ui/CipherReveal";

type EventFilterType = "All" | "CTF" | "Workshop" | "Seminar" | "Bootcamp";

const FILTER_OPTIONS: { label: string; value: EventFilterType }[] = [
  { label: "All Events", value: "All" },
  { label: "CTF", value: "CTF" },
  { label: "Workshop", value: "Workshop" },
  { label: "Seminar", value: "Seminar" },
  { label: "Bootcamp", value: "Bootcamp" },
];

interface EventsGridProps {
  events?: ClubEvent[];
}

export default function EventsGrid({ events: initialEvents }: EventsGridProps) {
  const [eventsList, setEventsList] = useState<ClubEvent[]>(initialEvents || []);
  const [isLoading, setIsLoading] = useState(!initialEvents);
  const [activeFilter, setActiveFilter] = useState<EventFilterType>("All");

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
    const list = activeFilter === "All" ? eventsList : eventsList.filter((event) => event.type === activeFilter);
    return sortEventsDescending(list);
  }, [activeFilter, eventsList]);

  return (
    <section id="past-events" className="w-full flex flex-col gap-6 pt-4">
      {/* Header Bar: Title & Tactical Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wider uppercase text-white">
            <CipherReveal text="// PAST EVENTS" duration={400} />
          </h2>
          <span className="font-mono text-xs text-slate-500 px-2 py-0.5 rounded bg-[#0B1120] border border-[#1E293B]">
            {isLoading ? "SYNCING..." : `${filteredEvents.length} RECORDS`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#0B1120] border border-[#1E293B]">
          {FILTER_OPTIONS.map((option) => {
            const isActive = activeFilter === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`relative px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
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

      {isLoading ? (
        <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
          <p className="font-mono text-xs text-cyber-blue font-bold tracking-widest uppercase animate-pulse">
            {"// SYNCHRONIZING EVENT ARCHIVES..."}
          </p>
        </div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredEvents.length === 0 && (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center gap-2 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
              <p className="font-mono text-sm text-slate-400">
                {"// NO ARCHIVED EVENTS FOUND UNDER THIS CATEGORY"}
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
