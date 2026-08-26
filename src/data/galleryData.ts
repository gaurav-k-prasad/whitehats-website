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
}

export type FilterCategory = "ALL" | "CTFs" | "WORKSHOPS" | "HACKATHONS" | "BEHIND THE SCENES";

export interface GalleryFilterState {
  category: FilterCategory;
  searchQuery: string;
}

// TODO: swap in real titles/dates/tags once available — imageUrl values
// are real Cloudinary public IDs from the `gallery` folder.
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "01", title: "CTF Session #1", quote: "", date: "", year: "2026", category: "CTFs", tags: ["Web Security", "Cryptography"], imageUrl: "ctf", width: 620, height: 420, aspectClass: "aspect-[3/2]" },
  { id: "02", title: "CTF Session #2", quote: "", date: "", year: "2026", category: "CTFs", tags: ["Binary Exploitation", "Forensics"], imageUrl: "ctf2", width: 500, height: 500, aspectClass: "aspect-square" },

  { id: "03", title: "Workshop #1", quote: "", date: "", year: "2026", category: "WORKSHOPS", tags: ["Hardware Security"], imageUrl: "ws1", width: 480, height: 640, aspectClass: "aspect-[3/4]" },
  { id: "04", title: "Workshop #2", quote: "", date: "", year: "2026", category: "WORKSHOPS", tags: ["Cloud Penetration"], imageUrl: "ws2", width: 640, height: 360, aspectClass: "aspect-[16/9]" },
  { id: "05", title: "Workshop #3", quote: "", date: "", year: "2026", category: "WORKSHOPS", tags: ["Malware Analysis"], imageUrl: "ws3", width: 400, height: 520, aspectClass: "aspect-[4/5]" },

  { id: "06", title: "Hackathon #1", quote: "", date: "", year: "2026", category: "HACKATHONS", tags: ["Secure Systems"], imageUrl: "hack1", width: 720, height: 450, aspectClass: "aspect-[16/10]" },
  { id: "07", title: "Hackathon #2", quote: "", date: "", year: "2026", category: "HACKATHONS", tags: ["Kernel Hardening"], imageUrl: "hack2", width: 550, height: 400, aspectClass: "aspect-[11/8]" },
  { id: "08", title: "Hackathon #3", quote: "", date: "", year: "2026", category: "HACKATHONS", tags: ["Zero-Knowledge Proofs"], imageUrl: "hack3", width: 450, height: 450, aspectClass: "aspect-square" },
  { id: "09", title: "Hackathon #4", quote: "", date: "", year: "2026", category: "HACKATHONS", tags: ["Autonomous AI Defense"], imageUrl: "hack4", width: 380, height: 560, aspectClass: "aspect-[2/3]" },
  { id: "10", title: "Hackathon #5", quote: "", date: "", year: "2026", category: "HACKATHONS", tags: ["Secure Systems"], imageUrl: "hack5", width: 750, height: 500, aspectClass: "aspect-[3/2]" },

  { id: "11", title: "Behind the Scenes #1", quote: "", date: "", year: "2026", category: "BEHIND THE SCENES", tags: ["Team Culture"], imageUrl: "bts1", width: 580, height: 440, aspectClass: "aspect-[14/10]" },
  { id: "12", title: "Behind the Scenes #2", quote: "", date: "", year: "2026", category: "BEHIND THE SCENES", tags: ["Lab Nights"], imageUrl: "bts2", width: 420, height: 600, aspectClass: "aspect-[7/10]" },
  { id: "13", title: "Behind the Scenes #3", quote: "", date: "", year: "2026", category: "BEHIND THE SCENES", tags: ["War Room"], imageUrl: "bts3", width: 680, height: 380, aspectClass: "aspect-[16/9]" },
  { id: "14", title: "Behind the Scenes #4", quote: "", date: "", year: "2026", category: "BEHIND THE SCENES", tags: ["Hardware Bench"], imageUrl: "bts4", width: 360, height: 580, aspectClass: "aspect-[9/15]" },
  { id: "15", title: "Behind the Scenes #5", quote: "", date: "", year: "2026", category: "BEHIND THE SCENES", tags: ["Hackathon Setup"], imageUrl: "bts5", width: 500, height: 500, aspectClass: "aspect-square" },
];