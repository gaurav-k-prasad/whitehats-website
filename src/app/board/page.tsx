import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CoreLeadership from "@/components/board/CoreLeadership";
import ViceLeadership from "@/components/board/ViceLeadership";
import DomainHeadsCarousel from "@/components/board/DomainHeadsCarousel";
import BoardHeroGraphic from "@/components/board/BoardHeroGraphic";
import PageHero from "@/components/ui/PageHero";
import CyberGrid from "@/components/ui/CyberGrid";

export const metadata = {
  title: "Board of Directors | WhiteHats",
  description: "Meet the core leadership and domain heads leading WhiteHats Cybersecurity Club.",
};

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-bg-main text-slate-100 selection:bg-cyber-blue selection:text-black relative overflow-x-hidden font-sans">
      {/* Dynamic Cyber HUD Background with Parallax Nodes */}
      <CyberGrid />

      {/* Main Page Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-12 lg:gap-14 pt-6 pb-12">
        <Navbar />

        {/* Board Page Hero */}
        <PageHero
          label="// WHITEHATS DIRECTORY"
          headingPrefix="< THE EXECUTIVE"
          headingSuffix="BOARD />"
          description="Meet the core leadership and domain specialists commanding research, offensive security operations, infrastructure, and community directives."
          variant="cipher"
          rightSlot={<BoardHeroGraphic />}
        />

        {/* Board Sections */}
        <CoreLeadership />
        <ViceLeadership />
        <DomainHeadsCarousel />

        <Footer />
      </div>
    </div>
  );
}
