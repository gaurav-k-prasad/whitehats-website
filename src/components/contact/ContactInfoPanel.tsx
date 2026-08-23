"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, LucideIcon } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import SocialIcon from "@/components/ui/SocialIcon";
import { CONTACT_CHANNELS } from "@/data/contactData";
import { SOCIAL_LINKS } from "@/data/homeData";

const CHANNEL_ICON_MAP: Record<string, LucideIcon> = {
  mail: Mail,
  phone: Mail,
  map: MapPin,
  clock: Clock,
};

export default function ContactInfoPanel() {
  return (
    <div className="flex flex-col gap-4">
      {CONTACT_CHANNELS.map((channel, idx) => {
        const Icon = CHANNEL_ICON_MAP[channel.iconType];
        return (
          <motion.a
            key={channel.id}
            href={channel.href}
            target={channel.href.startsWith("http") ? "_blank" : undefined}
            rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: idx * 0.08, duration: 0.35 }}
            className="block group"
          >
            <CyberCardBorder className="shadow-lg" contentClassName="p-4 flex items-center gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue group-hover:bg-cyber-blue/20 group-hover:shadow-neon-blue transition-all">
                <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">
                  {channel.label}
                </span>
                <span className="font-mono text-sm text-slate-200 font-semibold truncate group-hover:text-cyber-blue-light transition-colors">
                  {channel.value}
                </span>
                {channel.hint && (
                  <span className="text-[11px] text-text-muted mt-0.5">{channel.hint}</span>
                )}
              </div>
            </CyberCardBorder>
          </motion.a>
        );
      })}

      {/* Socials */}
      <CyberCardBorder className="shadow-lg" contentClassName="p-4 sm:p-5 flex flex-col gap-3">
        <span className="font-mono text-[11px] font-bold text-cyber-blue-light tracking-widest uppercase">
          // FOLLOW THE OPERATION
        </span>
        <div className="flex items-center gap-2.5">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="w-9 h-9 rounded-lg bg-[#030712] border border-[#1E293B] flex items-center justify-center text-slate-400 hover:text-cyber-blue hover:border-cyber-blue/60 hover:shadow-neon-blue transition-all"
            >
              <SocialIcon iconType={social.iconType} className="w-4 h-4" />
            </a>
          ))}
        </div>
      </CyberCardBorder>
    </div>
  );
}
