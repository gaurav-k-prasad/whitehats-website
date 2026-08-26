"use client";

import React, { useState } from "react";
import { CloudinaryImage } from "@/components/ui/cloudinary";
import { motion } from "framer-motion";
import { GalleryItem } from "@/data/galleryData";

interface GalleryCardProps {
  item: GalleryItem;
  onSelect: (item: GalleryItem) => void;
}

export default function GalleryCard({ item, onSelect }: GalleryCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      layout
      layoutId={`gallery-card-${item.id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -4 }}
      transition={{
        duration: 0.35,
        layout: { type: "spring", stiffness: 300, damping: 28 },
      }}
      onClick={() => onSelect(item)}
      style={{
        aspectRatio: `${item.width} / ${item.height}`,
      }}
      className="h-full shrink-0 rounded-2xl overflow-hidden bg-[#0B1120] border border-[#1E293B] hover:border-slate-600 relative group cursor-pointer select-none transition-colors duration-200"
    >
      {/* Blue Corner Bounding Reticles for Gallery Grid Cards */}
      <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyber-blue opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none z-30" />
      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-cyber-blue opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none z-30" />
      <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-cyber-blue opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none z-30" />
      <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyber-blue opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none z-30" />

      {/* Media Box with Shared Layout ID */}
      <motion.div
        layoutId={`gallery-image-${item.id}`}
        className="relative w-full h-full overflow-hidden bg-[#030712]"
      >
        {/* Placeholder Loader */}
        {!isLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#121826] to-[#0B1120] animate-pulse" />
        )}

        {/* Static, Crisp Full-Bleed Image at True Aspect Ratio */}
        {!imageError ? (
          <CloudinaryImage
            src={item.imageUrl}
            alt={item.title}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 350px, (max-width: 1024px) 500px, 600px"
            className={`object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-95 group-hover:opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-[#0B1120]">
            <div className="w-10 h-10 rounded-full border border-dashed border-cyber-blue/60 flex items-center justify-center text-cyber-blue mb-1">
              <span className="font-mono text-xs font-bold">#{item.id}</span>
            </div>
            <span className="font-mono text-xs text-slate-400 font-semibold line-clamp-1">
              {item.title}
            </span>
          </div>
        )}

        {/* Top Category Badge */}
        <div className="absolute top-2.5 left-2.5 pointer-events-none z-20">
          <span className="font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-[#030712]/85 backdrop-blur-xs text-cyber-blue border border-cyber-blue/30 flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
            {item.category}
          </span>
        </div>

        {/* Bottom Title Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#030712]/95 via-[#0B1120]/75 to-transparent p-3.5 pt-8 flex flex-col justify-end z-20">
          <h3 className="font-mono text-xs sm:text-sm font-bold text-white group-hover:text-cyber-blue-light tracking-tight line-clamp-1">
            &gt; {item.title}
          </h3>
        </div>
      </motion.div>
    </motion.div>
  );
}
