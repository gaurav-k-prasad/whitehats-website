import GalleryContainer from "@/components/gallery/GalleryContainer";
import GalleryHeroGraphic from "@/components/gallery/GalleryHeroGraphic";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageHero from "@/components/ui/PageHero";
import React from "react";

export const metadata = {
  title: "Archival Media | WhiteHats Gallery",
  description:
    "Explore WhiteHats hackathons, CTFs, technical workshops, and behind-the-scenes moments through an animated high-performance masonry media grid.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyber-blue selection:text-white font-sans">
      {/* Background Matrix Grid Pattern & Ambient Radial Glows */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#1E293B15_1px,transparent_1px),linear-gradient(to_bottom,#1E293B15_1px,transparent_1px)] bg-[size:4rem_4rem] z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyber-blue/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[300px] bg-cyber-blue/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main Page Layout Container (Aligned with Home, Events, Projects, Board) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-10 lg:gap-12 pt-6 pb-12 w-full flex-1">
        <Navbar />

        {/* Gallery Hero Header matching Home page layout */}
        <PageHero
          label="// OPERATIONAL INTEL // WHITEHATS ARCHIVES"
          headingPrefix="< ARCHIVE"
          headingSuffix="GALLERY />"
          description="100+ classified records covering national hackathons, offensive CTFs, technical bootcamps, and behind-the-scenes team milestones."
          variant="slide-up"
          rightSlot={<GalleryHeroGraphic />}
        />

        {/* Main Animated Masonry Media Grid */}
        <main className="w-full">
          <GalleryContainer />
        </main>

        <Footer />
      </div>
    </div>
  );
}
