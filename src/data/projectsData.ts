// src/data/projectsData.ts

export type ProjectStatus =
  | 'ACTIVE_DEVELOPMENT'
  | 'PRODUCTION_READY'
  | 'BETA_TESTING'
  | 'COMPLETED'
  | 'MAINTAINED';

export interface ProjectRepository {
  id: string;
  name: string;
  visibility: 'Public' | 'Private';
  status: ProjectStatus;
  description: string;
  iconType: 'shield' | 'network' | 'radar' | 'terminal';
  techStack: string[];
  contributors: number;
  githubUrl: string;
}

export const PROJECTS_DATA: ProjectRepository[] = [
  {
    id: 'network-behaviour-anomaly-detection',
    name: 'Network_Behaviour_Anomaly_Detection',
    visibility: 'Public',
    status: 'ACTIVE_DEVELOPMENT',
    description: 'Machine learning powered network traffic analysis and anomaly detection framework to identify suspicious behaviors and intrusion attempts.',
    iconType: 'network',
    techStack: ['Python', 'Machine Learning', 'Network Security', 'Scapy'],
    contributors: 4,
    githubUrl: 'https://github.com/TheWhitehatsclub-vit/Network_Behaviour_Anomaly_Detection',
  },
  {
    id: 'secure-file-sharing-system',
    name: 'Secure_File_Sharing_System',
    visibility: 'Public',
    status: 'ACTIVE_DEVELOPMENT',
    description: 'End-to-end encrypted file sharing and storage platform with zero-knowledge access control and secure key exchange mechanisms.',
    iconType: 'shield',
    techStack: ['Cryptography', 'Python', 'Web Security', 'FastAPI'],
    contributors: 3,
    githubUrl: 'https://github.com/TheWhitehatsclub-vit/Secure_File_Sharing_System',
  },
];