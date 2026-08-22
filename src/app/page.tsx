import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeatureGrid from "@/components/home/FeatureGrid";
import Footer from "@/components/layout/Footer";
import CyberGrid from "@/components/ui/CyberGrid";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-main text-slate-100 selection:bg-cyber-blue selection:text-black relative overflow-x-hidden font-sans">
      {/* Dynamic Cyber HUD Background with Parallax Nodes */}
      <CyberGrid />

      {/* Main Page Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-12 lg:gap-16 pt-6 pb-12">
        <Navbar />
        <HeroSection />
        <FeatureGrid />
        <Footer />
      </div>
    </div>
  );
}
