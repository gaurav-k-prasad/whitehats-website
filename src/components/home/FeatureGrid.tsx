"use client";

import React from "react";
import { FEATURE_CARDS } from "@/data/homeData";
import FeatureCard from "./FeatureCard";
import StaggerReveal, { StaggerItem } from "@/components/ui/StaggerReveal";

export default function FeatureGrid() {
  return (
    <StaggerReveal
      staggerDelay={0.1}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {FEATURE_CARDS.map((card) => (
        <StaggerItem key={card.id} className="h-full">
          <FeatureCard card={card} />
        </StaggerItem>
      ))}
    </StaggerReveal>
  );
}
