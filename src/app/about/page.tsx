import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CyberGrid from "@/components/ui/CyberGrid";
import PageHero from "@/components/ui/PageHero";
import BoardHeroGraphic from "@/components/board/BoardHeroGraphic";
import AboutStatsBand from "@/components/about/AboutStatsBand";
import MissionSection from "@/components/about/MissionSection";
import ValuesGrid from "@/components/about/ValuesGrid";
import MilestonesTimeline from "@/components/about/MilestonesTimeline";
import AboutCTABanner from "@/components/about/AboutCTABanner";
import { ABOUT_HERO_DATA } from "@/data/aboutData";

export const metadata = {
  title: "About | WhiteHats",
  description:
    "Learn about WhiteHats — VIT Vellore's ethical hacking and cybersecurity club, our mission, values, and journey.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-main text-slate-100 selection:bg-cyber-blue selection:text-black relative overflow-x-hidden font-sans">
      <CyberGrid />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-14 lg:gap-16 pt-6 pb-12">
        <Navbar />

        <PageHero
          label={ABOUT_HERO_DATA.label}
          headingPrefix={ABOUT_HERO_DATA.headingPrefix}
          headingSuffix={ABOUT_HERO_DATA.headingSuffix}
          description={ABOUT_HERO_DATA.description}
          rightSlot={<BoardHeroGraphic />}
        />

        <AboutStatsBand />
        <MissionSection />
        <ValuesGrid />
        <MilestonesTimeline />
        <AboutCTABanner />

        <Footer />
      </div>
    </div>
  );
}
