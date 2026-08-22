"use client";

import { NAV_ITEMS } from "@/data/homeData";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

function formatNavLabel(label: string) {
  if (label.startsWith(">_")) {
    return (
      <span className="inline-flex items-center">
        <span className="mr-1">&gt;_</span>
        <span>{label.replace(">_", "").trim()}</span>
      </span>
    );
  }
  if (label.startsWith("/")) {
    return (
      <span className="inline-flex items-center">
        <span className="mr-1">/</span>
        <span>{label.replace("/", "").trim()}</span>
      </span>
    );
  }
  return label;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="relative border-b border-card-border/60">
      <div className="flex items-center justify-between py-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-cyber-blue/30 bg-card-bg/60 p-1 flex items-center justify-center shrink-0 group-hover:border-cyber-blue transition-colors shadow-[0_0_12px_rgba(0,136,255,0.2)]">
            <Image
              src="/logo.png"
              alt="WhiteHats Club Logo"
              fill
              sizes="40px"
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div>
            <div className="font-extrabold tracking-wider text-base sm:text-lg text-white font-mono flex items-center gap-1.5 group-hover:text-cyber-blue-light transition-colors">
              WHITEHATS
            </div>
            <div className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-cyber-blue font-mono font-medium uppercase">
              CYBERSECURITY CLUB
            </div>
          </div>
        </Link>

        {/* Desktop Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={
                  isActive
                    ? "text-cyber-blue hover:text-cyber-blue-light transition-colors relative py-1 border-b-2 border-cyber-blue"
                    : "text-text-muted hover:text-slate-200 transition-colors py-1"
                }
              >
                {formatNavLabel(item.label)}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="/contact"
            className="hidden sm:flex items-center gap-2 px-4 sm:px-5 py-2 rounded border border-cyber-blue/80 bg-cyber-blue/10 hover:bg-cyber-blue/20 hover:border-cyber-blue text-cyber-blue hover:text-white font-mono text-xs font-semibold tracking-wider transition-all duration-200 shadow-neon-blue"
          >
            <span>&gt;_ JOIN US</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded border border-card-border bg-card-bg/80 text-text-muted hover:text-cyber-blue hover:border-cyber-blue/60 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <nav className="lg:hidden py-4 px-3 mb-3 border border-card-border/80 rounded-xl bg-card-bg/95 backdrop-blur-md flex flex-col gap-2 font-mono text-xs shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded transition-colors flex items-center justify-between ${isActive
                    ? "bg-cyber-blue/15 text-cyber-blue font-bold border border-cyber-blue/30"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
              >
                <span>{formatNavLabel(item.label)}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue shadow-neon-blue" />
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-card-border/60 mt-1 sm:hidden">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded border border-cyber-blue/80 bg-cyber-blue/15 text-cyber-blue font-mono text-xs font-bold tracking-wider shadow-neon-blue"
            >
              <span>&gt;_ JOIN US</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
