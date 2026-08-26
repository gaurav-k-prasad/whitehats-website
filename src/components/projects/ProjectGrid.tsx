"use client";

import React, { useState, useEffect } from "react";
import { ProjectRepository } from "@/data/projectsData";
import ProjectCard from "./ProjectCard";
import StaggerReveal, { StaggerItem } from "@/components/ui/StaggerReveal";
import CipherReveal from "@/components/ui/CipherReveal";

export default function ProjectGrid() {
  const [projects, setProjects] = useState<ProjectRepository[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);
      })
      .catch(() => {
        setProjects([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
          TOTAL: <span className="text-cyber-blue font-bold">{isLoading ? "SYNCING..." : `${projects.length} REPOS`}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
          <p className="font-mono text-xs text-cyber-blue font-bold tracking-widest uppercase animate-pulse">
            {"// SYNCHRONIZING ARSENAL REPOSITORIES..."}
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center gap-2 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
          <p className="font-mono text-sm text-slate-400">
            {"// NO ACTIVE REPOSITORIES FOUND"}
          </p>
        </div>
      ) : (
        /* 2-Column Responsive Grid with Stagger Cascade */
        <StaggerReveal
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      )}
    </section>
  );
}
