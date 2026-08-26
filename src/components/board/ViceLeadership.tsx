"use client";

import React from "react";
import { BOARD_DATA } from "@/data/boardData";
import BoardCard from "./BoardCard";
import StaggerReveal, { StaggerItem } from "@/components/ui/StaggerReveal";
import CipherReveal from "@/components/ui/CipherReveal";

export default function ViceLeadership() {
  const viceMembers = BOARD_DATA.filter((m) => m.category === "Vice Leadership");

  return (
    <section className="flex flex-col gap-6 pt-4">
      {/* Section Header with CipherReveal */}
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
          <h2 className="font-mono text-sm sm:text-base font-bold text-cyber-blue tracking-widest uppercase">
            <CipherReveal text="// VICE LEADERSHIP" duration={400} />
          </h2>
        </div>
      </div>

      {/* Grid for Vice Leadership with StaggerReveal */}
      <StaggerReveal
        staggerDelay={0.15}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full"
      >
        {viceMembers.map((member) => (
          <StaggerItem key={member.id} className="h-full">
            <BoardCard member={member} isLarge />
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
