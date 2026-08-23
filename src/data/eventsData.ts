export interface ClubEvent {
    id: string;
    title: string;
    type: 'CTF' | 'Workshop' | 'Seminar' | 'Bootcamp';
    date: string;
    time: string;
    location: string;
    description: string;
    tags: string[];
    // Optional Cloudinary public ID / URL for the timeline card cover image.
    // TODO: fill in once event photos are uploaded to Cloudinary.
    imageUrl?: string;
}

export const EVENTS_DATA: ClubEvent[] = [
    {
        id: 'e-01',
        title: 'Build & Beyond',
        type: 'Workshop',
        date: '05 Apr 2026',
        time: '01:00 PM - 07:00 PM',
        location: 'VIT Vellore',
        description: 'An intensive hands-on session focusing on building secure architectures and deploying defense-in-depth strategies.',
        tags: ['Architecture', 'Defense', 'Infrastructure'],
    },
    {
        id: 'e-02',
        title: "QW'26: FlagWars",
        type: 'CTF',
        date: '05 Mar 2026',
        time: '02:00 PM - 06:00 PM',
        location: 'Online',
        description: 'Our flagship Capture The Flag competition. Teams battle through intense web, crypto, and pwn challenges.',
        tags: ['CTF', 'Web', 'Crypto', 'Pwn'],
    },
    {
        id: 'e-03',
        title: 'SDG - CyberShield for SDGs',
        type: 'Seminar',
        date: '14 Dec 2025',
        time: '04:00 PM - 05:00 PM',
        location: 'VIT Vellore',
        description: 'Exploring the intersection of cybersecurity and sustainable development goals to protect digital infrastructure.',
        tags: ['Policy', 'Sustainability', 'Awareness'],
    },
    {
        id: 'e-04',
        title: 'Crack the Login',
        type: 'Workshop',
        date: '10 Dec 2025',
        time: '11:00 AM - 12:00 PM',
        location: 'VIT Vellore',
        description: 'A fast-paced workshop dissecting authentication mechanisms, password hashing, and brute-force vulnerabilities.',
        tags: ['Auth', 'Web Security', 'Pentesting'],
    },
    {
        id: 'e-05',
        title: 'Hack the Script',
        type: 'Workshop',
        date: '10 Dec 2025',
        time: '12:00 PM - 01:00 PM',
        location: 'VIT Vellore',
        description: 'Deep dive into cross-site scripting (XSS), injection flaws, and securing client-side execution contexts.',
        tags: ['XSS', 'Injection', 'AppSec'],
    },
    {
        id: 'e-06',
        title: 'NCSAM - The WiFi Hacker Kit',
        type: 'Bootcamp',
        date: '28 Oct 2025',
        time: '11:00 AM - 12:00 PM',
        location: 'VIT Vellore',
        description: 'National Cyber Security Awareness Month special: analyzing wireless protocols, WPA2 handshakes, and network security.',
        tags: ['Wireless', 'Networks', 'Packet Analysis'],
    },
    {
        id: 'e-07',
        title: 'Boot into Kali',
        type: 'Bootcamp',
        date: '15 Oct 2025',
        time: '11:00 AM - 01:00 PM',
        location: 'VIT Vellore',
        description: 'The ultimate beginners guide to setting up, navigating, and weaponizing Kali Linux for penetration testing.',
        tags: ['Linux', 'OS', 'Fundamentals'],
    }
];

export const IMPACT_STATS = [
    { label: 'Events Conducted', value: '10+' },
    { label: 'Active Sessions', value: '15+' },
    { label: 'Knowledge Shared', value: '∞' },
];