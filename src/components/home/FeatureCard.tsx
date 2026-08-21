import React from "react";
import { FeatureCardData } from "@/data/homeData";

interface FeatureCardProps {
  card: FeatureCardData;
}

function renderCardIcon(iconType: FeatureCardData["iconType"]) {
  switch (iconType) {
    case "terminal":
      return <span className="font-mono text-xs font-bold text-cyber-blue">&gt;_</span>;
    case "calendar":
      return (
        <svg className="w-4 h-4 text-cyber-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    case "code":
      return <span className="font-mono text-xs font-bold text-cyber-blue">&lt;/&gt;</span>;
    case "team":
      return (
        <svg className="w-4 h-4 text-cyber-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
  }
}

export default function FeatureCard({ card }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-6 flex flex-col justify-between hover:border-cyber-blue/60 transition-all duration-300 group shadow-lg">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-9 h-9 rounded-lg bg-black/50 border border-card-border flex items-center justify-center group-hover:border-cyber-blue/60 transition-colors">
            {renderCardIcon(card.iconType)}
          </div>
          <span className="font-mono text-xs text-text-muted/60 font-semibold">
            {card.badgeNumber}
          </span>
        </div>

        <h2 className="font-mono font-bold text-sm tracking-wider text-white mb-2">
          {card.title}
        </h2>

        {card.description && (
          <p className="text-text-muted text-xs leading-relaxed mb-3">
            {card.description}
          </p>
        )}

        {card.events && (
          <ul className="space-y-2 text-[11px] font-mono mb-3">
            {card.events.map((event) => (
              <li key={event.title} className="flex items-center justify-between text-text-muted">
                <span className="truncate">{event.title}</span>
                <span className="text-cyber-blue font-medium ml-2 whitespace-nowrap">
                  {event.date}
                </span>
              </li>
            ))}
          </ul>
        )}

        {card.tools && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {card.tools.map((tool) => (
              <span
                key={tool}
                className="px-2 py-0.5 rounded bg-black/50 border border-card-border text-cyber-blue font-mono text-[10px] tracking-wider"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>

      <a
        href={card.ctaHref}
        className="mt-6 font-mono text-xs font-semibold text-text-muted group-hover:text-cyber-blue flex items-center gap-1 transition-colors"
      >
        <span>{card.ctaText}</span>
        <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
      </a>
    </div>
  );
}
