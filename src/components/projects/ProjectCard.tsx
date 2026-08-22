import React from "react";
import { ProjectRepository, ProjectStatus } from "@/data/projectsData";

interface ProjectCardProps {
  project: ProjectRepository;
}

function renderProjectIcon(iconType: ProjectRepository["iconType"]) {
  switch (iconType) {
    case "shield":
      return (
        <svg className="w-6 h-6 text-cyber-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
    case "network":
      return (
        <svg className="w-6 h-6 text-cyber-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      );
    case "radar":
      return (
        <svg className="w-6 h-6 text-cyber-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M9 10a3 3 0 106 0 3 3 0 00-6 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v9l4 4" />
        </svg>
      );
    case "terminal":
      return (
        <svg className="w-6 h-6 text-cyber-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
  }
}

function renderStatusBadge(status: ProjectStatus) {
  switch (status) {
    case "ACTIVE_DEVELOPMENT":
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          ACTIVE DEVELOPMENT
        </span>
      );
    case "PRODUCTION_READY":
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          PRODUCTION READY
        </span>
      );
    case "BETA_TESTING":
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-amber-500/40 bg-amber-500/10 text-amber-300 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          BETA TESTING
        </span>
      );
    case "COMPLETED":
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-blue-500/40 bg-blue-500/10 text-blue-300 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          COMPLETED
        </span>
      );
    case "MAINTAINED":
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-slate-500/40 bg-slate-500/10 text-slate-300 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          MAINTAINED
        </span>
      );
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-[#1E293B] hover:border-[#0088FF] bg-[#0B1120] p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,136,255,0.15)] group">
      <div className="flex flex-col gap-4">
        {/* Card Header: Icon container, Title, Visibility & Status Badge (Top-Aligned with Title) */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-[#030712] border border-[#1E293B] group-hover:border-cyber-blue/50 flex items-center justify-center shrink-0 transition-colors shadow-[0_0_12px_rgba(0,136,255,0.1)]">
              {renderProjectIcon(project.iconType)}
            </div>
            <div className="flex flex-col">
              <h3 className="font-mono font-bold text-lg text-white group-hover:text-cyber-blue-light transition-colors leading-tight">
                {project.name}
              </h3>
              <span className="font-mono text-[11px] text-slate-400 mt-1">
                {project.visibility} Repository
              </span>
            </div>
          </div>

          <div className="self-start">
            {renderStatusBadge(project.status)}
          </div>
        </div>

        {/* Card Body: Description */}
        <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded bg-[#030712] border border-[#1E293B] text-slate-300 font-mono text-[11px] font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Contributors & View on GitHub */}
      <div className="flex items-center justify-between pt-5 mt-5 border-t border-[#1E293B]/70">
        {/* Contributor Count */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <svg className="w-4 h-4 text-cyber-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>{project.contributors} Contributors</span>
        </div>

        {/* View on GitHub Button */}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1E293B] hover:border-cyber-blue/60 bg-[#030712] hover:bg-cyber-blue/15 text-slate-200 hover:text-white font-mono text-xs font-semibold tracking-wider transition-all cursor-pointer"
        >
          <span>View on GitHub</span>
          <svg
            className="w-3.5 h-3.5 text-cyber-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </div>
  );
}
