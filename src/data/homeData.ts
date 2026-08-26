export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface FloatingActionItem {
  label: string;
  iconType: "terminal" | "bug" | "lock" | "network" | "feed";
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
  iconType: "github" | "telegram" | "linkedin" | "instagram";
}

export interface TerminalCommand {
  command: string;
  output: string | string[];
}

export interface EventItem {
  title: string;
  date: string;
}

export interface FeatureCardData {
  id: string;
  badgeNumber: string;
  title: string;
  description?: string;
  iconType: "terminal" | "calendar" | "code" | "team";
  ctaText: string;
  ctaHref: string;
  events?: EventItem[];
  tools?: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: ">_ HOME", href: "/", isActive: true },
  { label: "/ABOUT", href: "/about" },
  { label: "/EVENTS", href: "/events" },
  { label: "/PROJECTS", href: "/projects" },
  { label: "/GALLERY", href: "/gallery" },
  { label: "/BOARD", href: "/board" },
  { label: "/CONTACT", href: "/contact" },
];

export const FLOATING_ACTIONS: FloatingActionItem[] = [
  { label: "Terminal", iconType: "terminal", href: "#" },
  { label: "Exploits", iconType: "bug", href: "#" },
  { label: "Security", iconType: "lock", href: "#" },
  { label: "Network", iconType: "network", href: "#" },
  { label: "Live Feed", iconType: "feed", href: "#" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { name: "GitHub", href: "https://github.com/orgs/TheWhitehatsclub-vit", iconType: "github" },
  { name: "Telegram", href: "https://t.me/TheWhitehatsClub", iconType: "telegram" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/thewhitehatsclub/", iconType: "linkedin" },
  { name: "Instagram", href: "https://www.instagram.com/whitehats.vit/", iconType: "instagram" },
];

export const HERO_DATA = {
  comment: "// WE HACK. SO THAT YOU DON'T HAVE TO.",
  headingPrefix: "< WE ARE",
  headingSuffix: "WHITEHATS />",
  description:
    "A community of ethical hackers and cybersecurity enthusiasts securing the digital world through knowledge, tools and collaboration.",
  primaryCta: { text: ">_ EXPLORE NOW", href: "/events" },
  secondaryCta: { text: "VIEW OUR WORK", href: "/projects" },
};

export const TERMINAL_DATA = {
  userPrompt: "root@whitehats:~#",
  commands: [
    {
      command: "> whoami",
      output: "WhiteHats - Ethical Hackers",
    },
    {
      command: "> mission",
      output: [
        "Secure systems.",
        "Educate minds.",
        "Build a safer digital future.",
      ],
    },
    {
      command: "> status",
      output:
        "We don't break the rules,\nwe break the vulnerabilities.",
    },
  ],
};

export const FEATURE_CARDS: FeatureCardData[] = [
  {
    id: "what-we-do",
    badgeNumber: "01",
    title: "WHAT WE DO",
    description:
      "From binary exploitation and kernel hardening to offensive web ops, we build resilient systems and audit real-world vulnerabilities.",
    iconType: "terminal",
    ctaText: "VIEW PROJECTS",
    ctaHref: "/projects",
  },
  {
    id: "upcoming-events",
    badgeNumber: "02",
    title: "UPCOMING EVENTS",
    iconType: "calendar",
    ctaText: "EXPLORE EVENTS",
    ctaHref: "/events",
    events: [
      { title: "> Huntscape", date: "Gravitas 2026" },
    ],
  },
  {
    id: "arsenal-toolkit",
    badgeNumber: "03",
    title: "ARSENAL & TOOLKIT",
    description:
      "Industry-grade frameworks and custom scripts engineered to analyze attack surfaces and exploit vectors.",
    iconType: "code",
    ctaText: "VIEW FULL ARSENAL",
    ctaHref: "https://roadmap.sh/cyber-security",
    tools: [
      "BURP SUITE",
      "GHIDRA",
      "PWNTOOLS",
      "WIRESHARK",
      "METASPLOIT",
      "NMAP",
    ],
  },
  {
    id: "join-the-core",
    badgeNumber: "04",
    title: "JOIN THE CORE",
    description:
      "Collaborate with dedicated security researchers, reverse engineers, and competitive CTF players pushing offensive security forward.",
    iconType: "team",
    ctaText: "APPLY FOR RECRUITMENT",
    ctaHref: "/contact",
  },
];

export const FOOTER_DATA = {
  copyright: "© 2026 WHITEHATS – All rights reserved.",
  motto: "/ STAY CURIOUS. STAY ETHICAL. STAY AHEAD. /",
  credit: "BUILT WITH 💙 BY WHITEHATS",
};
