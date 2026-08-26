"use client";

import React, { useRef, useState, useCallback } from "react";
import { Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  ariaLabel?: string;
}

export default function NumberInput({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  disabled = false,
  className = "",
  inputClassName = "",
  buttonClassName = "",
  prefix,
  suffix,
  ariaLabel = "Number input",
}: NumberInputProps) {
  const [localText, setLocalText] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clampValue = useCallback(
    (val: number) => {
      let clamped = val;
      if (typeof min === "number" && clamped < min) clamped = min;
      if (typeof max === "number" && clamped > max) clamped = max;
      return clamped;
    },
    [min, max]
  );

  const updateValue = useCallback(
    (delta: number) => {
      if (disabled) return;
      const current = isNaN(Number(localText)) ? value : Number(localText);
      const next = clampValue(current + delta);
      onChange(next);
      setLocalText(String(next));
    },
    [disabled, localText, value, clampValue, onChange]
  );

  const handleIncrement = useCallback(() => {
    updateValue(step);
  }, [updateValue, step]);

  const handleDecrement = useCallback(() => {
    updateValue(-step);
  }, [updateValue, step]);

  // Press & hold continuous stepper
  const startHold = (action: () => void) => {
    if (disabled) return;
    action();
    holdTimerRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        action();
      }, 75);
    }, 300);
  };

  const stopHold = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdTimerRef.current = null;
    holdIntervalRef.current = null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalText(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(clampValue(parsed));
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setLocalText(String(value));
  };

  const handleBlur = () => {
    setIsFocused(false);
    let parsed = parseFloat(localText);
    if (isNaN(parsed)) {
      parsed = typeof min === "number" ? min : 0;
    }
    const clamped = clampValue(parsed);
    setLocalText(String(clamped));
    onChange(clamped);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleDecrement();
    }
  };

  const isMin = typeof min === "number" && value <= min;
  const isMax = typeof max === "number" && value >= max;
  const displayValue = isFocused ? localText : String(value);

  return (
    <div
      className={`relative inline-flex items-center rounded-lg bg-[#030712] border transition-all duration-200 ${
        isFocused
          ? "border-cyber-blue shadow-[0_0_12px_rgba(0,136,255,0.25)]"
          : "border-[#1E293B] hover:border-slate-700"
      } ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
    >
      {/* Decrement Button */}
      <motion.button
        type="button"
        aria-label="Decrease value"
        disabled={disabled || isMin}
        onMouseDown={() => startHold(handleDecrement)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(handleDecrement)}
        onTouchEnd={stopHold}
        whileTap={{ scale: 0.9 }}
        className={`flex items-center justify-center h-8 w-8 text-slate-400 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded-l-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer border-r border-[#1E293B]/70 select-none ${buttonClassName}`}
      >
        <Minus className="w-3.5 h-3.5" />
      </motion.button>

      {/* Prefix */}
      {prefix && (
        <div className="pl-2 font-mono text-xs text-slate-500 select-none pointer-events-none">
          {prefix}
        </div>
      )}

      {/* Direct Input */}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={ariaLabel}
        disabled={disabled}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-14 text-center bg-transparent py-1.5 px-1 font-mono text-xs font-bold text-white outline-none selection:bg-cyber-blue selection:text-black ${inputClassName}`}
      />

      {/* Suffix */}
      {suffix && (
        <div className="pr-2 font-mono text-xs text-slate-500 select-none pointer-events-none">
          {suffix}
        </div>
      )}

      {/* Increment Button */}
      <motion.button
        type="button"
        aria-label="Increase value"
        disabled={disabled || isMax}
        onMouseDown={() => startHold(handleIncrement)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(handleIncrement)}
        onTouchEnd={stopHold}
        whileTap={{ scale: 0.9 }}
        className={`flex items-center justify-center h-8 w-8 text-slate-400 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded-r-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer border-l border-[#1E293B]/70 select-none ${buttonClassName}`}
      >
        <Plus className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  );
}
