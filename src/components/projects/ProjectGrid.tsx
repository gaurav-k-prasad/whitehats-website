"use client";

import React from "react";
import { PROJECTS_DATA } from "@/data/projectsData";
import ProjectCard from "./ProjectCard";
import StaggerReveal, { StaggerItem } from "@/components/ui/StaggerReveal";
import CipherReveal from "@/components/ui/CipherReveal";

export default function ProjectGrid() {
  return (
    <section className="flex flex-col gap-6 pt-6">
      {/* Header with Title and Terminal Line indicator */}
      <div className="flex items-center justify-between border-b border-card-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wider uppercase text-white">
            <CipherReveal text="// FEATURED REPOSITORIES" duration={400} />
          </h2>
        </div>
        <div className="font-mono text-xs text-text-muted">
          TOTAL: <span className="text-cyber-blue font-bold">{PROJECTS_DATA.length} REPOS</span>
        </div>
      </div>

      {/* 2-Column Responsive Grid with Stagger Cascade */}
      <StaggerReveal
        staggerDelay={0.1}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {PROJECTS_DATA.map((project) => (
          <StaggerItem key={project.id} className="h-full">
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
