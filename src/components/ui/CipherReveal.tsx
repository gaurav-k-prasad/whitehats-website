"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const CIPHER_CHARS = "01010101ABCDEF0123456789%#$*&<>/_";

interface CipherRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div" | "p";
  delay?: number;
  duration?: number;
}

export default function CipherReveal({
  text,
  className = "",
  as: Component = "span",
  delay = 0,
  duration = 450,
}: CipherRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayText, setDisplayText] = useState(text);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const scrambleFrames = duration * 0.4; // 40% full scramble

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;

        if (elapsed < scrambleFrames) {
          // Phase 1: 100% text scrambles rapidly
          setDisplayText(
            text
              .split("")
              .map((char) =>
                char === " "
                  ? " "
                  : CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]
              )
              .join("")
          );
        } else {
          // Phase 2: Wave resolution left-to-right
          const progress = Math.min(
            1,
            (elapsed - scrambleFrames) / (duration - scrambleFrames)
          );
          const resolvedIndex = Math.floor(progress * text.length);

          setDisplayText(
            text
              .split("")
              .map((char, i) => {
                if (char === " ") return " ";
                if (i < resolvedIndex) return text[i];
                return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
              })
              .join("")
          );
        }

        if (elapsed >= duration) {
          clearInterval(interval);
          setDisplayText(text);
          setHasAnimated(true);
        }
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, text, delay, duration, hasAnimated]);

  return (
    // @ts-expect-error dynamic tag ref assignment
    <Component ref={ref} className={className}>
      {displayText}
    </Component>
  );
}
