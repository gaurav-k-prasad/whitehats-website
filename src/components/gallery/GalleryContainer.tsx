"use client";

import React, { useState, useMemo } from "react";
import { GALLERY_ITEMS, GalleryFilterState, GalleryItem } from "@/data/galleryData";
import GalleryFilters from "./GalleryFilters";
import HorizontalMasonry from "./HorizontalMasonry";
import LightboxModal from "./LightboxModal";

export default function GalleryContainer() {
  const [filterState, setFilterState] = useState<GalleryFilterState>({
    category: "ALL",
    searchQuery: "",
  });

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Filter items based on active category and search query
  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      // Category match
      if (
        filterState.category !== "ALL" &&
        item.category !== filterState.category
      ) {
        return false;
      }

      // Search Query match
      if (filterState.searchQuery.trim().length > 0) {
        const query = filterState.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));
        const matchesYear = item.year.includes(query);

        return matchesTitle || matchesCategory || matchesTags || matchesYear;
      }

      return true;
    });
  }, [filterState]);

  return (
    <div className="w-full flex flex-col">
      {/* Sticky Header Category & Search Filters */}
      <GalleryFilters
        filterState={filterState}
        onFilterChange={setFilterState}
        filteredCount={filteredItems.length}
        totalCount={GALLERY_ITEMS.length}
      />

      {/* Main Horizontal Multi-Row Masonry Grid */}
      <div className="w-full py-2">
        <HorizontalMasonry
          items={filteredItems}
          onSelect={setSelectedItem}
        />
      </div>

      {/* Full-Screen Glassmorphic Lightbox Modal */}
      <LightboxModal
        selectedItem={selectedItem}
        items={filteredItems}
        onClose={() => setSelectedItem(null)}
        onSelect={setSelectedItem}
      />
    </div>
  );
}
