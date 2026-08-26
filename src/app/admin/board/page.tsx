"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Shield, X, Save, AlertCircle } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import CipherReveal from "@/components/ui/CipherReveal";
import { BoardMember } from "@/data/boardData";
import { CloudinaryImage } from "@/components/ui/cloudinary";
import ImageUploadPicker from "@/components/admin/ImageUploadPicker";

export default function AdminBoardPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshMembers = () => {
    fetch("/api/admin/board")
      .then((res) => res.json())
      .then((data) => {
        if (data.members) {
          setMembers(data.members);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/board")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.members) {
          setMembers(data.members);
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
        setEditingMember(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenAdd = () => {
    setIsNew(true);
    setSelectedFile(null);
    setEditingMember({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `board-${Date.now()}`,
      name: "",
      role: "",
      category: "Domain Heads",
      imageUrl: "",
    });
  };

  const handleOpenEdit = (member: BoardMember) => {
    setIsNew(false);
    setSelectedFile(null);
    setEditingMember(member);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setLoading(true);
    try {
      let res: Response;

      if (selectedFile) {
        // Send as multipart/form-data for direct file upload with transactional rollback
        const formData = new FormData();
        formData.append("id", editingMember.id);
        formData.append("name", editingMember.name);
        formData.append("role", editingMember.role);
        formData.append("category", editingMember.category);
        if (editingMember.bio) formData.append("bio", editingMember.bio);
        formData.append("isActive", String(editingMember.isActive !== false));
        formData.append("imageFile", selectedFile);

        res = await fetch("/api/admin/board", {
          method: "POST",
          body: formData,
        });
      } else {
        // Send as JSON
        res = await fetch("/api/admin/board", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingMember),
        });
      }

      if (res.ok) {
        setFeedback(`Saved operator: ${editingMember.name}`);
        setEditingMember(null);
        setSelectedFile(null);
        refreshMembers();
        setTimeout(() => setFeedback(null), 3000);
      } else {
        const data = await res.json();
        setFeedback(data.error || "Failed to save changes.");
      }
    } catch {
      setFeedback("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove operator: ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/board?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeedback(`Operator ${name} removed.`);
        refreshMembers();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      setFeedback("Failed to delete member.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <h1 className="text-2xl font-black font-mono tracking-wider uppercase text-white flex items-center gap-3">
            <CipherReveal text="// BOARD ROSTER DIRECTORY" duration={400} />
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Manage WhiteHats Core Leadership, Vice Leadership, and Domain Heads.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="relative group px-4 py-2.5 rounded-lg bg-cyber-blue text-black font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,136,255,0.35)] hover:shadow-[0_0_25px_rgba(0,136,255,0.6)] inline-flex items-center gap-2 hover:bg-cyber-blue-light transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
          <span>ADD OPERATOR</span>
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
          <span className="tracking-widest uppercase">READING ROSTER FROM DATABASE...</span>
        </div>
      ) : members.length === 0 ? (
        <div className="w-full py-16 text-center border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/30 font-mono text-xs text-slate-500">
          NO OPERATORS CURRENTLY LOGGED IN DATABASE
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <CyberCardBorder key={member.id} contentClassName="p-4 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#070D1D] shrink-0 border border-[#1E293B]">
                  <CloudinaryImage
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#030712] border border-[#1E293B] text-cyber-blue truncate">
                      {member.category}
                    </span>
                  </div>
                  <h3 className="font-mono font-bold text-white text-sm truncate mt-1">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 truncate">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-card-border/60 text-xs font-mono text-slate-400">
                <span className="truncate max-w-[150px] text-[10px]">
                  {member.imageUrl}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 rounded-md border border-[#1E293B] hover:border-cyber-blue/60 bg-[#0B1120] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Operator"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-1.5 rounded-md border border-red-500/20 hover:border-red-500/60 bg-red-500/5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Delete Operator"
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
      {editingMember && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingMember(null);
          }}
          className="fixed inset-0 z-[1000] overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 md:p-8 flex justify-center items-start min-h-screen py-8 sm:py-12"
        >
          <div className="w-full max-w-lg my-auto">
            <CyberCardBorder contentClassName="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <Shield className="w-4 h-4 text-cyber-blue" />
                  <span>{isNew ? "ADD BOARD OPERATOR" : `EDIT: ${editingMember.name}`}</span>
                </div>
                <button
                  onClick={() => setEditingMember(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">CATEGORY</label>
                  <select
                    value={editingMember.category}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        category: e.target.value as BoardMember["category"],
                      })
                    }
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  >
                    <option value="Core Leadership">Core Leadership</option>
                    <option value="Vice Leadership">Vice Leadership</option>
                    <option value="Domain Heads">Domain Heads</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, name: e.target.value })
                    }
                    placeholder="e.g. Kartik Raj"
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">ROLE / TITLE</label>
                  <input
                    type="text"
                    required
                    value={editingMember.role}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, role: e.target.value })
                    }
                    placeholder="e.g. Technical Head"
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                {/* Direct Image Upload / Manual Input Component */}
                <ImageUploadPicker
                  label="OPERATOR AVATAR"
                  value={editingMember.imageUrl}
                  onChangeValue={(val) =>
                    setEditingMember({ ...editingMember, imageUrl: val })
                  }
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
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
                        <span>SAVE OPERATOR</span>
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
