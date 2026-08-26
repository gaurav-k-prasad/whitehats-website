export interface ClubEvent {
  id: string;
  title: string;
  type: 'CTF' | 'Workshop' | 'Seminar' | 'Bootcamp' | 'Hackathon';
  status?: 'UPCOMING' | 'ONGOING' | 'PAST';
  date: string; // ISO Date YYYY-MM-DD (e.g. "2026-04-05")
  time: string;
  location: string;
  description: string;
  tags: string[];
  imageUrl?: string | null;
  registrationUrl?: string | null;
  highlights?: string[];
  mode?: 'In-Person' | 'Online' | 'Hybrid';
}

export function formatEventDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-').map((v) => parseInt(v, 10));
  if (parts.length === 3 && !parts.some(isNaN)) {
    const localD = new Date(parts[0], parts[1] - 1, parts[2]);
    return localD.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Creates a Date instance strictly in the user's local timezone from YYYY-MM-DD.
 */
export function createLocalDate(
  dateStr: string,
  hours = 0,
  minutes = 0,
  seconds = 0,
  ms = 0
): Date {
  const parts = dateStr.split('-').map((v) => parseInt(v, 10));
  if (parts.length === 3 && !parts.some(isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2], hours, minutes, seconds, ms);
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? new Date(0) : fallback;
}

/**
 * Parses time string like "02:00 PM - 06:00 PM" or "02:00 PM" into start and end hours/minutes.
 */
export function parseEventTimeRange(timeStr?: string): {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
} {
  const defaultTimes = { startHour: 0, startMinute: 0, endHour: 23, endMinute: 59 };
  if (!timeStr) return defaultTimes;

  const parseTimeComponent = (comp: string): { hour: number; minute: number } | null => {
    const match = comp.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return null;
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const period = match[3]?.toUpperCase();

    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    return { hour, minute };
  };

  const parts = timeStr.split('-').map((s) => s.trim());
  const start = parts[0] ? parseTimeComponent(parts[0]) : null;
  const end = parts[1] ? parseTimeComponent(parts[1]) : null;

  if (start && end) {
    return {
      startHour: start.hour,
      startMinute: start.minute,
      endHour: end.hour,
      endMinute: end.minute,
    };
  } else if (start) {
    return {
      startHour: start.hour,
      startMinute: start.minute,
      endHour: Math.min(23, start.hour + 2),
      endMinute: start.minute,
    };
  }

  return defaultTimes;
}

/**
 * Returns exact start and end Date objects in the local timezone for an event.
 */
export function getEventDateRange(dateStr: string, timeStr?: string): { start: Date; end: Date } {
  const { startHour, startMinute, endHour, endMinute } = parseEventTimeRange(timeStr);
  const start = createLocalDate(dateStr, startHour, startMinute, 0, 0);
  const end = createLocalDate(dateStr, endHour, endMinute, 59, 999);
  return { start, end };
}

/**
 * Dynamically computes UPCOMING / ONGOING / PAST status based on local time.
 */
export function getDynamicEventStatus(event: { date: string; time?: string }): 'UPCOMING' | 'ONGOING' | 'PAST' {
  const now = new Date();
  const { start, end } = getEventDateRange(event.date, event.time);

  if (now.getTime() < start.getTime()) {
    return 'UPCOMING';
  } else if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
    return 'ONGOING';
  } else {
    return 'PAST';
  }
}

/**
 * Attaches the calculated dynamic status to an event object.
 */
export function attachDynamicEventStatus(event: ClubEvent): ClubEvent {
  return {
    ...event,
    status: getDynamicEventStatus(event),
  };
}

export function getEventDateTime(dateStr: string, timeStr?: string): Date {
  const { start } = getEventDateRange(dateStr, timeStr);
  return start;
}

/**
 * Sorts an array of events chronologically in descending order (newest first).
 */
export function sortEventsDescending(events: ClubEvent[]): ClubEvent[] {
  return events
    .map(attachDynamicEventStatus)
    .sort((a, b) => {
      const timeA = getEventDateTime(a.date, a.time).getTime();
      const timeB = getEventDateTime(b.date, b.time).getTime();
      return timeB - timeA;
    });
}

export const EVENTS_DATA: ClubEvent[] = [
  {
    id: 'build-and-beyond',
    title: 'Build & Beyond',
    type: 'Hackathon',
    date: '2026-04-05',
    time: '01:00 PM - 07:00 PM',
    location: 'VIT Vellore',
    mode: 'In-Person',
    description:
      'An intense, time-bounded cybersecurity hackathon sprint where builder teams compete across multiple specialized cyber tracks—including AI threat defense, cloud infrastructure hardening, cryptographic systems, and exploit mitigation—to prototype and deploy production-grade defense architectures.',
    tags: ['Cybersecurity Hackathon', 'Multi-Track', 'Cloud & AppSec', 'Rapid Prototyping'],
    imageUrl: 'hack1',
    highlights: [
      'Multi-track cyber challenges (AI Defense, Cloud Security, Cryptography, AppSec)',
      'Limited-time competitive building sprint with real-time testing',
      'Mentorship from senior security researchers and live jury evaluation',
    ],
  },
  {
    id: 'flagwars-26',
    title: "QW'26: FlagWars",
    type: 'CTF',
    date: '2026-03-05',
    time: '02:00 PM - 06:00 PM',
    location: 'VIT Vellore',
    mode: 'In-Person',
    description:
      'Our flagship Capture The Flag competition. Operators battle through multi-tier web exploitation, binary exploitation, cryptographic puzzles, and forensics challenges.',
    tags: ['CTF', 'Web Exploitation', 'Cryptography', 'Binary Pwn'],
    imageUrl: 'ctf2',
    highlights: [
      'Multi-category Jeopardy style challenge grid',
      'Real-time dynamic scoreboard & analytics',
      'Exclusive WhiteHats prizes & certificates',
    ],
  },
  {
    id: 'cybershield-sdgs',
    title: 'SDG - CyberShield for SDGs',
    type: 'Seminar',
    date: '2025-12-14',
    time: '04:00 PM - 05:00 PM',
    location: 'VIT Vellore',
    mode: 'In-Person',
    description:
      'Exploring the critical intersection of digital resilience and sustainable development goals, focusing on protecting energy grids, healthcare systems, and public infrastructure.',
    tags: ['Critical Infrastructure', 'Cyber Policy', 'Digital Resilience'],
    highlights: [
      'Securing sustainable national digital infrastructure',
      'Threat surface analysis in public sector systems',
      'Interactive Q&A on cyber diplomacy & compliance',
    ],
  },
  {
    id: 'hack-the-script',
    title: 'Hack the Script',
    type: 'Workshop',
    date: '2025-12-10',
    time: '12:00 PM - 01:00 PM',
    location: 'VIT Vellore',
    mode: 'In-Person',
    description:
      'Deep dive into client-side application security, covering DOM-based Cross-Site Scripting (XSS), prototype pollution, and modern content security policies.',
    tags: ['AppSec', 'XSS Exploitation', 'Client Security'],
    highlights: [
      'Exploiting DOM-based & stored XSS vulnerabilities',
      'Bypassing client-side validation & filters',
      'Implementing strict Content Security Policy (CSP)',
    ],
  },
  {
    id: 'crack-the-login',
    title: 'Crack the Login',
    type: 'Workshop',
    date: '2025-12-10',
    time: '11:00 AM - 12:00 PM',
    location: 'VIT Vellore',
    mode: 'In-Person',
    description:
      'A fast-paced workshop dissecting session management, JWT implementation flaws, password hashing algorithms, and brute-force mitigation techniques.',
    tags: ['Auth Security', 'JWT Tampering', 'Pentesting'],
    highlights: [
      'Deconstructing vulnerable JWT signing mechanisms',
      'Password hashing benchmarks (Bcrypt, Argon2, PBKDF2)',
      'Building automated brute-force protection middleware',
    ],
  },
  {
    id: 'wifi-hacker-kit',
    title: 'NCSAM - The WiFi Hacker Kit',
    type: 'Bootcamp',
    date: '2025-10-28',
    time: '11:00 AM - 12:00 PM',
    location: 'VIT Vellore',
    mode: 'In-Person',
    description:
      'National Cyber Security Awareness Month special: analyzing 802.11 wireless protocols, packet captures, four-way handshakes, and enterprise WiFi defense.',
    tags: ['Wireless Security', 'Packet Analysis', '802.11 Protocols'],
    highlights: [
      'Capturing & dissecting 802.11 4-way handshakes',
      'Rogue access points & evil twin attack vectors',
      'Configuring WPA3 enterprise encryption standards',
    ],
  },
  {
    id: 'boot-into-kali',
    title: 'Boot into Kali',
    type: 'Bootcamp',
    date: '2025-10-15',
    time: '11:00 AM - 01:00 PM',
    location: 'VIT Vellore',
    mode: 'In-Person',
    description:
      'The foundational bootcamp for aspiring ethical hackers: navigating Kali Linux, mastering network reconnaissance with Nmap, and configuring offensive toolchains.',
    tags: ['Kali Linux', 'Network Recon', 'Fundamentals'],
    highlights: [
      'Essential command-line workflows for penetration testers',
      'Port scanning & service fingerprinting with Nmap',
      'Configuring isolated sandboxes & virtual testing labs',
    ],
  },
];

export const IMPACT_STATS = [
  { label: 'Events Conducted', value: '10+' },
  { label: 'Active Sessions', value: '15+' },
  { label: 'Knowledge Shared', value: '∞' },
];