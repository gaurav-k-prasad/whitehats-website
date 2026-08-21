import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CoreLeadership from "@/components/board/CoreLeadership";
import DomainHeadsCarousel from "@/components/board/DomainHeadsCarousel";

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

        {/* Page Hero Header */}
        <div className="flex flex-col items-center text-center gap-3 pt-4">
          <div className="font-mono text-xs text-cyber-blue tracking-widest uppercase">
            // WHITEHATS DIRECTORY
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight uppercase">
            <span className="text-slate-100">&lt; THE EXECUTIVE</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-blue-light to-blue-300 drop-shadow-[0_0_25px_rgba(0,136,255,0.45)]">
              BOARD /&gt;
            </span>
          </h1>
          <div className="w-12 h-1 bg-cyber-blue/80 rounded-full my-1" />
          <p className="text-text-muted text-sm sm:text-base max-w-xl">
            Meet the core leadership and domain specialists commanding research, offensive security operations, infrastructure, and community directives.
          </p>
        </div>

        {/* Board Sections */}
        <CoreLeadership />
        <DomainHeadsCarousel />

        <Footer />
      </div>
    </div>
  );
}
