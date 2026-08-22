"use client";

import React, { useState } from "react";
import { Command } from "cmdk";
import {
  FilterCategory,
  FilterYear,
  FilterTag,
  GalleryFilterState,
} from "@/data/galleryData";

interface CommandFilterProps {
  filterState: GalleryFilterState;
  onFilterChange: (newState: GalleryFilterState) => void;
  itemCount: number;
  totalCount: number;
}

export default function CommandFilter({
  filterState,
  onFilterChange,
  itemCount,
  totalCount,
}: CommandFilterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectCategory = (cat: FilterCategory) => {
    onFilterChange({ ...filterState, category: cat });
    setOpen(false);
  };

  const selectYear = (yr: FilterYear) => {
    onFilterChange({ ...filterState, year: yr });
    setOpen(false);
  };

  const selectTag = (t: FilterTag) => {
    onFilterChange({ ...filterState, tag: t });
    setOpen(false);
  };

  const resetFilters = () => {
    onFilterChange({
      category: "ALL",
      year: "ALL",
      tag: "ALL",
      searchQuery: "",
    });
    setOpen(false);
  };

  const isFiltered =
    filterState.category !== "ALL" ||
    filterState.year !== "ALL" ||
    filterState.tag !== "ALL";

  return (
    <>
      {/* Bottom Right Floating Filter Button & Active Filter Pill */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 select-none pointer-events-auto">
        {isFiltered && (
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0B1120]/95 backdrop-blur-md px-3 py-2 rounded-xl border border-cyber-blue/50 shadow-[0_0_20px_rgba(0,136,255,0.25)]">
            <span className="font-mono text-[10px] text-cyber-blue-light font-bold">
              FILTERED:
            </span>
            {filterState.category !== "ALL" && (
              <span className="bg-cyber-blue/20 text-cyber-blue px-2 py-0.5 rounded text-[10px] font-mono border border-cyber-blue/30 font-semibold">
                {filterState.category}
              </span>
            )}
            {filterState.year !== "ALL" && (
              <span className="bg-cyber-blue/20 text-cyber-blue px-2 py-0.5 rounded text-[10px] font-mono border border-cyber-blue/30 font-semibold">
                {filterState.year}
              </span>
            )}
            {filterState.tag !== "ALL" && (
              <span className="bg-cyber-blue/20 text-cyber-blue px-2 py-0.5 rounded text-[10px] font-mono border border-cyber-blue/30 font-semibold">
                {filterState.tag}
              </span>
            )}
            <button
              onClick={resetFilters}
              aria-label="Clear all filters"
              className="text-slate-400 hover:text-white text-xs font-mono ml-1 px-1 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Small Bottom-Right Filter Icon Button */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open filter menu"
          className="flex items-center gap-2.5 bg-[#0B1120]/95 hover:bg-[#121826] active:bg-[#030712] backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-cyber-blue/50 hover:border-cyber-blue shadow-[0_0_20px_rgba(0,136,255,0.3)] transition-all group cursor-pointer"
        >
          {/* Cyber Filter Funnel SVG Icon */}
          <svg
            className="w-4 h-4 text-cyber-blue group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      {/* Headless CMD-K Filter Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          {/* Backdrop Click Dismiss */}
          <div
            className="fixed inset-0"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-[#0B1120] border-2 border-cyber-blue rounded-2xl shadow-[0_0_50px_rgba(0,136,255,0.4)] overflow-hidden z-10 flex flex-col max-h-[85vh]">
            {/* Ambient Cyber Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyber-blue pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyber-blue pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyber-blue pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyber-blue pointer-events-none" />

            {/* Dialog Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-card-border bg-[#030712]/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
                <span className="font-mono text-xs font-bold text-cyber-blue-light tracking-widest uppercase">
                  // GALLERY FILTER INTERFACE
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-xs font-mono px-2.5 py-1 rounded border border-[#1E293B] hover:border-cyber-blue bg-[#121826] text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* CMD-K Interface */}
            <Command
              className="flex flex-col flex-1 overflow-hidden"
              loop
            >
              <div className="flex items-center px-4 border-b border-card-border bg-[#0B1120]">
                <span className="text-cyber-blue font-mono text-sm mr-2">&gt;</span>
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Filter by category, year, or tag..."
                  className="w-full bg-transparent py-3.5 text-sm text-slate-100 placeholder-slate-500 font-mono outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-xs font-mono text-slate-500 hover:text-slate-300"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              <Command.List className="overflow-y-auto p-4 space-y-4 max-h-[55vh]">
                <Command.Empty className="py-6 text-center text-xs font-mono text-slate-500">
                  // NO MATCHING ARCHIVES FOUND
                </Command.Empty>

                {/* Quick Reset Option */}
                {isFiltered && (
                  <Command.Group heading="GLOBAL ACTIONS">
                    <Command.Item
                      onSelect={resetFilters}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-cyber-blue/15 border border-cyber-blue/40 text-cyber-blue hover:bg-cyber-blue hover:text-white cursor-pointer font-mono text-xs transition-colors"
                    >
                      <span>&gt;_ RESET ALL ACTIVE FILTERS</span>
                      <span className="text-[10px] uppercase font-bold">CLEAR</span>
                    </Command.Item>
                  </Command.Group>
                )}

                {/* CATEGORIES */}
                <Command.Group
                  heading={
                    <span className="font-mono text-[10px] text-slate-500 font-bold tracking-widest">
                      // OPERATIONS / CATEGORIES
                    </span>
                  }
                >
                  <div className="grid grid-cols-2 gap-2 pt-1.5">
                    {(
                      [
                        "ALL",
                        "HACKATHONS",
                        "WORKSHOPS",
                        "CTF",
                        "SEMINARS",
                      ] as FilterCategory[]
                    ).map((cat) => {
                      const isActive = filterState.category === cat;
                      return (
                        <Command.Item
                          key={cat}
                          value={`category ${cat}`}
                          onSelect={() => selectCategory(cat)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg border font-mono text-xs cursor-pointer transition-all ${
                            isActive
                              ? "bg-cyber-blue/20 border-cyber-blue text-cyber-blue font-bold shadow-[0_0_15px_rgba(0,136,255,0.3)]"
                              : "bg-[#121826] border-[#1E293B] text-slate-300 hover:border-cyber-blue/50 hover:text-white"
                          }`}
                        >
                          <span>{cat}</span>
                          {isActive && <span className="text-cyber-blue">✓</span>}
                        </Command.Item>
                      );
                    })}
                  </div>
                </Command.Group>

                {/* TIMELINE / YEARS */}
                <Command.Group
                  heading={
                    <span className="font-mono text-[10px] text-slate-500 font-bold tracking-widest">
                      // ARCHIVE TIMELINE
                    </span>
                  }
                >
                  <div className="grid grid-cols-3 gap-2 pt-1.5">
                    {(["ALL", "2026", "2025", "2024", "2023"] as FilterYear[]).map(
                      (yr) => {
                        const isActive = filterState.year === yr;
                        return (
                          <Command.Item
                            key={yr}
                            value={`year ${yr}`}
                            onSelect={() => selectYear(yr)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border font-mono text-xs cursor-pointer transition-all ${
                              isActive
                                ? "bg-cyber-blue/20 border-cyber-blue text-cyber-blue font-bold shadow-[0_0_15px_rgba(0,136,255,0.3)]"
                                : "bg-[#121826] border-[#1E293B] text-slate-300 hover:border-cyber-blue/50 hover:text-white"
                            }`}
                          >
                            <span>{yr}</span>
                            {isActive && <span className="text-cyber-blue">✓</span>}
                          </Command.Item>
                        );
                      }
                    )}
                  </div>
                </Command.Group>

                {/* SPECIALTY TAGS */}
                <Command.Group
                  heading={
                    <span className="font-mono text-[10px] text-slate-500 font-bold tracking-widest">
                      // INTELLIGENCE DOMAINS / TAGS
                    </span>
                  }
                >
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {(
                      [
                        "ALL",
                        "Web",
                        "Cryptography",
                        "Forensics",
                        "Reverse Engineering",
                        "Binary Exploitation",
                        "Cloud",
                        "OSINT",
                        "AI Security",
                        "Hardware",
                        "Defense",
                      ] as FilterTag[]
                    ).map((t) => {
                      const isActive = filterState.tag === t;
                      return (
                        <Command.Item
                          key={t}
                          value={`tag ${t}`}
                          onSelect={() => selectTag(t)}
                          className={`px-2.5 py-1 rounded-md border font-mono text-[11px] cursor-pointer transition-all ${
                            isActive
                              ? "bg-cyber-blue text-white border-cyber-blue font-semibold shadow-[0_0_15px_rgba(0,136,255,0.4)]"
                              : "bg-[#121826] border-[#1E293B] text-slate-300 hover:border-cyber-blue/50 hover:text-white"
                          }`}
                        >
                          #{t}
                        </Command.Item>
                      );
                    })}
                  </div>
                </Command.Group>
              </Command.List>

              {/* Status Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-card-border bg-[#030712]/70 font-mono text-[11px] text-slate-400">
                <span>
                  ACTIVE SELECTION: <strong className="text-cyber-blue">{itemCount}</strong> / {totalCount} RECORDS
                </span>
                {isFiltered && (
                  <button
                    onClick={resetFilters}
                    className="text-cyber-blue-light hover:underline uppercase text-[10px]"
                  >
                    RESET ALL
                  </button>
                )}
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
