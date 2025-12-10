export enum CircleFrequency {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly',
  MONTHLY = 'monthly',
}

export interface CreateCircleDto {
  name: string;
  description?: string;
  contributionAmount: number;
  frequency: CircleFrequency;
  maxMembers: number;
  isPublic?: boolean;
}

export interface Circle {
  id: string;
  name: string;
  status: string;
  memberCount: number;
  maxMembers: number;
}

export interface CircleDetail {
  id: string;
  name: string;
  description: string;
  contributionAmount: number;
  frequency: string;
  maxMembers: number;
  isPublic: boolean;
  status: string;
  inviteCode: string;
  creatorId: string;
  createdAt: string;
}

export interface CircleMember {
  id: string;
  name: string;
  avatarUrl: string;
  paymentStatus?: 'paid' | 'unpaid' | 'pending';
  isCreator?: boolean;
  position?: number; // Position in the circle (1, 2, 3, etc.)
}

export interface PayoutEntry {
  turn: number;
  payoutDate: string;
  memberId: string;
  memberName: string;
  status: string;
}

export interface JoinCircleDto {
  inviteCode: string;
}
