export interface ClubEvent {
  id: string;
  title: string;
  type: 'CTF' | 'Workshop' | 'Seminar' | 'Bootcamp';
  status?: 'UPCOMING' | 'ONGOING' | 'PAST';
  date: string; // ISO Date YYYY-MM-DD (e.g. "2026-04-05")
  time: string;
  location: string;
  description: string;
  tags: string[];
  imageUrl?: string | null;
  registrationUrl?: string | null;
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
 * Parses time string (e.g. "01:00 PM") and returns { hours: number, minutes: number } (24-hour format).
 */
export function parseTimeParts(timePart?: string): { hours: number; minutes: number } | null {
  if (!timePart) return null;
  const match = timePart.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3] ? match[3].toUpperCase() : null;

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
}

/**
 * Returns exact start and end Date objects for an event in local time.
 */
export function getEventDateRange(
  dateStr: string,
  timeStr?: string
): { start: Date; end: Date } {
  const start = createLocalDate(dateStr, 0, 0, 0, 0);
  const end = createLocalDate(dateStr, 23, 59, 59, 999);

  if (!timeStr) return { start, end };

  const parts = timeStr.split('-').map((s) => s.trim());
  if (parts.length >= 2) {
    const startTime = parseTimeParts(parts[0]);
    const endTime = parseTimeParts(parts[1]);

    if (startTime && endTime) {
      const actualStart = createLocalDate(dateStr, startTime.hours, startTime.minutes, 0, 0);
      const actualEnd = createLocalDate(dateStr, endTime.hours, endTime.minutes, 59, 999);

      // Handle overnight events spanning to next day (e.g. 10:00 PM - 02:00 AM)
      if (actualEnd < actualStart) {
        actualEnd.setDate(actualEnd.getDate() + 1);
      }
      return { start: actualStart, end: actualEnd };
    }
  }

  if (parts.length === 1) {
    const singleTime = parseTimeParts(parts[0]);
    if (singleTime) {
      const actualStart = createLocalDate(dateStr, singleTime.hours, singleTime.minutes, 0, 0);
      // Default duration: 3 hours
      const actualEnd = new Date(actualStart.getTime() + 3 * 60 * 60 * 1000);
      return { start: actualStart, end: actualEnd };
    }
  }

  return { start, end };
}

/**
 * Dynamically computes event status ('UPCOMING' | 'ONGOING' | 'PAST')
 * on the basis of the current local time.
 */
export function getDynamicEventStatus(event: {
  date: string;
  time?: string;
}): 'UPCOMING' | 'ONGOING' | 'PAST' {
  const now = new Date();
  const { start, end } = getEventDateRange(event.date, event.time);

  if (now < start) return 'UPCOMING';
  if (now >= start && now <= end) return 'ONGOING';
  return 'PAST';
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
 * Sorts an array of events chronologically in descending order (newest first),
 * dynamically assigning UPCOMING / ONGOING / PAST status based on local time.
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
    type: 'Workshop',
    date: '2026-04-05',
    time: '01:00 PM - 07:00 PM',
    location: 'VIT Vellore',
    description:
      'An intensive hands-on session focusing on building secure architectures and deploying defense-in-depth strategies.',
    tags: ['Architecture', 'Defense', 'Infrastructure'],
    imageUrl: "hack1"
  },
  {
    id: 'flagwars-26',
    title: "QW'26: FlagWars",
    type: 'CTF',
    date: '2026-03-05',
    time: '02:00 PM - 06:00 PM',
    location: 'Online',
    description:
      'Our flagship Capture The Flag competition. Teams battle through intense web, crypto, and pwn challenges.',
    tags: ['CTF', 'Web', 'Crypto', 'Pwn'],
    imageUrl: "ctf2"
  },
  {
    id: 'cybershield-sdgs',
    title: 'SDG - CyberShield for SDGs',
    type: 'Seminar',
    date: '2025-12-14',
    time: '04:00 PM - 05:00 PM',
    location: 'VIT Vellore',
    description:
      'Exploring the intersection of cybersecurity and sustainable development goals to protect digital infrastructure.',
    tags: ['Policy', 'Sustainability', 'Awareness'],
  },
  {
    id: 'hack-the-script',
    title: 'Hack the Script',
    type: 'Workshop',
    date: '2025-12-10',
    time: '12:00 PM - 01:00 PM',
    location: 'VIT Vellore',
    description:
      'Deep dive into cross-site scripting (XSS), injection flaws, and securing client-side execution contexts.',
    tags: ['XSS', 'Injection', 'AppSec'],
  },
  {
    id: 'crack-the-login',
    title: 'Crack the Login',
    type: 'Workshop',
    date: '2025-12-10',
    time: '11:00 AM - 12:00 PM',
    location: 'VIT Vellore',
    description:
      'A fast-paced workshop dissecting authentication mechanisms, password hashing, and brute-force vulnerabilities.',
    tags: ['Auth', 'Web Security', 'Pentesting'],
  },
  {
    id: 'wifi-hacker-kit',
    title: 'NCSAM - The WiFi Hacker Kit',
    type: 'Bootcamp',
    date: '2025-10-28',
    time: '11:00 AM - 12:00 PM',
    location: 'VIT Vellore',
    description:
      'National Cyber Security Awareness Month special: analyzing wireless protocols, WPA2 handshakes, and network security.',
    tags: ['Wireless', 'Networks', 'Packet Analysis'],
  },
  {
    id: 'boot-into-kali',
    title: 'Boot into Kali',
    type: 'Bootcamp',
    date: '2025-10-15',
    time: '11:00 AM - 01:00 PM',
    location: 'VIT Vellore',
    description:
      'The ultimate beginners guide to setting up, navigating, and weaponizing Kali Linux for penetration testing.',
    tags: ['Linux', 'OS', 'Fundamentals'],
  },
];

export const IMPACT_STATS = [
  { label: 'Events Conducted', value: '10+' },
  { label: 'Active Sessions', value: '15+' },
  { label: 'Knowledge Shared', value: '∞' },
];