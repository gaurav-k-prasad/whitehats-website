import React from "react";
import { FEATURE_CARDS } from "@/data/homeData";
import FeatureCard from "./FeatureCard";

export default function FeatureGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {FEATURE_CARDS.map((card) => (
        <FeatureCard key={card.id} card={card} />
      ))}
    </section>
  );
}
