export interface GalleryItem {
  id: string;
  title: string;
  quote: string;
  date: string;
  year: "2024" | "2025" | "2026";
  category: "CTFs" | "WORKSHOPS" | "HACKATHONS" | "BEHIND THE SCENES";
  tags: string[];
  imageUrl: string;
  width: number;
  height: number;
  aspectClass: string;
  description?: string;
  metrics?: { label: string; value: string }[];
}

export type FilterCategory = "ALL" | "CTFs" | "WORKSHOPS" | "HACKATHONS" | "BEHIND THE SCENES";

export interface GalleryFilterState {
  category: FilterCategory;
  searchQuery: string;
}

const CATEGORIES: ("CTFs" | "WORKSHOPS" | "HACKATHONS" | "BEHIND THE SCENES")[] = [
  "CTFs",
  "WORKSHOPS",
  "HACKATHONS",
  "BEHIND THE SCENES",
];

const TAGS_MAP = {
  CTFs: ["Binary Exploitation", "Reverse Engineering", "Web Security", "Cryptography", "Forensics", "Pwn"],
  WORKSHOPS: ["Hardware Security", "Cloud Penetration", "Malware Analysis", "Red Teaming", "OSINT"],
  HACKATHONS: ["Autonomous AI Defense", "Kernel Hardening", "Zero-Knowledge Proofs", "Secure Systems"],
  "BEHIND THE SCENES": ["Team Culture", "Lab Nights", "Hardware Bench", "War Room", "Hackathon Setup"],
};

// Rich varied dimensions & aspect ratios to ensure randomized sizing
const RANDOM_DIMENSIONS = [
  { w: 400, h: 520, class: "aspect-[4/5]" },
  { w: 620, h: 420, class: "aspect-[3/2]" },
  { w: 500, h: 500, class: "aspect-square" },
  { w: 720, h: 450, class: "aspect-[16/10]" },
  { w: 380, h: 560, class: "aspect-[2/3]" },
  { w: 640, h: 360, class: "aspect-[16/9]" },
  { w: 480, h: 640, class: "aspect-[3/4]" },
  { w: 550, h: 400, class: "aspect-[11/8]" },
  { w: 450, h: 450, class: "aspect-square" },
  { w: 750, h: 500, class: "aspect-[3/2]" },
  { w: 360, h: 580, class: "aspect-[9/15]" },
  { w: 580, h: 440, class: "aspect-[14/10]" },
  { w: 420, h: 600, class: "aspect-[7/10]" },
  { w: 680, h: 380, class: "aspect-[16/9]" },
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
  "Midnight War Room Strategy Session",
  "Spectre & Meltdown CPU Hardware Attack Lab",
  "Automated Fuzzing Pipeline Construction",
  "Deep Packet Inspection Evasion Lab",
  "WhiteHats Annual CTF Qualifier",
  "High-Altitude Balloon RF Signal Capture",
  "Red Team Multi-Stage Lateral Movement",
  "Zero-Knowledge Snark Circuit Verification",
];

const QUOTES = [
  '"Track prize secured. Mission accomplished."',
  '"One flag. One team. Countless lessons."',
  '"Oscilloscopes, lasers, and broken chips."',
  '"Zero-trust architecture in live execution."',
  '"Root access obtained. Challenge solved."',
  '"Decrypting the impossible under pressure."',
  '"Building offensive tools for resilient defense."',
  '"From silicon to cloud: total exploit coverage."',
  '"3:00 AM coffee and buffer overflow exploits."',
  '"When standard defenses fail, we innovate."',
];

function createMasonryDataset(total: number = 100): GalleryItem[] {
  const items: GalleryItem[] = [];

  for (let i = 1; i <= total; i++) {
    const id = i < 10 ? `0${i}` : `${i}`;
    const cat = CATEGORIES[(i - 1) % CATEGORIES.length];
    const availableTags = TAGS_MAP[cat];
    const tags = [
      availableTags[(i - 1) % availableTags.length],
      availableTags[(i + 1) % availableTags.length],
    ];
    const year: "2024" | "2025" | "2026" = i % 3 === 0 ? "2026" : i % 3 === 1 ? "2025" : "2024";
    const op = OPERATIONS[(i - 1) % OPERATIONS.length];
    const quote = QUOTES[(i - 1) % QUOTES.length];

    // Pick randomized dimensions from the diverse list
    const dimIndex = (i * 7 + (i % 5)) % RANDOM_DIMENSIONS.length;
    const aspect = RANDOM_DIMENSIONS[dimIndex];

    const day = (i * 7) % 28 + 1;
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = months[(i - 1) % 12];
    const date = `${day < 10 ? `0${day}` : day} ${month} ${year}`;

    // Unique randomized image size and ID
    const imageId = ((i * 19 + 7) % 90) + 10;
    const imageUrl = `https://picsum.photos/id/${imageId}/${aspect.w}/${aspect.h}`;

    items.push({
      id,
      title: `${op} #${id}`,
      quote,
      date,
      year,
      category: cat,
      tags,
      imageUrl,
      width: aspect.w,
      height: aspect.h,
      aspectClass: aspect.class,
      description: `WhiteHats archive record #${id} documenting ${cat.toLowerCase()} activities focusing on ${tags.join(" and ")}.`,
      metrics: [
        { label: "RANK", value: `#${(i % 5) + 1} PLACE` },
        { label: "TEAMS", value: `${75 + (i * 4) % 180}+` },
        { label: "STATUS", value: "SOLVED" },
      ],
    });
  }

  return items;
}

export const GALLERY_ITEMS: GalleryItem[] = createMasonryDataset(100);
