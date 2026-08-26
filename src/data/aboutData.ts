// src/data/aboutData.ts
//
// ⚠️ PLACEHOLDER DATA — replace with the club's real founding story,
// exact stats, and values copy once confirmed. Structure/shape is final;
// only the copy needs a pass.

export interface AboutValue {
  id: string;
  title: string;
  description: string;
  iconType: "shield" | "code" | "users" | "target";
}

export interface AboutStat {
  label: string;
  value: string;
}

export interface AboutMilestone {
  year: string;
  title: string;
  description: string;
}

export const ABOUT_HERO_DATA = {
  label: "// CLUB DOSSIER",
  headingPrefix: "< WHO WE",
  headingSuffix: "ARE />",
  description:
    "WhiteHats is VIT Vellore's ethical hacking and cybersecurity collective — a community of students who break systems to understand them, then help build them stronger.",
};

// TODO: confirm exact founding year / origin story with the club
export const ABOUT_MISSION = {
  label: "// MISSION BRIEF",
  heading: "Why We Exist",
  body: "We exist to turn curiosity into capability. WhiteHats brings together students who want to go beyond theory — running CTFs, red-team simulations, hardware teardown sessions, and open-source security tooling — so members graduate with skills the industry actually tests for. Everything we run is grounded in ethics: we hack to defend, not to harm.",
};

export const ABOUT_STATS: AboutStat[] = [
  { label: "Active Members", value: "800+" },
  { label: "Events Conducted", value: "10+" },
  { label: "Open-Source Tools", value: "4+" },
  { label: "Founded", value: "2024" },
];

export const ABOUT_VALUES: AboutValue[] = [
  {
    id: "ethics",
    title: "Ethical First",
    description:
      "Every technique we teach comes with the responsibility of when — and when not — to use it. Consent and disclosure aren't optional.",
    iconType: "shield",
  },
  {
    id: "hands-on",
    title: "Learn By Breaking",
    description:
      "We believe in hands-on offense before defense — CTFs, labs, and live exploitation ranges over slide decks.",
    iconType: "code",
  },
  {
    id: "community",
    title: "Open Community",
    description:
      "No prior experience required. Beginners are paired with domain heads and mentored from day one.",
    iconType: "users",
  },
  {
    id: "impact",
    title: "Real-World Impact",
    description:
      "From campus infra audits to open-source security tools, we ship work that matters outside the classroom.",
    iconType: "target",
  },
];

// TODO: replace with the club's actual timeline / key milestones
export const ABOUT_MILESTONES: AboutMilestone[] = [
  {
    year: "2025",
    title: "WhiteHats Founded",
    description: "A small group of students at VIT Vellore forms the club around a shared obsession with offensive security.",
  },
  {
    year: "2025",
    title: "First Flagship CTF",
    description: "Launched our first campus-wide Capture The Flag competition, drawing teams across web, crypto, and pwn categories.",
  },
  {
    year: "2026",
    title: "Scaling Operations",
    description: "Expanded into open-source tooling, cloud security workshops, and inter-college collaborations.",
  },
];

export const ABOUT_CTA = {
  heading: "Ready to start hacking?",
  description: "Join a team of builders and breakers pushing offensive security forward at VIT Vellore.",
  ctaText: "Apply for Recruitment",
  ctaHref: "/contact",
};
