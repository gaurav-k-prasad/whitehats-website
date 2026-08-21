"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { TERMINAL_DATA } from "@/data/homeData";
import { executeCommand, BANNER_ASCII } from "@/lib/terminalCommands";

interface HistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
}

export default function TerminalGraphic() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [bootLines, setBootLines] = useState<React.ReactNode[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Boot sequence:
  // Render the initial banner with the 3 boot lines progressively added to its right side.
  useEffect(() => {
    // 1. Initial 1st boot line (at start)
    const line1 = (
      <div key="boot-1" className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5 leading-tight">
        <span className="text-cyber-blue">[+]</span>
        <span>Initializing secure WhiteHats terminal...</span>
      </div>
    );
    setBootLines([line1]);

    // 2. Add 2nd boot line at 1000ms
    const t1 = setTimeout(() => {
      const line2 = (
        <div key="boot-2" className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5 leading-tight">
          <span className="text-cyber-blue">[+]</span>
          <span>Loading encrypted kernel modules...</span>
        </div>
      );
      setBootLines((prev) => [...prev, line2]);
    }, 1000);

    // 3. Add 3rd boot line at 2000ms
    const t2 = setTimeout(() => {
      const line3 = (
        <div key="boot-3" className="text-emerald-400 font-mono text-[11px] flex items-center gap-1.5 leading-tight">
          <span className="text-emerald-400">[✓]</span>
          <span>System online. Type &apos;<span className="text-cyber-blue font-bold">help</span>&apos; for commands.</span>
        </div>
      );
      setBootLines((prev) => [...prev, line3]);
    }, 2000);

    // 4. Complete boot at 3000ms: enable input
    const t3 = setTimeout(() => {
      setIsInitializing(false);
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Auto-scroll on output change
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [history, inputVal, isInitializing, bootLines]);

  // Focus input when initialization finishes
  useEffect(() => {
    if (!isInitializing) {
      inputRef.current?.focus();
    }
  }, [isInitializing]);

  const handleContainerClick = () => {
    if (!isInitializing) {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isInitializing) return;

    if (e.key === "Enter") {
      const rawInput = inputVal;
      const trimmed = rawInput.trim();

      if (!trimmed) {
        setHistory((prev) => [
          ...prev,
          {
            id: `cmd-${Date.now()}`,
            command: "",
            output: null,
          },
        ]);
        setInputVal("");
        return;
      }

      if (trimmed.toLowerCase() === "clear") {
        setHistory([]);
        setCommandHistory((prev) => [...prev, trimmed]);
        setHistoryIndex(-1);
        setInputVal("");
        return;
      }

      const result = executeCommand(trimmed);

      setHistory((prev) => [
        ...prev,
        {
          id: `cmd-${Date.now()}-${Math.random()}`,
          command: trimmed,
          output: result.output,
        },
      ]);

      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
      setInputVal("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const nextIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);

      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;

      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex] || "");
      }
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="rounded-xl border border-card-border bg-card-bg shadow-2xl overflow-hidden font-mono relative cursor-text group h-[380px] flex flex-col"
    >
      {/* Background Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <div className="relative w-72 h-72 opacity-[0.09] filter grayscale contrast-125">
          <Image
            src="/logo.png"
            alt="WhiteHats Logo Watermark"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-card-border text-xs text-text-muted select-none relative z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-cyber-blue font-semibold">{TERMINAL_DATA.userPrompt}</span>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div
        ref={terminalScrollRef}
        className="p-5 relative z-10 flex-1 flex flex-col gap-3 text-xs overflow-y-auto"
      >
        {/* Initial First Banner with 3 Progressive Boot Lines on the Right */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shrink-0">
          <pre className="text-cyber-blue font-mono font-bold leading-relaxed overflow-x-auto select-none drop-shadow-[0_0_10px_rgba(0,136,255,0.6)] shrink-0">
            {BANNER_ASCII}
          </pre>
          <div className="flex flex-col gap-1 sm:border-l sm:border-card-border sm:pl-3 min-h-[50px]">
            {bootLines}
          </div>
        </div>

        {/* Subsequent Command History */}
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            {item.command !== "" && (
              <div className="flex items-center gap-1.5">
                <span className="text-cyber-blue font-bold">&gt;</span>
                <span className="text-cyber-blue font-bold">{item.command}</span>
              </div>
            )}
            {item.output && <div>{item.output}</div>}
          </div>
        ))}

        {/* Interactive Input Line (Active once 3-second boot finishes) */}
        {!isInitializing && (
          <div className="flex items-center gap-1.5 text-cyber-blue font-bold pt-1">
            <span>&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono text-xs p-0 focus:ring-0"
              placeholder="type 'help' for commands..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
