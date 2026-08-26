"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Shield, X, Save, AlertCircle } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import CipherReveal from "@/components/ui/CipherReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { BoardMember } from "@/data/boardData";
import { CloudinaryImage } from "@/components/ui/cloudinary";

export default function AdminBoardPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
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

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingMember({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `board-${Date.now()}`,
      name: "",
      role: "",
      category: "Domain Heads",
      imageUrl: "",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMember),
      });

      if (res.ok) {
        setFeedback(`Saved operator: ${editingMember.name}`);
        setEditingMember(null);
        refreshMembers();
        setTimeout(() => setFeedback(null), 3000);
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
      setFeedback("Failed to remove operator.");
    }
  };

  const categories: Array<BoardMember["category"]> = [
    "Core Leadership",
    "Vice Leadership",
    "Domain Heads",
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-blue tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
            <CipherReveal text="// DIRECTORY REGISTRY" duration={400} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            BOARD MEMBERS MANAGER
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Configure executive council and domain specialists synchronized with Cloudflare D1.
          </p>
        </div>

        <MagneticButton>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyber-blue text-black font-mono text-xs font-bold hover:bg-cyber-blue-light shadow-neon-blue transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>REGISTER OPERATOR</span>
          </button>
        </MagneticButton>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue-light font-mono text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Categories Grouping */}
      {isFetching ? (
        <div className="py-24 flex flex-col items-center justify-center text-center font-mono text-slate-400 gap-3 border border-dashed border-[#1E293B] rounded-xl bg-[#0B1120]/40">
          <div className="w-8 h-8 rounded-full border-2 border-cyber-blue border-t-transparent animate-spin" />
          <p className="text-xs tracking-wider text-cyber-blue font-bold uppercase animate-pulse">
            {"// SYNCHRONIZING BOARD OPERATORS DIRECTORY..."}
          </p>
        </div>
      ) : members.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center font-mono text-slate-500 gap-2 border border-dashed border-[#1E293B] rounded-xl">
          <Shield className="w-8 h-8 opacity-40 text-cyber-blue" />
          <p className="text-sm">No board operators registered in database.</p>
        </div>
      ) : (
        categories.map((category) => {
          const categoryMembers = members.filter((m) => m.category === category);

          return (
            <div key={category} className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-card-border/60 pb-2">
                <h2 className="font-mono text-xs sm:text-sm font-bold text-cyber-blue tracking-wider uppercase flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{"//"} {category} ({categoryMembers.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryMembers.map((member) => (
                  <CyberCardBorder key={member.id} contentClassName="p-4 flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-cyber-blue-light font-bold">
                          <span className="text-slate-400 truncate max-w-[180px]">{member.imageUrl || "No Image"}</span>
                        </div>
                        <h3 className="font-mono font-bold text-white text-base mt-1.5">
                          {member.name}
                        </h3>
                        <p className="font-mono text-xs text-cyber-blue font-semibold">
                          &gt; {member.role}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setIsNew(false);
                            setEditingMember(member);
                          }}
                          aria-label="Edit operator"
                          className="p-1.5 rounded-md border border-[#1E293B] hover:border-cyber-blue/60 bg-[#0B1120] text-slate-300 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          aria-label="Delete operator"
                          className="p-1.5 rounded-md border border-red-500/20 hover:border-red-500/60 bg-red-500/5 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </CyberCardBorder>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Edit / Add Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <CyberCardBorder contentClassName="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <Shield className="w-4 h-4 text-cyber-blue" />
                  <span>{isNew ? "REGISTER NEW OPERATOR" : `EDIT: ${editingMember.name}`}</span>
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

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">
                    IMAGE ASSET
                  </label>
                  <input
                    type="text"
                    value={editingMember.imageUrl}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, imageUrl: e.target.value })
                    }
                    placeholder="e.g. gaurav or https://..."
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                {editingMember.imageUrl && editingMember.imageUrl.trim().length > 0 && (
                  <div className="p-2.5 rounded bg-[#030712] border border-[#1E293B] flex items-center gap-3 overflow-hidden">
                    <div className="relative w-16 h-16 rounded overflow-hidden bg-[#070D1D] shrink-0 border border-[#1E293B]">
                      <CloudinaryImage
                        src={editingMember.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="font-mono text-xs text-slate-400 min-w-0 flex-1 overflow-hidden">
                      <span className="text-cyber-blue text-[10px] block font-bold tracking-wider uppercase">OPERATOR AVATAR PREVIEW</span>
                      <p className="truncate text-white text-xs block max-w-full font-mono">{editingMember.imageUrl}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
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
                    <span>{loading ? "SAVING..." : "COMMIT CHANGES"}</span>
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
