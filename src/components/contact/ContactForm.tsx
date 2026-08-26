"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import ScanlineOverlay from "@/components/ui/ScanlineOverlay";
import MagneticButton from "@/components/ui/MagneticButton";
import CipherReveal from "@/components/ui/CipherReveal";
import { CONTACT_SUBJECTS, CONTACT_CHANNELS } from "@/data/contactData";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  subject: CONTACT_SUBJECTS[0]?.value ?? "",
  message: "",
};

const FIELD_CLASSES =
  "w-full rounded-lg bg-[#030712] border border-[#1E293B] px-3.5 py-2.5 text-sm text-slate-200 font-mono placeholder:text-slate-600 outline-none focus:border-cyber-blue/70 focus:shadow-[0_0_0_3px_rgba(0,136,255,0.12)] transition-all";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const emailChannel = CONTACT_CHANNELS.find((c) => c.id === "email");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please complete all required fields.");
      setSubmitted(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Valid email address is required");
      setSubmitted(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to transmit message.");
        setSubmitted(false);
        return;
      }

      setError(null);
      setSubmitted(true);
    } catch {
      setError("Network or server connection failed. Please try again.");
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CyberCardBorder isHovered={isHovered} className="shadow-2xl" contentClassName="p-6 sm:p-8 relative">
        <ScanlineOverlay opacity="opacity-[0.025]" />

        <div className="relative z-10 flex items-center justify-between mb-6 border-b border-[#1E293B] pb-3">
          <h2 className="font-mono text-sm sm:text-base font-bold text-cyber-blue tracking-widest uppercase">
            <CipherReveal text="// TRANSMIT MESSAGE" duration={400} />
          </h2>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        </div>

        {error && !submitted && (
          <div className="mb-4 p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center justify-center gap-3 py-14 text-center"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-400" strokeWidth={1.5} />
              <p className="font-mono text-sm text-slate-200 font-bold">
                TRANSMISSION LOGGED TO COMMAND VAULT
              </p>
              <p className="text-text-muted text-xs max-w-xs">
                Our operations team will review your message shortly. Alternatively, you can reach us directly at{" "}
                <a href={emailChannel?.href} className="text-cyber-blue hover:underline">
                  {emailChannel?.value}
                </a>
                .
              </p>
              <button
                onClick={() => {
                  setForm(INITIAL_STATE);
                  setSubmitted(false);
                  setError(null);
                }}
                className="mt-2 text-xs font-mono text-cyber-blue hover:text-cyber-blue-light underline underline-offset-4 cursor-pointer"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="relative z-10 flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Doe"
                    className={FIELD_CLASSES}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="jane@vitstudent.ac.in"
                    className={FIELD_CLASSES}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={`${FIELD_CLASSES} cursor-pointer`}
                >
                  {CONTACT_SUBJECTS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#030712]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  className={`${FIELD_CLASSES} resize-none`}
                />
              </div>

              <div className="pt-2">
                <MagneticButton strength={14}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-cyber-blue hover:bg-cyber-blue-light text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-neon-blue hover:shadow-[0_0_25px_rgba(0,136,255,0.6)] cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>TRANSMITTING...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Transmission</span>
                        <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </MagneticButton>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </CyberCardBorder>
    </div>
  );
}
