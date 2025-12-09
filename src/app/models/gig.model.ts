export enum GigCategory {
  ACADEMIC = 'Academic',
  CREATIVE = 'Creative',
  TECH = 'Tech',
  PHYSICAL = 'Physical',
  EVENTS = 'Events',
}

export enum GigType {
  GIG = 'gig', // User posting a gig they want done
  SKILL = 'skill', // User posting their skills/services
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  category: GigCategory;
  providerName: string;
  rating: number;
  creditScore: number;
  isMukandoMember: boolean;
  type: GigType;
  skills?: string[]; // For skill posts
}

export interface BookingRequest {
  gigId: string;
  depositAmount: number;
  transactionFee: number;
  totalAmount: number;
}

export interface BookingStatus {
  gigId: string;
  status: 'pending' | 'in_progress' | 'completed';
  depositPaid: boolean;
  remainingPaid: boolean;
}

