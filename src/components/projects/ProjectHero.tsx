import React from "react";
import PageHero from "@/components/ui/PageHero";
import ProjectHeroGraphic from "@/components/projects/ProjectHeroGraphic";

export default function ProjectHero() {
  return (
    <PageHero
      label="// PROJECTS"
      headingPrefix="< OUR OPEN SOURCE"
      headingSuffix="PROJECTS />"
      description="Open source tools and research projects built by Whitehats Club members to solve real-world security problems, analyze threat vectors, and engineer defensive intelligence."
      variant="glitch"
      rightSlot={<ProjectHeroGraphic />}
    >
      <a
        href="https://github.com/TheWhitehatsclub-vit"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded bg-cyber-blue hover:bg-cyber-blue-light text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-neon-blue hover:shadow-[0_0_25px_rgba(0,136,255,0.6)] flex items-center gap-2"
      >
        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
        <span>Explore All on GitHub</span>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </PageHero>
  );
}
