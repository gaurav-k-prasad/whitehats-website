export interface BoardMember {
  id: string;
  name: string;
  role: string;
  category: 'Core Leadership' | 'Domain Heads';
}

export const BOARD_DATA: BoardMember[] = [
  // CORE LEADERSHIP (Top 2 - Big Images)
  { id: 'OP-01', name: 'Placeholder Name', role: 'Chairperson', category: 'Core Leadership' },
  { id: 'OP-02', name: 'Placeholder Name', role: 'Secretary', category: 'Core Leadership' },
  
  // DOMAIN HEADS (Next 8 - Rotatory Portrait Cards)
  { id: 'DH-01', name: 'Gaurav Kapildeo Prasad', role: 'Technical Head', category: 'Domain Heads' },
  { id: 'DH-02', name: 'Placeholder Name', role: 'Events Director', category: 'Domain Heads' },
  { id: 'DH-03', name: 'Placeholder Name', role: 'Infrastructure Lead', category: 'Domain Heads' },
  { id: 'DH-04', name: 'Placeholder Name', role: 'Research Lead', category: 'Domain Heads' },
  { id: 'DH-05', name: 'Placeholder Name', role: 'Logistics Head', category: 'Domain Heads' },
  { id: 'DH-06', name: 'Placeholder Name', role: 'Outreach Coordinator', category: 'Domain Heads' },
  { id: 'DH-07', name: 'Placeholder Name', role: 'Creative Lead', category: 'Domain Heads' },
  { id: 'DH-08', name: 'Placeholder Name', role: 'Community Manager', category: 'Domain Heads' },
];