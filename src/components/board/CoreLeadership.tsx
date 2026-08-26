"use client";

import React, { useState, useEffect } from "react";
import { BoardMember } from "@/data/boardData";
import BoardCard from "./BoardCard";
import StaggerReveal, { StaggerItem } from "@/components/ui/StaggerReveal";
import CipherReveal from "@/components/ui/CipherReveal";

interface CoreLeadershipProps {
  members?: BoardMember[];
}

export default function CoreLeadership({ members: initialMembers }: CoreLeadershipProps) {
  const [members, setMembers] = useState<BoardMember[]>(initialMembers || []);
  const [isLoading, setIsLoading] = useState(!initialMembers);

  useEffect(() => {
    if (!initialMembers) {
      fetch("/api/board")
        .then((res) => res.json())
        .then((data) => {
          setMembers(data.members || []);
        })
        .catch(() => {
          setMembers([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [initialMembers]);

  const coreMembers = members.filter((m) => m.category === "Core Leadership");

  return (
    <section className="flex flex-col gap-6 pt-4">
      {/* Section Header with CipherReveal */}
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
          <h2 className="font-mono text-sm sm:text-base font-bold text-cyber-blue tracking-widest uppercase">
            <CipherReveal text="// CORE LEADERSHIP" duration={400} />
          </h2>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
          <p className="font-mono text-xs text-cyber-blue font-bold tracking-widest uppercase animate-pulse">
            {"// SYNCHRONIZING CORE COMMAND..."}
          </p>
        </div>
      ) : (
        /* Symmetrically sized 2-Column Grid scaled 20% to 400px width */
        <StaggerReveal
          staggerDelay={0.15}
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto w-full justify-items-center"
        >
          {coreMembers.map((member) => (
            <StaggerItem key={member.id} className="w-full max-w-[400px]">
              <BoardCard member={member} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      )}
    </section>
  );
}
