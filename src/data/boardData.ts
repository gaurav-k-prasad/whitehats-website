export interface BoardMember {
  id: string;
  name: string;
  role: string;
  category: 'Core Leadership' | 'Vice Leadership' | 'Domain Heads';
  imageUrl: string;
}

export const BOARD_DATA: BoardMember[] = [
  // CORE LEADERSHIP (Top Tier)
  { id: 'kartik-raj', name: 'Kartik Raj', role: 'Chairperson', category: 'Core Leadership', imageUrl: 'karthik' },
  { id: 'divyansh-krishna', name: 'Divyansh Krishna', role: 'Secretary', category: 'Core Leadership', imageUrl: 'divyansh' },

  // VICE LEADERSHIP (Executive Council)
  { id: 'pakhi-mittal', name: 'Pakhi Mittal', role: 'Vice-Chairperson', category: 'Vice Leadership', imageUrl: 'pakhi' },
  { id: 'utkarsh-raj', name: 'Utkarsh Raj', role: 'Co-Secretary', category: 'Vice Leadership', imageUrl: 'utkarsh' },

  // DOMAIN HEADS (Specialist Leads)
  { id: 'gaurav-prasad', name: 'Gaurav Kapildeo Prasad', role: 'Technical Head', category: 'Domain Heads', imageUrl: 'gaurav' },
  { id: 'anwita-padhi', name: 'Anwita Padhi', role: 'R&D Head', category: 'Domain Heads', imageUrl: 'anwita' },
  { id: 'anup-chalmale', name: 'Anup Chalmale', role: 'Finance Head', category: 'Domain Heads', imageUrl: 'anup' },
  { id: 'akshaya-shyam', name: 'Akshaya Shyam', role: 'Management Head', category: 'Domain Heads', imageUrl: 'akshaya' },
  { id: 'taposri-saha', name: 'Taposri Saha', role: 'Design Head', category: 'Domain Heads', imageUrl: 'taposri' },
  { id: 'ayman-alam', name: 'Syed Ayman Alam', role: 'PR Head', category: 'Domain Heads', imageUrl: 'ayman' },
];