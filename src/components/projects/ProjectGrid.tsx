import React from "react";
import { PROJECTS_DATA } from "@/data/projectsData";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  return (
    <section className="flex flex-col gap-6 pt-6">
      {/* Header with Title and Terminal Line indicator */}
      <div className="flex items-center justify-between border-b border-card-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue" />
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wider uppercase text-white">
            FEATURED REPOSITORIES
          </h2>
        </div>
        <div className="font-mono text-xs text-text-muted">
          TOTAL: <span className="text-cyber-blue font-bold">{PROJECTS_DATA.length}</span>
        </div>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS_DATA.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
