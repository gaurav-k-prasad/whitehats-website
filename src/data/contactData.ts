// src/data/contactData.ts
//
// ⚠️ PLACEHOLDER DATA — replace with real values.
// Anything marked TODO needs an actual answer from the club (email inbox,
// meeting location/day, faculty coordinator, etc.) before this goes live.

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
  iconType: "mail" | "phone" | "map" | "clock";
  hint?: string;
}

export interface ContactSubjectOption {
  value: string;
  label: string;
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "email",
    label: "EMAIL_US",
    // TODO: swap for the official club inbox
    value: "whitehats@vit.ac.in",
    href: "whitehats@vit.ac.in",
    iconType: "mail",
    hint: "Best for recruitment, sponsorships & press",
  },
  {
    id: "location",
    label: "BASE_OF_OPERATIONS",
    // TODO: confirm exact block / lab name
    value: "VIT Vellore Campus",
    href: "https://maps.google.com/?q=VIT+Vellore",
    iconType: "map",
    hint: "Vellore, Tamil Nadu, India",
  },
  {
    id: "hours",
    label: "RESPONSE_WINDOW",
    value: "Mon – Fri, 10:00 – 18:00 IST",
    href: "#",
    iconType: "clock",
    hint: "Avg. reply time: under 48 hours",
  },
];

export const CONTACT_SUBJECTS: ContactSubjectOption[] = [
  { value: "recruitment", label: "Recruitment / Joining the Club" },
  { value: "collaboration", label: "Collaboration / Partnership" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "event", label: "Event / Workshop Query" },
  { value: "media", label: "Media / Press" },
  { value: "other", label: "Other" },
];

export const CONTACT_HERO_DATA = {
  label: "// ESTABLISH SECURE CHANNEL",
  headingPrefix: "< GET IN",
  headingSuffix: "TOUCH />",
  description:
    "Have a question, a collaboration in mind, or want to join the operation? Transmit your message below — our team monitors this channel around the clock.",
};

export const CONTACT_FAQS = [
  {
    q: "Who can join WhiteHats?",
    a: "Any VIT Vellore student curious about cybersecurity — no prior experience required. We train from fundamentals up.",
  },
  {
    q: "Do you host beginner-friendly events?",
    a: "Yes. Our bootcamps and workshops are designed to onboard complete beginners alongside seasoned CTF players.",
  },
  {
    q: "Can external organizations collaborate with WhiteHats?",
    a: "We're open to collaborations with other clubs, companies, and security communities — reach out via the form above.",
  },
];
