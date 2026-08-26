"use client";

import React, { useState, useEffect, useMemo } from "react";
import { GalleryFilterState, GalleryItem } from "@/data/galleryData";
import GalleryFilters from "./GalleryFilters";
import HorizontalMasonry from "./HorizontalMasonry";
import LightboxModal from "./LightboxModal";

interface GalleryContainerProps {
  initialItems?: GalleryItem[];
}

export default function GalleryContainer({ initialItems }: GalleryContainerProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems || []);
  const [isLoading, setIsLoading] = useState(!initialItems);
  const [filterState, setFilterState] = useState<GalleryFilterState>({
    category: "ALL",
    searchQuery: "",
  });

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!initialItems) {
      fetch("/api/gallery")
        .then((res) => res.json())
        .then((data) => {
          setItems(data.items || []);
        })
        .catch(() => {
          setItems([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [initialItems]);

  // Filter items based on active category and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
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
  }, [filterState, items]);

  return (
    <div className="w-full flex flex-col">
      {/* Sticky Header Category & Search Filters */}
      <GalleryFilters
        filterState={filterState}
        onFilterChange={setFilterState}
        filteredCount={filteredItems.length}
        totalCount={items.length}
      />

      {/* Main Horizontal Multi-Row Masonry Grid */}
      <div className="w-full py-2">
        <HorizontalMasonry
          items={filteredItems}
          isLoading={isLoading}
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
