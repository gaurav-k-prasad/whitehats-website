export interface BoardMember {
  id: string;
  name: string;
  role: string;
  category: 'Core Leadership' | 'Domain Heads';
  imageUrl: string;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  category: 'Core Leadership' | 'Domain Heads';
  imageUrl: string;
}

export const BOARD_DATA: BoardMember[] = [
  // CORE LEADERSHIP (Top 2 - Big Images)
  { id: 'OP-01', name: 'Kartik Raj', role: 'Chairperson', category: 'Core Leadership', imageUrl: 'karthik' },
  { id: 'OP-02', name: 'Divyansh Krishna', role: 'Secretary', category: 'Core Leadership', imageUrl: 'divyansh' },

  // DOMAIN HEADS (Next 8 - Rotatory Portrait Cards)
  { id: 'DH-01', name: 'Gaurav Kapildeo Prasad', role: 'Technical Head', category: 'Domain Heads', imageUrl: 'gaurav' },
  { id: 'DH-06', name: 'Anwita Padhi', role: 'R&D Head', category: 'Domain Heads', imageUrl: 'anwita' },
  { id: 'DH-04', name: 'Pakhi Mittal', role: 'Vice-Chairperson', category: 'Domain Heads', imageUrl: 'pakhi' },
  { id: 'DH-07', name: 'Utkarsh Raj', role: 'Co-Secretary', category: 'Domain Heads', imageUrl: 'utkarsh' },
  { id: 'DH-02', name: 'Anup Chalmale', role: 'Finance Head', category: 'Domain Heads', imageUrl: 'anup' },
  { id: 'DH-03', name: 'Akshaya Shyam', role: 'Management Head', category: 'Domain Heads', imageUrl: 'akshaya' },
  { id: 'DH-05', name: 'Taposri Saha', role: 'Design Head', category: 'Domain Heads', imageUrl: 'taposri' },
  { id: 'DH-08', name: 'Syed Ayman Alam', role: 'PR Head', category: 'Domain Heads', imageUrl: 'ayman' },
];