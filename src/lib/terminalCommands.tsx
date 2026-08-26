import React from "react";
import { FEATURE_CARDS } from "@/data/homeData";
import { PROJECTS_DATA } from "@/data/projectsData";

export interface CommandResult {
  output: React.ReactNode;
}

export const BANNER_ASCII = ` .-------------------.
 |  THE WHITEHAT'S   |
 |       CLUB        |
 '-------------------'`;

export function executeCommand(input: string): CommandResult {
  const trimmed = input.trim();
  const normalized = trimmed.toLowerCase();

  if (!normalized) {
    return { output: null };
  }

  const [cmd] = normalized.split(/\s+/);

  switch (cmd) {
    case "help":
      return {
        output: (
          <div className="space-y-1">
            <div className="text-cyber-blue font-semibold mb-1">Available Commands:</div>
            <div className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-1 text-slate-300 text-xs">
              <span className="text-cyber-blue-light font-bold">help</span>
              <span>Lists all available commands</span>
              <span className="text-cyber-blue-light font-bold">whoami</span>
              <span>Displays club identity and mission</span>
              <span className="text-cyber-blue-light font-bold">events</span>
              <span>Lists upcoming workshops and CTFs</span>
              <span className="text-cyber-blue-light font-bold">tools</span>
              <span>Shows club primary security toolkit & arsenal</span>
              <span className="text-cyber-blue-light font-bold">projects</span>
              <span>Lists active open-source security repositories</span>
              <span className="text-cyber-blue-light font-bold">banner</span>
              <span>Re-renders the club ASCII banner</span>
              <span className="text-cyber-blue-light font-bold">sudo</span>
              <span>Run command with elevated privileges</span>
              <span className="text-cyber-blue-light font-bold">clear</span>
              <span>Wipes the terminal history</span>
            </div>
          </div>
        ),
      };

    case "whoami":
      return {
        output: (
          <div className="space-y-1.5 text-slate-200">
            <div className="text-cyber-blue font-bold">WhiteHats - Ethical Hacking & Cybersecurity Syndicate</div>
            <p className="text-text-muted text-xs leading-relaxed">
              We are an elite student cybersecurity collective focused on offensive security, binary exploitation, 
              reverse engineering, and digital defense. We don&apos;t break the rules; we break the vulnerabilities.
            </p>
            <div className="text-xs text-cyber-blue-light/80">
              <span className="font-semibold">Core Tenets:</span> Resilient Systems • Offensive Auditing • Community Empowerment
            </div>
          </div>
        ),
      };

    case "events": {
      const eventsCard = FEATURE_CARDS.find((card) => card.id === "upcoming-events");
      const events = eventsCard?.events || [];
      return {
        output: (
          <div className="space-y-1.5">
            <div className="text-cyber-blue font-semibold mb-1 flex items-center justify-between">
              <span>Upcoming CTFs & Operations:</span>
              <span className="text-[10px] text-text-muted">SESSION SCHEDULE</span>
            </div>
            <div className="space-y-1">
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-card-bg/60 border border-card-border/60 px-2.5 py-1 rounded text-xs"
                >
                  <span className="text-slate-200">{event.title}</span>
                  <span className="text-cyber-blue-light font-mono text-[11px] font-semibold">{event.date}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      };
    }

    case "tools": {
      const toolsCard = FEATURE_CARDS.find((card) => card.id === "arsenal-toolkit");
      const tools = toolsCard?.tools || [];
      return {
        output: (
          <div className="space-y-2">
            <div className="text-cyber-blue font-semibold">Primary Security Arsenal & Frameworks:</div>
            <div className="flex flex-wrap gap-1.5">
              {tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue-light text-xs font-mono font-medium shadow-[0_0_8px_rgba(0,136,255,0.15)]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ),
      };
    }

    case "projects":
      return {
        output: (
          <div className="space-y-2">
            <div className="text-cyber-blue font-semibold">Active Open-Source & Research Repositories:</div>
            <div className="space-y-2">
              {PROJECTS_DATA.map((project) => (
                <div
                  key={project.id}
                  className="bg-card-bg/70 border border-card-border/80 p-2.5 rounded text-xs space-y-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-blue-light font-bold hover:underline break-all"
                    >
                      {project.name}
                    </a>
                    <span className="text-text-muted text-[10px] font-mono shrink-0">
                      {project.contributors} contributors
                    </span>
                  </div>
                  <p className="text-text-muted text-[11px]">{project.description}</p>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] px-1.5 py-0.2 rounded bg-card-border/40 text-slate-300 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      };

    case "banner":
      return {
        output: (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 my-1">
            <pre className="text-cyber-blue font-mono font-bold leading-relaxed overflow-x-auto select-none drop-shadow-[0_0_8px_rgba(0,136,255,0.5)] shrink-0">
              {BANNER_ASCII}
            </pre>
            <div className="flex flex-col justify-center gap-1 text-slate-300 font-mono text-[11px] border-l sm:border-card-border sm:pl-3">
              <div className="text-cyber-blue font-semibold text-xs">Mission:</div>
              <div className="text-slate-300">• Secure systems.</div>
              <div className="text-slate-300">• Educate minds.</div>
              <div className="text-slate-300">• Build a safer digital future.</div>
            </div>
          </div>
        ),
      };

    case "sudo":
      return {
        output: (
          <div className="text-red-400 text-xs font-mono space-y-0.5">
            <div className="font-bold">[ACCESS DENIED] User is not in the sudoers file.</div>
            <div className="text-red-400/80 text-[11px]">This incident will be reported to the WhiteHats Root Authority.</div>
          </div>
        ),
      };

    default:
      return {
        output: (
          <div className="text-xs space-y-0.5">
            <div className="text-red-400 font-mono">command not found: {trimmed}</div>
            <div className="text-text-muted text-[11px]">
              Type <span className="text-cyber-blue font-bold">help</span> to view available commands.
            </div>
          </div>
        ),
      };
  }
}
