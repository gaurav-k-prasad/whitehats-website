"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  GALLERY_ITEMS,
  GalleryFilterState,
} from "@/data/galleryData";
import CommandFilter from "./CommandFilter";

// Dynamically import FisheyeCanvas without SSR to prevent window measurement hydration mismatch
const FisheyeCanvas = dynamic(() => import("./FisheyeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#030712] gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
      <span className="font-mono text-xs text-cyber-blue-light tracking-widest uppercase">
        // LOADING GALLERY...
      </span>
    </div>
  ),
});

export default function GalleryContainer() {
  const [filterState, setFilterState] = useState<GalleryFilterState>({
    category: "ALL",
    year: "ALL",
    tag: "ALL",
    searchQuery: "",
  });

  // Filter items matching active category, year, and tag selections
  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      // Category match
      if (
        filterState.category !== "ALL" &&
        item.category !== filterState.category
      ) {
        return false;
      }
      // Year match
      if (filterState.year !== "ALL" && item.year !== filterState.year) {
        return false;
      }
      // Tag match
      if (
        filterState.tag !== "ALL" &&
        !item.tags.includes(filterState.tag as any)
      ) {
        return false;
      }
      return true;
    });
  }, [filterState]);

  return (
    <div className="w-full h-screen overflow-hidden bg-[#030712] relative">
      {/* 2D Command Palette Filter UI Overlay (z-40) */}
      <CommandFilter
        filterState={filterState}
        onFilterChange={setFilterState}
        itemCount={filteredItems.length}
        totalCount={GALLERY_ITEMS.length}
      />

      {/* 2D Fisheye Honeycomb Canvas & Physics Engine (z-0) */}
      <FisheyeCanvas items={filteredItems} />
    </div>
  );
}
