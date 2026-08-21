// src/data/projectsData.ts

export interface ProjectRepository {
  id: string;
  name: string;
  visibility: 'Public' | 'Private';
  description: string;
  iconType: 'shield' | 'network' | 'radar' | 'terminal';
  techStack: string[];
  contributors: number;
  githubUrl: string;
}

export const PROJECTS_DATA: ProjectRepository[] = [
  {
    id: 'whitephish',
    name: 'WhitePhish',
    visibility: 'Public',
    description: 'AI-powered phishing detection tool with URL analysis, NLP, and threat intelligence integration.',
    iconType: 'shield',
    techStack: ['Python', 'FastAPI', 'PyTorch'],
    contributors: 8,
    githubUrl: 'https://github.com/whitehats-vit/whitephish',
  },
  {
    id: 'packetsentinel',
    name: 'PacketSentinel',
    visibility: 'Public',
    description: 'Real-time packet analysis and alerting system for network intrusion detection.',
    iconType: 'network',
    techStack: ['Go', 'Docker', 'eBPF'],
    contributors: 6,
    githubUrl: 'https://github.com/whitehats-vit/packetsentinel',
  },
  {
    id: 'webrecon',
    name: 'WebRecon',
    visibility: 'Public',
    description: 'Automated reconnaissance framework for web applications and API vulnerability surfaces.',
    iconType: 'radar',
    techStack: ['JavaScript', 'Node.js', 'Puppeteer'],
    contributors: 5,
    githubUrl: 'https://github.com/whitehats-vit/webrecon',
  },
  {
    id: 'cryptotoolkit',
    name: 'CryptoToolkit',
    visibility: 'Public',
    description: 'Collection of cryptographic tools, primitives, and cipher implementations for learning and research.',
    iconType: 'terminal',
    techStack: ['C++', 'Rust', 'OpenSSL'],
    contributors: 4,
    githubUrl: 'https://github.com/whitehats-vit/cryptotoolkit',
  },
];  