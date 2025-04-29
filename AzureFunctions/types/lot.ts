export interface Picture {
  id: string;
  url: string;
  tag: string;  // Engine, Outside, Serial #, etc.
  timestamp: string;
}

export interface Lot {
  id: string;
  title: string;
  lotNumber: string;
  tagNumber: string;
  pictures: Picture[];
  createdAt: string;
  updatedAt: string;
  // Add any other fields you need
  status: 'draft' | 'pending' | 'approved' | 'archived';
  description?: string;
  category?: string;
  location?: string;
}
