"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Save, AlertCircle, Layers, UploadCloud } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import CipherReveal from "@/components/ui/CipherReveal";
import { CloudinaryImage } from "@/components/ui/cloudinary";
import { GalleryItem } from "@/data/galleryData";
import ImageUploadPicker from "@/components/admin/ImageUploadPicker";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenSingleAdd = () => {
    setIsNew(true);
    setIsBulkMode(false);
    setSelectedFile(null);
    setSelectedFiles([]);
    setTagsInput("Security, CTF");
    setEditingItem({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `gallery-${Date.now()}`,
      title: "",
      quote: "",
      date: "",
      year: "2026",
      category: "CTFs",
      tags: ["Security", "CTF"],
      imageUrl: "",
      width: 600,
      height: 400,
      aspectClass: "aspect-[3/2]",
    });
  };

  const handleOpenBulkAdd = () => {
    setIsNew(true);
    setIsBulkMode(true);
    setSelectedFile(null);
    setSelectedFiles([]);
    setTagsInput("Security, Operation");
    setEditingItem({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `gallery-bulk-${Date.now()}`,
      title: "",
      quote: "",
      date: "",
      year: "2026",
      category: "CTFs",
      tags: ["Security", "Operation"],
      imageUrl: "",
      width: 600,
      height: 400,
      aspectClass: "aspect-[3/2]",
    });
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setIsNew(false);
    setIsBulkMode(false);
    setSelectedFile(null);
    setSelectedFiles([]);
    setTagsInput((item.tags || []).join(", "));
    setEditingItem(item);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isBulkMode && selectedFiles.length === 0) {
      setFeedback("Please select at least 1 image file for bulk upload.");
      return;
    }

    setLoading(true);
    try {
      const parsedTags = tagsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      let res: Response;

      // Case A: Bulk Upload with multiple files
      if (isBulkMode && selectedFiles.length > 0) {
        const formData = new FormData();
        formData.append("isBulk", "true");
        formData.append("title", editingItem.title);
        formData.append("quote", editingItem.quote || "");
        formData.append("date", editingItem.date || "");
        formData.append("year", editingItem.year || "2026");
        formData.append("category", editingItem.category);
        formData.append("tags", parsedTags.join(", "));
        formData.append("aspectClass", editingItem.aspectClass || "aspect-[3/2]");

        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        res = await fetch("/api/admin/gallery", {
          method: "POST",
          body: formData,
        });
      }
      // Case B: Single Upload with file
      else if (selectedFile) {
        const formData = new FormData();
        formData.append("id", editingItem.id);
        formData.append("title", editingItem.title);
        formData.append("quote", editingItem.quote || "");
        formData.append("date", editingItem.date || "");
        formData.append("year", editingItem.year || "2026");
        formData.append("category", editingItem.category);
        formData.append("tags", parsedTags.join(", "));
        formData.append("aspectClass", editingItem.aspectClass || "aspect-[3/2]");
        formData.append("imageFile", selectedFile);

        res = await fetch("/api/admin/gallery", {
          method: "POST",
          body: formData,
        });
      }
      // Case C: Single JSON with manual Cloudinary ID / URL
      else {
        const payload = {
          ...editingItem,
          tags: parsedTags,
        };

        res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const data = await res.json();
        setFeedback(
          isBulkMode
            ? `Successfully uploaded ${data.count || selectedFiles.length} photos to Gallery!`
            : `Saved gallery item: ${editingItem.title}`
        );
        setEditingItem(null);
        setSelectedFile(null);
        setSelectedFiles([]);
        refreshItems();
        setTimeout(() => setFeedback(null), 4000);
      } else {
        const data = await res.json();
        setFeedback(data.error || "Failed to save gallery media.");
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
        setFeedback(`Photo "${title}" removed.`);
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
          <h1 className="text-2xl font-black font-mono tracking-wider uppercase text-white flex items-center gap-3">
            <CipherReveal text="// GALLERY MEDIA VAULT" duration={400} />
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Manage captured operation visual media, CTF photos, and bootcamps.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Bulk Upload Button */}
          <button
            type="button"
            onClick={handleOpenBulkAdd}
            className="relative group px-4 py-2.5 rounded-lg bg-[#0B1120] border border-cyber-blue/50 text-cyber-blue font-mono text-xs font-bold shadow-[0_0_12px_rgba(0,136,255,0.15)] hover:shadow-[0_0_20px_rgba(0,136,255,0.4)] hover:border-cyber-blue hover:bg-cyber-blue/10 inline-flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <Layers className="w-4 h-4 text-cyber-blue transition-transform duration-200 group-hover:scale-110" />
            <span>BULK UPLOAD</span>
          </button>

          {/* Single Upload Button */}
          <button
            type="button"
            onClick={handleOpenSingleAdd}
            className="relative group px-4 py-2.5 rounded-lg bg-cyber-blue text-black font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,136,255,0.35)] hover:shadow-[0_0_25px_rgba(0,136,255,0.6)] inline-flex items-center gap-2 hover:bg-cyber-blue-light transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
            <span>ADD PHOTO</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-lg bg-[#0B1120] border border-cyber-blue/40 text-cyber-blue font-mono text-xs flex items-center gap-2.5 animate-fade-in shadow-neon-blue">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Media Grid */}
      {isFetching ? (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-3 font-mono text-xs text-cyber-blue border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
          <span className="tracking-widest uppercase">SYNCHRONIZING GALLERY ASSETS...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="w-full py-16 text-center border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/30 font-mono text-xs text-slate-500">
          NO MEDIA LOGGED IN DATABASE
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((item) => (
            <CyberCardBorder key={item.id} contentClassName="p-2.5 flex flex-col justify-between gap-2">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#070D1D] border border-[#1E293B]">
                <CloudinaryImage
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-mono font-bold text-white text-xs truncate">
                    {item.title}
                  </h3>
                  <span className="font-mono text-[9px] text-slate-400">
                    {item.year}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-card-border/60">
                  <span className="font-mono text-[9px] text-slate-400 truncate max-w-[100px]">
                    {item.imageUrl}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1 rounded hover:bg-[#0B1120] text-slate-300 hover:text-white cursor-pointer"
                      title="Edit Media"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 cursor-pointer"
                      title="Delete Media"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </CyberCardBorder>
          ))}
        </div>
      )}

      {/* Edit / Add / Bulk Modal */}
      {editingItem && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingItem(null);
          }}
          className="fixed inset-0 z-[1000] overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 md:p-8 flex justify-center items-start min-h-screen py-8 sm:py-12"
        >
          <div className="w-full max-w-xl my-auto">
            <CyberCardBorder contentClassName="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  {isBulkMode ? (
                    <Layers className="w-4 h-4 text-cyber-blue" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-cyber-blue" />
                  )}
                  <span>
                    {isBulkMode
                      ? "BULK UPLOAD TO GALLERY"
                      : isNew
                      ? "ADD GALLERY PHOTO"
                      : `EDIT: ${editingItem.title}`}
                  </span>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                {isBulkMode && (
                  <div className="p-3 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue font-mono text-xs flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 shrink-0" />
                    <span>
                      Bulk mode active: All selected images will share this Title, Category, Year, and Tags.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono text-slate-300">
                      {isBulkMode ? "SHARED ALBUM / EVENT TITLE" : "TITLE"}
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, title: e.target.value })
                      }
                      placeholder="e.g. QW'26 CTF Finals"
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
                    <label className="text-xs font-mono text-slate-300">DATE (OPTIONAL)</label>
                    <input
                      type="text"
                      value={editingItem.date || ""}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, date: e.target.value })
                      }
                      placeholder="e.g. Mar 2026"
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono text-slate-300">YEAR</label>
                    <select
                      value={editingItem.year || "2026"}
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

                {/* Direct Image Upload Component: Multi-mode for Bulk, Single-mode otherwise */}
                {isBulkMode ? (
                  <ImageUploadPicker
                    multiple={true}
                    label="SELECT GALLERY PHOTOS (BULK)"
                    selectedFiles={selectedFiles}
                    onSelectFiles={setSelectedFiles}
                  />
                ) : (
                  <ImageUploadPicker
                    label="GALLERY PHOTO"
                    value={editingItem.imageUrl}
                    onChangeValue={(val) =>
                      setEditingItem({ ...editingItem, imageUrl: val })
                    }
                    selectedFile={selectedFile}
                    onSelectFile={setSelectedFile}
                  />
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">TAGS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Web Security, Forensics"
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">QUOTE / CAPTION (OPTIONAL)</label>
                  <input
                    type="text"
                    value={editingItem.quote || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, quote: e.target.value })
                    }
                    placeholder="e.g. Exploiting vulnerabilities in live environments"
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
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
                      <span className="animate-pulse">
                        {isBulkMode
                          ? `UPLOADING ${selectedFiles.length} PHOTOS...`
                          : "SAVING & UPLOADING..."}
                      </span>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>
                          {isBulkMode
                            ? `UPLOAD ${selectedFiles.length > 0 ? selectedFiles.length : ""} PHOTOS`
                            : "SAVE PHOTO"}
                        </span>
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
