import React from "react";
import { BoardMember } from "@/data/boardData";

interface BoardCardProps {
  member: BoardMember;
  isLarge?: boolean;
}

export default function BoardCard({ member, isLarge = false }: BoardCardProps) {
  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#0B1120] hover:border-[#0088FF] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,136,255,0.25)] group relative overflow-hidden">
      {/* Top Image Section with strict portrait aspect ratio */}
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-[#1E293B] bg-[#121826] flex items-center justify-center group-hover:border-cyber-blue/40 transition-colors">
        {/* Technical CSS Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B25_1px,transparent_1px),linear-gradient(to_bottom,#1E293B25_1px,transparent_1px)] bg-[size:1rem_1rem] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,136,255,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Top-Left: Glowing Status Dot */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#030712]/80 backdrop-blur-md px-2 py-1 rounded-md border border-[#1E293B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0088FF] shadow-[0_0_8px_#0088FF] animate-pulse" />
          <span className="text-[9px] font-mono text-slate-400 font-semibold tracking-wider">ACTIVE</span>
        </div>

        {/* Top-Right: ID Tag */}
        <div className="absolute top-3 right-3 z-10 bg-[#030712]/80 backdrop-blur-md px-2 py-1 rounded-md border border-[#1E293B] text-[10px] font-mono text-cyber-blue-light font-bold">
          {member.id}
        </div>

        {/* Center Technical Blueprint Avatar Graphic */}
        <div className="relative flex flex-col items-center justify-center gap-2 select-none opacity-40 group-hover:opacity-75 transition-opacity duration-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-dashed border-cyber-blue/50 flex items-center justify-center text-cyber-blue">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-cyber-blue/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
            // OPERATOR ID
          </span>
        </div>

        {/* Bottom Corner Accent Lines */}
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyber-blue/30" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyber-blue/30" />
      </div>

      {/* Bottom Text Section */}
      <div className="flex flex-col gap-1.5 pt-4">
        <h3
          className={`font-mono font-bold text-white group-hover:text-cyber-blue-light transition-colors ${
            isLarge ? "text-lg sm:text-xl" : "text-base sm:text-lg"
          }`}
        >
          {member.name}
        </h3>
        <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm text-[#0088FF] font-semibold tracking-wide">
          <span>&gt;</span>
          <span>{member.role}</span>
        </div>
      </div>
    </div>
  );
}
