"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, MessageSquare, Trash2, AlertCircle } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import CipherReveal from "@/components/ui/CipherReveal";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
}

function formatMessageDate(dateStr?: string | null): string {
  if (!dateStr) return "Recent";
  if (dateStr === "CURRENT_TIMESTAMP") return "Recent";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}`;
    }
    return "Recent";
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshMessages = () => {
    fetch("/api/admin/messages")
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/messages")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.messages) {
          setMessages(data.messages);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setIsFetching(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleUpdateStatus = async (id: string, status: ContactMessage["status"]) => {
    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      refreshMessages();
    } catch {
      // Error
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete inquiry from ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeedback(`Inquiry from ${name} deleted.`);
        refreshMessages();
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback("Failed to delete inquiry.");
      }
    } catch {
      setFeedback("Failed to delete inquiry.");
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "ALL") return true;
    return m.status === filter;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-blue tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
            <CipherReveal text="// SECURE INBOX" duration={400} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            COMMUNICATION INBOX
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Recruitment transmissions and partnership inquiries synchronized with Cloudflare D1.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#030712] border border-[#1E293B]">
          {["ALL", "UNREAD", "READ", "REPLIED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer ${
                filter === st
                  ? "bg-cyber-blue text-black font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className="p-3 rounded-lg border border-cyber-blue/40 bg-cyber-blue/10 text-cyber-blue-light font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Messages List */}
      <div className="flex flex-col gap-4">
        {isFetching ? (
          <div className="py-24 flex flex-col items-center justify-center text-center font-mono text-slate-400 gap-3 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
            <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
            <p className="text-xs tracking-wider text-cyber-blue font-bold uppercase animate-pulse">
              {"// SYNCHRONIZING SECURE INBOX TRANSMISSIONS..."}
            </p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center font-mono text-slate-500 gap-2 border border-dashed border-[#1E293B] rounded-xl">
            <MessageSquare className="w-8 h-8 opacity-40 text-cyber-blue" />
            <p className="text-sm">No transmissions matching filter: {filter}</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <CyberCardBorder key={msg.id} contentClassName="p-5 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-card-border/60 pb-3 overflow-hidden">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-white text-base truncate max-w-[240px]">
                      {msg.name}
                    </span>
                    <span className="font-mono text-xs text-cyber-blue-light truncate max-w-[300px]">
                      &lt;{msg.email}&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-[#030712] border border-[#1E293B] text-cyber-blue font-semibold uppercase">
                      {msg.subject}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatMessageDate(msg.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      msg.status === "UNREAD"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : msg.status === "REPLIED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-700/40 text-slate-300 border border-slate-600/40"
                    }`}
                  >
                    {msg.status}
                  </span>

                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        msg.id,
                        msg.status === "UNREAD" ? "READ" : "UNREAD"
                      )
                    }
                    className="p-1.5 rounded border border-[#1E293B] hover:border-cyber-blue/60 text-slate-400 hover:text-white cursor-pointer transition-colors"
                    title="Toggle Read/Unread"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`mailto:${msg.email}?subject=Re: [WhiteHats] ${encodeURIComponent(
                      msg.subject
                    )}`}
                    onClick={() => handleUpdateStatus(msg.id, "REPLIED")}
                    className="px-2.5 py-1.5 rounded border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue hover:bg-cyber-blue hover:text-black font-mono text-xs font-bold transition-colors cursor-pointer"
                  >
                    REPLY
                  </a>

                  <button
                    onClick={() => handleDelete(msg.id, msg.name)}
                    className="p-1.5 rounded border border-red-500/30 hover:border-red-500/60 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="font-mono text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed break-words break-all">
                {msg.message}
              </p>
            </CyberCardBorder>
          ))
        )}
      </div>
    </div>
  );
}
