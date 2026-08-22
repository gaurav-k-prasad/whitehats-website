import React from "react";
import Navbar from "@/components/layout/Navbar";
import GalleryContainer from "@/components/gallery/GalleryContainer";

export const metadata = {
  title: "Honeycomb Archive | WhiteHats Gallery",
  description:
    "Interactive 2D Apple Watch-style fisheye honeycomb grid mapping WhiteHats hackathons, CTFs, workshops, and offensive security operations.",
};

export default function GalleryPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-[#030712] relative select-none">
      {/* Floating Top Glassmorphic Navbar Overlay (z-50) */}
      <div className="absolute top-0 left-0 right-0 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
        <div className="pointer-events-auto backdrop-blur-xl bg-[#030712]/75 rounded-2xl border border-card-border/80 px-5 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
          <Navbar />
        </div>
      </div>

      {/* 2D Fisheye Honeycomb Canvas & Command Filter Interface (z-0) */}
      <GalleryContainer />
    </main>
  );
}
