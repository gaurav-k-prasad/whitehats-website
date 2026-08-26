"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Code, ExternalLink, X, Save, AlertCircle } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import CipherReveal from "@/components/ui/CipherReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import NumberInput from "@/components/ui/NumberInput";
import { ProjectRepository, ProjectStatus } from "@/data/projectsData";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRepository[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRepository | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshProjects = () => {
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.projects) {
          setProjects(data.projects);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.projects) {
          setProjects(data.projects);
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
    setEditingProject({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `project-${Date.now()}`,
      name: "",
      visibility: "Public",
      status: "ACTIVE_DEVELOPMENT",
      description: "",
      iconType: "terminal",
      techStack: ["Python", "Security"],
      contributors: 1,
      githubUrl: "https://github.com/TheWhitehatsclub-vit/",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        setFeedback(`Saved repository: ${editingProject.name}`);
        setEditingProject(null);
        refreshProjects();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      setFeedback("Failed to save project repository.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove project: ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeedback(`Project ${name} removed.`);
        refreshProjects();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {
      setFeedback("Failed to delete project repository.");
    }
  };

  const statusOptions: ProjectStatus[] = [
    "ACTIVE_DEVELOPMENT",
    "PRODUCTION_READY",
    "BETA_TESTING",
    "COMPLETED",
    "MAINTAINED",
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-blue tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
            <CipherReveal text="// ARSENAL REPOSITORIES" duration={400} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            PROJECTS & TOOLKITS MANAGER
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Configure open-source security tools and active repositories synchronized with Cloudflare D1.
          </p>
        </div>

        <MagneticButton>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyber-blue text-black font-mono text-xs font-bold hover:bg-cyber-blue-light shadow-neon-blue transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>DEPLOY REPOSITORY</span>
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
            {"// SYNCHRONIZING ARSENAL REPOSITORIES..."}
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center font-mono text-slate-500 gap-2 border border-dashed border-[#1E293B] rounded-xl">
          <Code className="w-8 h-8 opacity-40 text-cyber-blue" />
          <p className="text-sm">No repositories deployed in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <CyberCardBorder key={project.id} contentClassName="p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                        {project.status.replace("_", " ")}
                      </span>
                      <span className="text-slate-400 font-semibold">{project.visibility}</span>
                    </div>
                    <h3 className="font-mono font-bold text-white text-base mt-2">
                      {project.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditingProject(project);
                      }}
                      className="p-1.5 rounded-md border border-[#1E293B] hover:border-cyber-blue/60 bg-[#0B1120] text-slate-300 hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.name)}
                      className="p-1.5 rounded-md border border-red-500/20 hover:border-red-500/60 bg-red-500/5 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-mono text-slate-400 mt-2.5 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-[#030712] border border-[#1E293B] font-mono text-[10px] text-slate-300"
                    >
                      #{tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-card-border/60 text-xs font-mono text-slate-400">
                <span>{project.contributors} Contributors</span>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyber-blue hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </div>
            </CyberCardBorder>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <CyberCardBorder contentClassName="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <Code className="w-4 h-4 text-cyber-blue" />
                  <span>{isNew ? "DEPLOY REPOSITORY" : `EDIT: ${editingProject.name}`}</span>
                </div>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono text-slate-300">REPOSITORY NAME</label>
                    <input
                      type="text"
                      required
                      value={editingProject.name}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, name: e.target.value })
                      }
                      placeholder="e.g. Network_Anomaly_Detector"
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono text-slate-300">STATUS</label>
                    <select
                      value={editingProject.status}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          status: e.target.value as ProjectStatus,
                        })
                      }
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">GITHUB REPOSITORY URL</label>
                  <input
                    type="url"
                    required
                    value={editingProject.githubUrl}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono text-slate-300">CONTRIBUTORS COUNT</label>
                    <NumberInput
                      min={1}
                      max={999}
                      value={editingProject.contributors || 1}
                      onChange={(val) =>
                        setEditingProject({
                          ...editingProject,
                          contributors: val,
                        })
                      }
                      className="w-full justify-between"
                      inputClassName="flex-1"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono text-slate-300">VISIBILITY</label>
                    <select
                      value={editingProject.visibility}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          visibility: e.target.value as "Public" | "Private",
                        })
                      }
                      className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono text-slate-300">TECH STACK (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={editingProject.techStack.join(", ")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        techStack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Python, Cryptography, FastAPI"
                    className="w-full rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
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
                    <span>{loading ? "SAVING..." : "SAVE REPOSITORY"}</span>
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
