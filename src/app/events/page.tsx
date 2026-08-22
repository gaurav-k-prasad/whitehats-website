import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EventsHero from "@/components/events/EventsHero";
import EventsGrid from "@/components/events/EventsGrid";
import CyberGrid from "@/components/ui/CyberGrid";

export const metadata = {
  title: "Events & Operations | WhiteHats",
  description:
    "Explore upcoming and past cybersecurity events, CTFs, workshops, and hackathons conducted by WhiteHats Club.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-cyber-blue selection:text-black relative overflow-x-hidden font-sans">
      {/* Dynamic Cyber HUD Background with Parallax Nodes */}
      <CyberGrid />

      {/* Main Page Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-10 lg:gap-12 pt-6 pb-12">
        <Navbar />
        <EventsHero />
        <EventsGrid />
        <Footer />
      </div>
    </div>
  );
}
