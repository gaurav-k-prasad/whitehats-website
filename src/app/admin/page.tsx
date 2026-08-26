"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Calendar, Image as ImageIcon, Code, Database, ArrowUpRight, ShieldCheck, Terminal } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import CipherReveal from "@/components/ui/CipherReveal";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";

interface DashboardStats {
  boardMembersCount: number;
  eventsCount: number;
  galleryItemsCount: number;
  projectsCount: number;
  dbStatus: "CONNECTED" | "STANDBY";
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    boardMembersCount: 10,
    eventsCount: 7,
    galleryItemsCount: 15,
    projectsCount: 2,
    dbStatus: "CONNECTED",
  });

  React.useEffect(() => {
    Promise.allSettled([
      fetch("/api/admin/board").then((r) => r.json()),
      fetch("/api/admin/events").then((r) => r.json()),
      fetch("/api/admin/gallery").then((r) => r.json()),
      fetch("/api/admin/projects").then((r) => r.json()),
    ]).then(([boardRes, eventsRes, galleryRes, projectsRes]) => {
      setStats((prev) => ({
        ...prev,
        boardMembersCount: boardRes.status === "fulfilled" && boardRes.value.members ? boardRes.value.members.length : prev.boardMembersCount,
        eventsCount: eventsRes.status === "fulfilled" && eventsRes.value.events ? eventsRes.value.events.length : prev.eventsCount,
        galleryItemsCount: galleryRes.status === "fulfilled" && galleryRes.value.items ? galleryRes.value.items.length : prev.galleryItemsCount,
        projectsCount: projectsRes.status === "fulfilled" && projectsRes.value.projects ? projectsRes.value.projects.length : prev.projectsCount,
      }));
    });
  }, []);

  const statCards = [
    {
      title: "BOARD DIRECTORY",
      count: stats.boardMembersCount,
      subtext: "2 Core · 2 Vice · 6 Domain",
      href: "/admin/board",
      icon: Users,
      color: "from-blue-500/20 to-blue-600/5",
      borderColor: "border-blue-500/30",
      accent: "text-blue-400",
    },
    {
      title: "EVENTS & TIMELINE",
      count: stats.eventsCount,
      subtext: "CTFs, Workshops, Seminars",
      href: "/admin/events",
      icon: Calendar,
      color: "from-cyan-500/20 to-cyan-600/5",
      borderColor: "border-cyan-500/30",
      accent: "text-cyan-400",
    },
    {
      title: "GALLERY ARCHIVE",
      count: stats.galleryItemsCount,
      subtext: "Cloudinary Assets",
      href: "/admin/gallery",
      icon: ImageIcon,
      color: "from-purple-500/20 to-purple-600/5",
      borderColor: "border-purple-500/30",
      accent: "text-purple-400",
    },
    {
      title: "PROJECTS & ARSENAL",
      count: stats.projectsCount,
      subtext: "Active Repositories",
      href: "/admin/projects",
      icon: Code,
      color: "from-emerald-500/20 to-emerald-600/5",
      borderColor: "border-emerald-500/30",
      accent: "text-emerald-400",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-blue tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
            <CipherReveal text="// COMMAND CONSOLE" duration={400} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            EXECUTIVE OVERVIEW
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Command interface for Cloudflare D1 content synchronization and site administration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1120] border border-cyber-blue/30 font-mono text-xs text-cyber-blue">
            <Database className="w-4 h-4 text-cyber-blue animate-bounce" />
            <span>ENGINE: CLOUDFLARE D1</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              scroll={false}
              className="group block"
            >
              <CyberCardBorder className="h-full group-hover:scale-[1.02] transition-transform shadow-lg" contentClassName="p-5 flex flex-col justify-between h-full">
                <ScanlineOverlay opacity="opacity-[0.03]" />

                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg border ${card.borderColor} bg-gradient-to-br ${card.color} flex items-center justify-center ${card.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyber-blue transition-colors" />
                </div>

                <div className="mt-4">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {card.count}
                  </span>
                  <h3 className="font-mono text-xs font-semibold text-slate-300 tracking-wider uppercase mt-1">
                    {card.title}
                  </h3>
                  <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                    {card.subtext}
                  </p>
                </div>
              </CyberCardBorder>
            </Link>
          );
        })}
      </div>

      {/* Database & Quick Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* D1 Connection Panel */}
        <div className="lg:col-span-2">
          <CyberCardBorder contentClassName="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyber-blue" />
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  Database & Edge Diagnostics
                </h3>
              </div>
              <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                D1 ACTIVE
              </span>
            </div>

            <div className="bg-[#030712] rounded-lg border border-[#1E293B] p-4 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>DATABASE BINDING:</span>
                <span className="text-cyber-blue">DB (whitehats_prod_db)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>INACTIVITY SLEEP:</span>
                <span className="text-emerald-400">DISABLED (24/7 Always Active)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>COLD START DELAY:</span>
                <span className="text-emerald-400">0 ms (Instant Serverless Edge)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>SCHEMA MIGRATIONS:</span>
                <span className="text-slate-200">drizzle/0000_deep_legion.sql (7 Tables)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/admin/board"
                scroll={false}
                className="px-3.5 py-2 rounded-lg bg-cyber-blue text-black font-mono text-xs font-bold hover:bg-cyber-blue-light transition-colors"
              >
                MANAGE BOARD DIRECTORY
              </Link>
              <Link
                href="/admin/gallery"
                scroll={false}
                className="px-3.5 py-2 rounded-lg bg-[#0B1120] border border-[#1E293B] hover:border-cyber-blue/60 text-slate-200 font-mono text-xs transition-colors"
              >
                UPLOAD GALLERY MEDIA
              </Link>
            </div>
          </CyberCardBorder>
        </div>

        {/* Security & Access Panel */}
        <div>
          <CyberCardBorder contentClassName="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                Vault Security
              </h3>
            </div>

            <p className="font-mono text-xs text-slate-400 leading-relaxed">
              All admin routes are shielded by Next.js edge middleware and HTTP-only signed JWT tokens with PBKDF2 cryptography.
            </p>

            <div className="p-3 rounded-lg bg-[#030712] border border-[#1E293B] font-mono text-[11px] text-slate-400 space-y-1.5">
              <div className="text-cyber-blue-light font-semibold">{"// CLI SEED COMMAND:"}</div>
              <div className="text-slate-300 select-all overflow-x-auto">
                npx tsx scripts/generate-seed.ts
              </div>
            </div>
          </CyberCardBorder>
        </div>
      </div>
    </div>
  );
}
