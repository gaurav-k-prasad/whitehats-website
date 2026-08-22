"use client";

import React from "react";
import { motion } from "framer-motion";
import { FilterCategory, GalleryFilterState } from "@/data/galleryData";

interface GalleryFiltersProps {
  filterState: GalleryFilterState;
  onFilterChange: (newState: GalleryFilterState) => void;
  filteredCount: number;
  totalCount: number;
}

const CATEGORIES: FilterCategory[] = [
  "ALL",
  "CTFs",
  "WORKSHOPS",
  "HACKATHONS",
  "BEHIND THE SCENES",
];

export default function GalleryFilters({
  filterState,
  onFilterChange,
  filteredCount,
  totalCount,
}: GalleryFiltersProps) {
  const handleCategoryClick = (category: FilterCategory) => {
    onFilterChange({
      ...filterState,
      category,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filterState,
      searchQuery: e.target.value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      category: "ALL",
      searchQuery: "",
    });
  };

  const hasActiveFilter =
    filterState.category !== "ALL" || filterState.searchQuery.trim().length > 0;

  return (
    <div className="sticky top-20 z-30 w-full py-4 mb-8 bg-[#030712]/90 backdrop-blur-xl border-y border-card-border/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pill Buttons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 p-1 rounded-xl bg-[#0B1120] border border-[#1E293B]">
          {CATEGORIES.map((cat) => {
            const isActive = filterState.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`relative px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer select-none ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#121826]/60"
                }`}
              >
                {/* Framer Motion Active Pill Glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-lg bg-cyber-blue shadow-neon-blue"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Stats Counter */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-cyber-blue pointer-events-none">
              &gt;
            </span>
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={handleSearchChange}
              placeholder="Search archives, tags..."
              className="w-full pl-7 pr-8 py-1.5 rounded-xl bg-[#0B1120] border border-[#1E293B] hover:border-cyber-blue/50 focus:border-cyber-blue text-xs font-mono text-slate-200 placeholder-slate-500 outline-none transition-colors"
            />
            {filterState.searchQuery && (
              <button
                onClick={() => onFilterChange({ ...filterState, searchQuery: "" })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Records Counter */}
          <div className="flex items-center gap-2 bg-[#0B1120] px-3 py-1.5 rounded-xl border border-[#1E293B] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
            <span className="font-mono text-xs font-bold text-cyber-blue-light">
              {filteredCount} / {totalCount}
            </span>
          </div>

          {/* Reset Action */}
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="font-mono text-xs text-slate-400 hover:text-cyber-blue underline shrink-0 cursor-pointer transition-colors"
            >
              RESET
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
