import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GalleryContainer from "@/components/gallery/GalleryContainer";
import GalleryHeroGraphic from "@/components/gallery/GalleryHeroGraphic";
import PageHero from "@/components/ui/PageHero";
import CyberGrid from "@/components/ui/CyberGrid";
import { fetchAllGalleryItems } from "@/lib/db";

export const metadata = {
  title: "Archival Media | WhiteHats Gallery",
  description:
    "Explore WhiteHats hackathons, CTFs, technical workshops, and behind-the-scenes moments through an animated high-performance masonry media grid.",
};

export default async function GalleryPage() {
  const items = await fetchAllGalleryItems();

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyber-blue selection:text-white font-sans">
      {/* Dynamic Cyber HUD Background with Parallax Nodes */}
      <CyberGrid />

      {/* Top Header Container (Contained within max-w-7xl) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-10 lg:gap-12 pt-6 w-full">
        <Navbar />

        {/* Gallery Hero Header */}
        <PageHero
          label="// OPERATIONAL INTEL // WHITEHATS ARCHIVES"
          headingPrefix="< ARCHIVE"
          headingSuffix="GALLERY />"
          description="Classified photographic records covering national hackathons, offensive CTFs, technical bootcamps, and behind-the-scenes team milestones."
          variant="slide-up"
          rightSlot={<GalleryHeroGraphic />}
        />
      </div>

      {/* Actual Gallery: Full-width outlier expanding to edge of screen */}
      <main className="relative z-10 flex-1 w-full pb-16 pt-6">
        <GalleryContainer initialItems={items} />
      </main>

      {/* Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
        <Footer />
      </div>
    </div>
  );
}
