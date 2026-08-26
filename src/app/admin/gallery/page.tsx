"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Save, AlertCircle } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import CipherReveal from "@/components/ui/CipherReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { CloudinaryImage } from "@/components/ui/cloudinary";
import { GalleryItem } from "@/data/galleryData";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshItems = () => {
    fetch("/api/admin/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setItems(data.items);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.items) {
          setItems(data.items);
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
    setEditingItem({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `gallery-${Date.now()}`,
      title: "",
      quote: "",
      date: "",
      year: "2026",
      category: "CTFs",
      tags: ["Security"],
      imageUrl: "",
      width: 600,
      height: 400,
      aspectClass: "aspect-[3/2]",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        setFeedback(`Saved gallery item: ${editingItem.title}`);
        setEditingItem(null);
        refreshItems();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      setFeedback("Failed to save gallery media.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove photo: ${title}?`)) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeedback(`Photo ${title} removed.`);
        refreshItems();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      setFeedback("Failed to delete gallery item.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-blue tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
            <CipherReveal text="// VISUAL REPOSITORY" duration={400} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            GALLERY ARCHIVE MANAGER
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Manage Cloudinary photo assets, categories, and tags synchronized with Cloudflare D1.
          </p>
        </div>

        <MagneticButton>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyber-blue text-black font-mono text-xs font-bold hover:bg-cyber-blue-light shadow-neon-blue transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ADD GALLERY MEDIA</span>
          </button>
        </MagneticButton>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue-light font-mono text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid */}
      {isFetching ? (
        <div className="py-24 flex flex-col items-center justify-center text-center font-mono text-slate-400 gap-3 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
          <p className="text-xs tracking-wider text-cyber-blue font-bold uppercase animate-pulse">
            {"// SYNCHRONIZING GALLERY MEDIA STREAM..."}
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center font-mono text-slate-500 gap-2 border border-dashed border-[#1E293B] rounded-xl">
          <ImageIcon className="w-8 h-8 opacity-40 text-cyber-blue" />
          <p className="text-sm">No gallery media records found in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <CyberCardBorder key={item.id} contentClassName="p-3 flex flex-col justify-between gap-3">
              <div className="relative w-full aspect-[3/2] rounded-md overflow-hidden bg-[#121826] border border-card-border">
                {item.imageUrl ? (
                  <CloudinaryImage
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-xs">
                    NO IMAGE
                  </div>
                )}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-cyber-blue font-bold">
                  {item.category}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-mono font-bold text-white text-sm truncate">
                    {item.title}
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400">
                    {item.year}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-card-border/60">
                  <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                    {item.imageUrl}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditingItem(item);
                      }}
                      className="p-1 rounded hover:bg-[#0B1120] text-slate-300 hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </CyberCardBorder>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <CyberCardBorder contentClassName="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <ImageIcon className="w-4 h-4 text-cyber-blue" />
                  <span>{isNew ? "ADD GALLERY PHOTO" : `EDIT: ${editingItem.title}`}</span>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono text-slate-300">TITLE</label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, title: e.target.value })
                      }
                      placeholder="e.g. CTF Session #1"
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono text-slate-300">CATEGORY</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          category: e.target.value as GalleryItem["category"],
                        })
                      }
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                    >
                      <option value="CTFs">CTFs</option>
                      <option value="WORKSHOPS">WORKSHOPS</option>
                      <option value="HACKATHONS">HACKATHONS</option>
                      <option value="BEHIND THE SCENES">BEHIND THE SCENES</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono text-slate-300">IMAGE ASSET</label>
                    <input
                      type="text"
                      required
                      value={editingItem.imageUrl}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, imageUrl: e.target.value })
                      }
                      placeholder="e.g. ctf, ws1, or https://..."
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono text-slate-300">YEAR</label>
                    <select
                      value={editingItem.year}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          year: e.target.value as GalleryItem["year"],
                        })
                      }
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>
                </div>

                {editingItem.imageUrl && editingItem.imageUrl.trim().length > 0 && (
                  <div className="p-2.5 rounded bg-[#030712] border border-[#1E293B] flex items-center gap-3 overflow-hidden">
                    <div className="relative w-16 h-12 rounded overflow-hidden bg-[#070D1D] shrink-0 border border-[#1E293B]">
                      <CloudinaryImage
                        src={editingItem.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="font-mono text-xs text-slate-400 min-w-0 flex-1 overflow-hidden">
                      <span className="text-cyber-blue text-[10px] block font-bold tracking-wider uppercase">PREVIEW</span>
                      <p className="truncate text-white text-xs block max-w-full font-mono">{editingItem.imageUrl}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">TAGS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={editingItem.tags.join(", ")}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Web Security, Forensics"
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-3.5 py-2 rounded-md border border-[#1E293B] text-slate-400 hover:text-white font-mono text-xs"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-cyber-blue text-black font-mono text-xs font-bold hover:bg-cyber-blue-light flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{loading ? "SAVING..." : "SAVE PHOTO"}</span>
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
