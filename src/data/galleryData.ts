export interface MissionLog {
    id: string;
    title: string;
    quote: string;
    date: string;
    category: 'ALL' | 'WORKSHOPS' | 'CTF' | 'HACKATHONS' | 'SEMINARS' | 'BEHIND THE SCENES';
    gridSpan: 'col-span-1 row-span-1' | 'col-span-2 row-span-1' | 'col-span-2 row-span-2';
}

export const ARCHIVE_DATA: MissionLog[] = [
    {
        id: '029',
        title: 'Yantra 2026: Cybersecurity Track Winner',
        quote: '"Track prize secured. Mission accomplished."',
        date: 'FEB 2026',
        category: 'HACKATHONS',
        gridSpan: 'col-span-2 row-span-2', // The Hero Block
    },
    {
        id: '028',
        title: 'SUMMER CTF 2026',
        quote: '"One flag. One team. Countless lessons."',
        date: '18 JUL 2026',
        category: 'CTF',
        gridSpan: 'col-span-2 row-span-1', // Wide Block
    },
    {
        id: '027',
        title: 'CYBER TALKS',
        quote: '"Ideas that secure tomorrow."',
        date: '12 JUN 2026',
        category: 'SEMINARS',
        gridSpan: 'col-span-1 row-span-1', // Standard Block
    },
    {
        id: '026',
        title: 'CAMPUS CYBER HUNT',
        quote: '"Clues. Codes. Conquered."',
        date: '28 MAY 2026',
        category: 'HACKATHONS',
        gridSpan: 'col-span-1 row-span-1',
    },
];

export const ARCHIVE_STATS = [
    { label: 'MEMORIES STORED', value: '124', icon: 'Database' },
    { label: 'EVENTS ARCHIVED', value: '28', icon: 'Calendar' },
    { label: 'HACKERS IMPACTED', value: '1100+', icon: 'Users' },
    { label: 'INTEGRITY', value: 'SHA256 VERIFIED', icon: 'ShieldCheck' },
];