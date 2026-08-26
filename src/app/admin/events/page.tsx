"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock, X, Save, AlertCircle, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import CipherReveal from "@/components/ui/CipherReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { ClubEvent, formatEventDisplayDate, sortEventsDescending } from "@/data/eventsData";
import { CloudinaryImage } from "@/components/ui/cloudinary";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshEvents = () => {
    fetch("/api/admin/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.events) {
          setEvents(sortEventsDescending(data.events));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/events")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.events) {
          setEvents(sortEventsDescending(data.events));
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

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingEvent({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `event-${Date.now()}`,
      title: "",
      type: "Workshop",
      date: new Date().toISOString().split("T")[0],
      time: "01:00 PM - 05:00 PM",
      location: "VIT Vellore",
      description: "",
      tags: ["Security", "Hands-On"],
      imageUrl: "",
      registrationUrl: "",
    });
  };

  const handleOpenEdit = (event: ClubEvent) => {
    setIsNew(false);
    setEditingEvent({
      ...event,
      imageUrl: event.imageUrl || "",
      registrationUrl: event.registrationUrl || "",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setLoading(true);
    try {
      const payload = {
        ...editingEvent,
        imageUrl: editingEvent.imageUrl?.trim() || null,
        registrationUrl: editingEvent.registrationUrl?.trim() || null,
      };

      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFeedback(`Saved event: ${editingEvent.title}`);
        setEditingEvent(null);
        refreshEvents();
        setTimeout(() => setFeedback(null), 3000);
      } else {
        const data = await res.json();
        setFeedback(data.error || "Failed to save event.");
      }
    } catch {
      setFeedback("Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove event: ${title}?`)) return;

    try {
      const res = await fetch(`/api/admin/events?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeedback(`Event ${title} removed.`);
        refreshEvents();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      setFeedback("Failed to delete event.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-blue tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
            <CipherReveal text="// TIMELINE DIRECTIVES" duration={400} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            EVENTS & WORKSHOPS MANAGER
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Schedule CTFs, bootcamps, and technical sessions synchronized with Cloudflare D1.
          </p>
        </div>

        <MagneticButton>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyber-blue text-black font-mono text-xs font-bold hover:bg-cyber-blue-light shadow-neon-blue transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>SCHEDULE EVENT</span>
          </button>
        </MagneticButton>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue-light font-mono text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Events Grid */}
      {isFetching ? (
        <div className="py-24 flex flex-col items-center justify-center text-center font-mono text-slate-400 gap-3 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
          <p className="text-xs tracking-wider text-cyber-blue font-bold uppercase animate-pulse">
            {"// SYNCHRONIZING SECURE EVENT DIRECTIVES..."}
          </p>
        </div>
      ) : events.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center font-mono text-slate-500 gap-2 border border-dashed border-[#1E293B] rounded-xl">
          <Calendar className="w-8 h-8 opacity-40 text-cyber-blue" />
          <p className="text-sm">No scheduled events in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <CyberCardBorder key={event.id} contentClassName="p-5 flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 font-bold uppercase">
                      {event.type}
                    </span>
                    {event.status && (
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border ${
                          event.status === "ONGOING"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                            : event.status === "UPCOMING"
                            ? "bg-cyber-blue/15 text-cyber-blue-light border-cyber-blue/40"
                            : "bg-[#030712] text-slate-400 border-[#1E293B]"
                        }`}
                      >
                        {event.status}
                      </span>
                    )}
                    {event.imageUrl && (
                      <span className="px-1.5 py-0.5 rounded bg-[#030712] border border-[#1E293B] text-slate-400 text-[9px] flex items-center gap-1">
                        <ImageIcon className="w-2.5 h-2.5 text-cyber-blue" />
                        <span>MEDIA</span>
                      </span>
                    )}
                    {event.registrationUrl && (
                      <span className="px-1.5 py-0.5 rounded bg-[#030712] border border-[#1E293B] text-slate-400 text-[9px] flex items-center gap-1">
                        <LinkIcon className="w-2.5 h-2.5 text-cyber-blue" />
                        <span>REG LINK</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-mono font-bold text-white text-lg mt-2">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mt-2">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-cyber-blue" />
                      <span>{formatEventDisplayDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyber-blue" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyber-blue" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-slate-400 mt-2.5 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-[#030712] border border-[#1E293B] font-mono text-[10px] text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(event)}
                    className="p-1.5 rounded-md border border-[#1E293B] hover:border-cyber-blue/60 bg-[#0B1120] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Event"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    className="p-1.5 rounded-md border border-red-500/20 hover:border-red-500/60 bg-red-500/5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Delete Event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </CyberCardBorder>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CyberCardBorder contentClassName="p-6 sm:p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3.5">
                <div className="flex items-center gap-2.5 font-mono text-sm font-bold text-white">
                  <Calendar className="w-4 h-4 text-cyber-blue" />
                  <span>{isNew ? "SCHEDULE NEW EVENT" : `EDIT: ${editingEvent.title}`}</span>
                </div>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="p-1.5 rounded-md border border-[#1E293B] hover:border-cyber-blue text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                {/* 1. Type and Title Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-medium text-slate-300">
                      EVENT TYPE
                    </label>
                    <select
                      value={editingEvent.type}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          type: e.target.value as ClubEvent["type"],
                        })
                      }
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue transition-colors"
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="CTF">CTF</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Bootcamp">Bootcamp</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-medium text-slate-300">
                      EVENT TITLE
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEvent.title}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, title: e.target.value })
                      }
                      placeholder="e.g. QW'26: FlagWars"
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Date, Time, Location Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-medium text-slate-300">
                      DATE
                    </label>
                    <input
                      type="date"
                      required
                      value={editingEvent.date}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, date: e.target.value })
                      }
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-medium text-slate-300">
                      TIME WINDOW
                    </label>
                    <input
                      type="text"
                      value={editingEvent.time}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, time: e.target.value })
                      }
                      placeholder="01:00 PM - 05:00 PM"
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-medium text-slate-300">
                      LOCATION / VENUE
                    </label>
                    <input
                      type="text"
                      value={editingEvent.location}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, location: e.target.value })
                      }
                      placeholder="VIT Vellore / Online"
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Cover Image and Registration URL Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-medium text-slate-300">
                      COVER IMAGE <span className="text-slate-500 font-normal">(OPTIONAL)</span>
                    </label>
                    <input
                      type="text"
                      value={editingEvent.imageUrl || ""}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, imageUrl: e.target.value })
                      }
                      placeholder="Cloudinary ID (e.g. ctf) or Image URL"
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-medium text-slate-300">
                      REGISTRATION URL <span className="text-slate-500 font-normal">(OPTIONAL)</span>
                    </label>
                    <input
                      type="url"
                      value={editingEvent.registrationUrl || ""}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, registrationUrl: e.target.value })
                      }
                      placeholder="https://forms.gle/... or link"
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue transition-colors"
                    />
                  </div>
                </div>

                {editingEvent.imageUrl && editingEvent.imageUrl.trim().length > 0 && (
                  <div className="p-2.5 rounded bg-[#030712] border border-[#1E293B] flex items-center gap-3 overflow-hidden">
                    <div className="relative w-16 h-12 rounded overflow-hidden bg-[#070D1D] shrink-0 border border-[#1E293B]">
                      <CloudinaryImage
                        src={editingEvent.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="font-mono text-xs text-slate-400 min-w-0 flex-1 overflow-hidden">
                      <span className="text-cyber-blue text-[10px] block font-bold tracking-wider uppercase">PREVIEW</span>
                      <p className="truncate text-white text-xs block max-w-full font-mono">{editingEvent.imageUrl}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={editingEvent.description}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, description: e.target.value })
                    }
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">TAGS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={editingEvent.tags.join(", ")}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Web, Crypto, Pwn"
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-3.5 py-2 rounded-md border border-[#1E293B] text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-cyber-blue text-black font-mono text-xs font-bold hover:bg-cyber-blue-light flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{loading ? "SAVING..." : "COMMIT EVENT"}</span>
                  </button>
                </div>
              </form>
            </CyberCardBorder>
          </div>
        </div>
      )}
    </div>
  );
}
