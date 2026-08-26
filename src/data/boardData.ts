export interface BoardMember {
  id: string;
  name: string;
  role: string;
  category: 'Core Leadership' | 'Vice Leadership' | 'Domain Heads';
  imageUrl: string;
}

export const BOARD_DATA: BoardMember[] = [
  // CORE LEADERSHIP (Top Tier)
  { id: 'OP-01', name: 'Kartik Raj', role: 'Chairperson', category: 'Core Leadership', imageUrl: 'karthik' },
  { id: 'OP-02', name: 'Divyansh Krishna', role: 'Secretary', category: 'Core Leadership', imageUrl: 'divyansh' },

  // VICE LEADERSHIP (Executive Council)
  { id: 'VL-01', name: 'Pakhi Mittal', role: 'Vice-Chairperson', category: 'Vice Leadership', imageUrl: 'pakhi' },
  { id: 'VL-02', name: 'Utkarsh Raj', role: 'Co-Secretary', category: 'Vice Leadership', imageUrl: 'utkarsh' },

  // DOMAIN HEADS (Specialist Leads - Rotatory Portrait Cards)
  { id: 'DH-01', name: 'Gaurav Kapildeo Prasad', role: 'Technical Head', category: 'Domain Heads', imageUrl: 'gaurav' },
  { id: 'DH-02', name: 'Anwita Padhi', role: 'R&D Head', category: 'Domain Heads', imageUrl: 'anwita' },
  { id: 'DH-03', name: 'Anup Chalmale', role: 'Finance Head', category: 'Domain Heads', imageUrl: 'anup' },
  { id: 'DH-04', name: 'Akshaya Shyam', role: 'Management Head', category: 'Domain Heads', imageUrl: 'akshaya' },
  { id: 'DH-05', name: 'Taposri Saha', role: 'Design Head', category: 'Domain Heads', imageUrl: 'taposri' },
  { id: 'DH-06', name: 'Syed Ayman Alam', role: 'PR Head', category: 'Domain Heads', imageUrl: 'ayman' },
];