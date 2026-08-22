import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GalleryContainer from "@/components/gallery/GalleryContainer";

export const metadata = {
  title: "Archival Media | WhiteHats Gallery",
  description:
    "Explore WhiteHats hackathons, CTFs, technical workshops, and behind-the-scenes moments through an animated high-performance masonry media grid.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyber-blue selection:text-white">
      {/* Background Matrix Grid Pattern & Ambient Radial Glows */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#1E293B15_1px,transparent_1px),linear-gradient(to_bottom,#1E293B15_1px,transparent_1px)] bg-[size:4rem_4rem] z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyber-blue/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[300px] bg-cyber-blue/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Floating Top Navbar Container */}
      <header className="sticky top-0 z-40 w-full pt-4 pb-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto backdrop-blur-xl bg-[#030712]/80 rounded-2xl border border-card-border/80 px-5 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
          <Navbar />
        </div>
      </header>

      {/* Hero Header Section (Cleanly Aligned) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 text-center sm:text-left flex flex-col gap-2">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
          <span className="font-mono text-xs font-bold text-cyber-blue-light tracking-widest uppercase">
            // OPERATIONAL INTEL // WHITEHATS ARCHIVES
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            &lt; ARCHIVE <span className="text-cyber-blue">GALLERY</span> /&gt;
          </h1>
          <p className="font-mono text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            100+ classified records covering national hackathons, offensive CTFs, technical bootcamps, and behind-the-scenes team milestones.
          </p>
        </div>
      </section>

      {/* Main Animated Masonry Media Grid */}
      <main className="relative z-10 flex-1 w-full pb-16">
        <GalleryContainer />
      </main>

      {/* Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
        <Footer />
      </div>
    </div>
  );
}
