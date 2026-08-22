export interface GalleryItem {
  id: string;
  title: string;
  quote: string;
  date: string;
  year: "2025" | "2026";
  category: "CTF" | "HACKATHONS" | "WORKSHOPS" | "SEMINARS";
  tags: ("Cryptography" | "Hardware" | "Web" | "Binary Exploitation" | "Reverse Engineering" | "Forensics")[];
  imageUrl: string;
  description?: string;
  metrics?: { label: string; value: string }[];
}

export type FilterCategory = "ALL" | "CTF" | "HACKATHONS" | "WORKSHOPS" | "SEMINARS";
export type FilterYear = "ALL" | "2025" | "2026";
export type FilterTag =
  | "ALL"
  | "Cryptography"
  | "Hardware"
  | "Web"
  | "Binary Exploitation"
  | "Reverse Engineering"
  | "Forensics";

export interface GalleryFilterState {
  category: FilterCategory;
  year: FilterYear;
  tag: FilterTag;
  searchQuery: string;
}

const CATEGORIES: ("CTF" | "HACKATHONS" | "WORKSHOPS" | "SEMINARS")[] = [
  "HACKATHONS",
  "CTF",
  "WORKSHOPS",
  "SEMINARS",
];

const TAGS_LIST: ("Cryptography" | "Hardware" | "Web" | "Binary Exploitation" | "Reverse Engineering" | "Forensics")[][] = [
  ["Web", "Cryptography", "Binary Exploitation"],
  ["Binary Exploitation", "Reverse Engineering", "Web"],
  ["Hardware", "Reverse Engineering", "Cryptography"],
  ["Forensics", "Web", "Cryptography"],
  ["Reverse Engineering", "Binary Exploitation", "Hardware"],
  ["Cryptography", "Forensics", "Web"],
  ["Web", "Binary Exploitation", "Reverse Engineering"],
  ["Hardware", "Forensics", "Cryptography"],
];

const OPERATIONS = [
  "Zero-Day Verification Framework",
  "National Offensive Defense CTF",
  "Hardware Glitching & Side-Channel Bootcamp",
  "Kernel Heap Exploitation Deep Dive",
  "Satellite Telemetry Reverse Engineering",
  "Autonomous Exploit Generation Protocol",
  "Automated Incident Response Matrix",
  "Quantum Resistant Cryptographic Protocol",
  "Firmware Emulation & Baseband Audit",
  "Memory Corruption & ROP Chain Workshop",
  "Cloud Infrastructure Breach Simulation",
  "Physical Layer Lock-Bypassing Seminar",
];

const QUOTES = [
  '"Track prize secured. Mission accomplished."',
  '"One flag. One team. Countless lessons."',
  '"Oscilloscopes, lasers, and broken chips."',
  '"Zero-trust architecture in practice."',
  '"Root access obtained. Challenge solved."',
  '"Decrypting the impossible under pressure."',
  '"Building offensive tools for defense."',
  '"From silicon to cloud: total exploit coverage."',
];

// Generates 217 items (8 complete hexagonal spiral rings)
function createGalleryDataset(total: number = 217): GalleryItem[] {
  const items: GalleryItem[] = [];

  for (let i = 1; i <= total; i++) {
    const id = i < 10 ? `0${i}` : `${i}`;
    const cat = CATEGORIES[(i - 1) % CATEGORIES.length];
    const tags = TAGS_LIST[(i - 1) % TAGS_LIST.length];
    const year: "2025" | "2026" = i % 2 === 0 ? "2026" : "2025";
    const op = OPERATIONS[(i - 1) % OPERATIONS.length];
    const quote = QUOTES[(i - 1) % QUOTES.length];
    
    const day = (i * 7) % 28 + 1;
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = months[(i - 1) % 12];
    const date = `${day < 10 ? `0${day}` : day} ${month} ${year}`;

    // Unique Picsum photos for every node
    const imageId = (i * 13) % 95 + 10;
    const imageUrl = `https://picsum.photos/id/${imageId}/400/500`;

    items.push({
      id,
      title: `${op} #${id}`,
      quote,
      date,
      year,
      category: cat,
      tags,
      imageUrl,
      description: `WhiteHats classified archival record #${id} documenting high-intensity ${cat.toLowerCase()} operations focusing on ${tags.join(", ")}.`,
      metrics: [
        { label: "RANK", value: `#${(i % 5) + 1} PLACE` },
        { label: "TEAMS", value: `${80 + (i * 3) % 150}+` },
        { label: "STATUS", value: "SOLVED" },
      ],
    });
  }

  return items;
}

export const GALLERY_ITEMS: GalleryItem[] = createGalleryDataset(100);
