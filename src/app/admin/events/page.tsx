"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock, X, Save, AlertCircle, Image as ImageIcon, Link as LinkIcon, Radio, Globe } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import CipherReveal from "@/components/ui/CipherReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { ClubEvent, formatEventDisplayDate, sortEventsDescending } from "@/data/eventsData";
import { CloudinaryImage } from "@/components/ui/cloudinary";
import ImageUploadPicker from "@/components/admin/ImageUploadPicker";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingEvent(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenAdd = () => {
    setIsNew(true);
    setSelectedFile(null);
    setTagsInput("Security, Hands-On");
    setHighlightsInput("");
    setEditingEvent({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `event-${Date.now()}`,
      title: "",
      type: "Hackathon",
      date: new Date().toISOString().split("T")[0],
      time: "01:00 PM - 05:00 PM",
      location: "VIT Vellore",
      mode: "In-Person",
      description: "",
      tags: ["Security", "Hands-On"],
      highlights: [],
      imageUrl: "",
      registrationUrl: "",
    });
  };

  const handleOpenEdit = (event: ClubEvent) => {
    setIsNew(false);
    setSelectedFile(null);
    setTagsInput((event.tags || []).join(", "));
    setHighlightsInput((event.highlights || []).join("\n"));
    setEditingEvent({
      ...event,
      mode: event.mode || "In-Person",
      highlights: event.highlights || [],
      imageUrl: event.imageUrl || "",
      registrationUrl: event.registrationUrl || "",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setLoading(true);
    try {
      const parsedTags = tagsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedHighlights = highlightsInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      let res: Response;

      if (selectedFile) {
        // Send multipart/form-data for direct file upload with transactional rollback
        const formData = new FormData();
        formData.append("id", editingEvent.id);
        formData.append("title", editingEvent.title);
        formData.append("type", editingEvent.type);
        formData.append("status", editingEvent.status || "UPCOMING");
        formData.append("date", editingEvent.date);
        formData.append("time", editingEvent.time);
        formData.append("location", editingEvent.location);
        if (editingEvent.mode) formData.append("mode", editingEvent.mode);
        formData.append("description", editingEvent.description);
        formData.append("tags", parsedTags.join(", "));
        formData.append("highlights", parsedHighlights.join("\n"));
        if (editingEvent.registrationUrl) formData.append("registrationUrl", editingEvent.registrationUrl);
        formData.append("imageFile", selectedFile);

        res = await fetch("/api/admin/events", {
          method: "POST",
          body: formData,
        });
      } else {
        // Send JSON payload
        const payload = {
          ...editingEvent,
          tags: parsedTags,
          highlights: parsedHighlights,
          imageUrl: editingEvent.imageUrl?.trim() || null,
          registrationUrl: editingEvent.registrationUrl?.trim() || null,
        };

        res = await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setFeedback(`Saved event: ${editingEvent.title}`);
        setEditingEvent(null);
        setSelectedFile(null);
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
        setFeedback(`Event "${title}" removed.`);
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
          <h1 className="text-2xl font-black font-mono tracking-wider uppercase text-white flex items-center gap-3">
            <CipherReveal text="// OPERATIONS & EVENTS MANAGER" duration={400} />
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Schedule hackathons, workshops, CTFs, seminars, and bootcamps.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="relative group px-4 py-2.5 rounded-lg bg-cyber-blue text-black font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,136,255,0.35)] hover:shadow-[0_0_25px_rgba(0,136,255,0.6)] inline-flex items-center gap-2 hover:bg-cyber-blue-light transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
          <span>NEW OPERATION</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-lg bg-[#0B1120] border border-cyber-blue/40 text-cyber-blue font-mono text-xs flex items-center gap-2.5 animate-fade-in shadow-neon-blue">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid */}
      {isFetching ? (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-3 font-mono text-xs text-cyber-blue border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
          <span className="tracking-widest uppercase">SYNCHRONIZING OPERATIONS LOGS...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="w-full py-16 text-center border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/30 font-mono text-xs text-slate-500">
          NO OPERATIONS LOGGED IN DATABASE
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <CyberCardBorder
              key={event.id}
              contentClassName="p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#030712] border border-[#1E293B] text-cyber-blue">
                      {event.type}
                    </span>
                    {event.mode && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono text-slate-300 bg-[#030712] border border-[#1E293B]">
                        {event.mode}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {event.status || "UPCOMING"}
                  </span>
                </div>

                <div>
                  <h3 className="font-mono font-bold text-white text-base truncate">
                    {event.title}
                  </h3>
                  <p className="text-xs font-sans text-slate-400 line-clamp-2 mt-1">
                    {event.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-2 border-t border-card-border/60">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-cyber-blue shrink-0" />
                    <span className="truncate">{formatEventDisplayDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 text-cyber-blue shrink-0" />
                    <span className="truncate">{event.time}</span>
                  </div>
                </div>

                {event.highlights && event.highlights.length > 0 && (
                  <div className="text-[10px] font-mono text-slate-400 bg-[#030712] p-2 rounded border border-[#1E293B]">
                    <span className="text-cyber-blue font-bold block mb-1">
                      {event.highlights.length} KEY HIGHLIGHTS / TRACKS
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-card-border/60 text-xs font-mono text-slate-400">
                <span className="truncate max-w-[160px] text-[10px]">
                  {event.imageUrl || "No Image Asset"}
                </span>

                <div className="flex items-center gap-1.5">
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
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingEvent(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CyberCardBorder contentClassName="p-6 sm:p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3.5">
                <div className="flex items-center gap-2.5 font-mono text-sm font-bold text-white">
                  <Calendar className="w-4 h-4 text-cyber-blue" />
                  <span>{isNew ? "SCHEDULE NEW OPERATION" : `EDIT: ${editingEvent.title}`}</span>
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
                      <option value="Hackathon">Hackathon</option>
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

                {/* 2. Date, Time, Venue & Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-medium text-slate-300">
                      DATE (YYYY-MM-DD)
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
                      VENUE / LOCATION
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

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-medium text-slate-300">
                      EVENT MODE
                    </label>
                    <select
                      value={editingEvent.mode || "In-Person"}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          mode: e.target.value as ClubEvent["mode"],
                        })
                      }
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue transition-colors"
                    >
                      <option value="In-Person">In-Person</option>
                      <option value="Online">Online</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                {/* Direct Image Upload / Manual Input Component */}
                <ImageUploadPicker
                  label="EVENT COVER IMAGE"
                  folderHint="whitehats/events"
                  value={editingEvent.imageUrl}
                  onChangeValue={(val) =>
                    setEditingEvent({ ...editingEvent, imageUrl: val })
                  }
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                />

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
                    placeholder="https://forms.gle/... or registration link"
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue transition-colors"
                  />
                </div>

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
                  <label className="text-xs font-mono text-slate-300">KEY HIGHLIGHTS & TRACKS (ONE PER LINE)</label>
                  <textarea
                    rows={3}
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    placeholder="Multi-track cyber challenges&#10;Hands-on labs&#10;Live exploit mitigation"
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">TAGS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
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
                    {loading ? (
                      <span className="animate-pulse">SAVING & UPLOADING...</span>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>SAVE OPERATION</span>
                      </>
                    )}
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
