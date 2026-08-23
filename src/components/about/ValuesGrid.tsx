"use client";

import React from "react";
import { Shield, Code2, Users, Target, LucideIcon } from "lucide-react";
import { ABOUT_VALUES, AboutValue } from "@/data/aboutData";
import StaggerReveal, { StaggerItem } from "@/components/ui/StaggerReveal";
import CipherReveal from "@/components/ui/CipherReveal";
import CyberCardBorder from "@/components/ui/CyberCardBorder";

const ICON_MAP: Record<AboutValue["iconType"], LucideIcon> = {
  shield: Shield,
  code: Code2,
  users: Users,
  target: Target,
};

export default function ValuesGrid() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-card-border pb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
        <h2 className="font-mono text-sm sm:text-base font-bold text-cyber-blue tracking-widest uppercase">
          <CipherReveal text="// CORE DIRECTIVES" duration={400} />
        </h2>
      </div>

      <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-5" staggerDelay={0.1}>
        {ABOUT_VALUES.map((value) => {
          const Icon = ICON_MAP[value.iconType];
          return (
            <StaggerItem key={value.id} className="h-full">
              <CyberCardBorder className="h-full group shadow-lg" contentClassName="p-5 sm:p-6 flex flex-col gap-3 h-full">
                <div className="w-10 h-10 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue group-hover:bg-cyber-blue/20 group-hover:shadow-neon-blue transition-all">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-mono font-bold text-base sm:text-lg text-white">
                  {value.title}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                  {value.description}
                </p>
              </CyberCardBorder>
            </StaggerItem>
          );
        })}
      </StaggerReveal>
    </section>
  );
}
