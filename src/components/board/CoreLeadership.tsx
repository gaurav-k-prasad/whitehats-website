import React from "react";
import { BOARD_DATA } from "@/data/boardData";
import BoardCard from "./BoardCard";

export default function CoreLeadership() {
  const coreMembers = BOARD_DATA.filter((m) => m.category === "Core Leadership");

  return (
    <section className="flex flex-col gap-6 pt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0088FF] shadow-neon-blue" />
          <h2 className="font-mono text-sm sm:text-base font-bold text-[#0088FF] tracking-widest uppercase">
            // CORE LEADERSHIP
          </h2>
        </div>
      </div>

      {/* Grid for Core Leadership */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        {coreMembers.map((member) => (
          <BoardCard key={member.id} member={member} isLarge />
        ))}
      </div>
    </section>
  );
}
