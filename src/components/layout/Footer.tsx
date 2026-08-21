import React from "react";
import { FOOTER_DATA } from "@/data/homeData";

export default function Footer() {
  return (
    <footer className="pt-6 border-t border-card-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-text-muted">
      <div>{FOOTER_DATA.copyright}</div>
      <div className="text-cyber-blue/80 tracking-wider">{FOOTER_DATA.motto}</div>
      <div className="flex items-center gap-1.5">
        <span>BUILT WITH</span>
        <span className="text-cyber-blue">&hearts;</span>
        <span>BY WHITEHATS</span>
      </div>
    </footer>
  );
}
