"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Shield, Users, Calendar, Image as ImageIcon, Code, Mail, LogOut, LayoutDashboard } from "lucide-react";
import CyberGrid from "@/components/ui/CyberGrid";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Board Members", href: "/admin/board", icon: Users },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Projects", href: "/admin/projects", icon: Code },
  { label: "Inquiries", href: "/admin/messages", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  // If on login page, render children cleanly without admin topbar shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-bg-main text-slate-100 relative overflow-x-hidden font-sans flex flex-col">
      <CyberGrid />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#1E293B] bg-[#030712]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg border border-cyber-blue/50 bg-cyber-blue/10 flex items-center justify-center text-cyber-blue shadow-neon-blue">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-mono font-bold text-white tracking-wider text-sm sm:text-base">
                WHITEHATS <span className="text-cyber-blue">{"// VAULT"}</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B1120] border border-[#1E293B] font-mono text-[11px] text-cyber-blue">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>D1_EDGE_ONLINE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-mono text-xs text-white font-semibold">{user.name}</span>
                <span className="font-mono text-[10px] text-cyber-blue-light">{user.role}</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white font-mono text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">TERMINATE SESSION</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub Navigation Bar */}
      <div className="border-b border-[#1E293B] bg-[#070D18]/80 backdrop-blur-sm z-30 sticky top-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                scroll={false}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-cyber-blue text-black font-bold shadow-neon-blue"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0F172A]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {children}
      </main>
    </div>
  );
}
