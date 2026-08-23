"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import CyberCardBorder from "@/components/ui/CyberCardBorder";
import CipherReveal from "@/components/ui/CipherReveal";
import { CONTACT_FAQS } from "@/data/contactData";

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-card-border pb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue shadow-neon-blue animate-pulse" />
        <h2 className="font-mono text-sm sm:text-base font-bold text-cyber-blue tracking-widest uppercase">
          <CipherReveal text="// FREQUENTLY ASKED" duration={400} />
        </h2>
      </div>

      <div className="flex flex-col gap-3 max-w-3xl">
        {CONTACT_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <CyberCardBorder key={faq.q} className="shadow-md" contentClassName="">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer"
              >
                <span className="font-mono text-sm text-slate-200 font-semibold">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-cyber-blue shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-text-muted text-xs sm:text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CyberCardBorder>
          );
        })}
      </div>
    </section>
  );
}
