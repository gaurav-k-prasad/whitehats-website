import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectHero from "@/components/projects/ProjectHero";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ContributeBanner from "@/components/projects/ContributeBanner";
import CyberGrid from "@/components/ui/CyberGrid";

export const metadata = {
  title: "Open Source Projects | WhiteHats",
  description: "Explore security tools, intrusion detection systems, and research projects built by WhiteHats.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-bg-main text-slate-100 selection:bg-cyber-blue selection:text-black relative overflow-x-hidden font-sans">
      {/* Dynamic Cyber HUD Background with Parallax Nodes */}
      <CyberGrid />

      {/* Main Page Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-12 lg:gap-14 pt-6 pb-12">
        <Navbar />
        <ProjectHero />
        <ProjectGrid />
        <ContributeBanner />
        <Footer />
      </div>
    </div>
  );
}
