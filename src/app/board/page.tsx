import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CoreLeadership from "@/components/board/CoreLeadership";
import DomainHeadsCarousel from "@/components/board/DomainHeadsCarousel";
import BoardHeroGraphic from "@/components/board/BoardHeroGraphic";
import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "Board of Directors | WhiteHats",
  description: "Meet the core leadership and domain heads leading WhiteHats Cybersecurity Club.",
};

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-bg-main text-slate-100 selection:bg-cyber-blue selection:text-black relative overflow-x-hidden font-sans">
      {/* Background Matrix Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#1E293B15_1px,transparent_1px),linear-gradient(to_bottom,#1E293B15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Main Page Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-12 lg:gap-14 pt-6 pb-12">
        <Navbar />

        {/* Board Page Hero matching Home page header structure */}
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
        <DomainHeadsCarousel />

        <Footer />
      </div>
    </div>
  );
}
