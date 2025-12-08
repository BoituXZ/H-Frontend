export interface CircleDetail {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'paused';
  myPosition: number;
  contributionAmount: number;
  potValue: number;
  cycle: {
    current: number;
    total: number;
    nextDueDate: string;
  };
  members: CircleMember[];
  transactions: CircleTransaction[];
  votes: CircleVote[];
  payoutTimeline: PayoutEntry[];
  createdDate: string;
  description?: string;
}

export interface CircleMember {
  id: string;
  name: string;
  initials: string;
  role: 'admin' | 'member';
  status: 'paid' | 'pending' | 'received';
  position: number;
  joinedDate: string;
  isCurrentUser: boolean;
}

export interface CircleTransaction {
  id: string;
  date: string;
  type: 'contribution' | 'payout';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  memberId: string;
  memberName: string;
  description?: string;
}

export interface CircleVote {
  id: string;
  title: string;
  description: string;
  type: 'exit_request' | 'rule_change' | 'emergency_payout';
  deadline: string;
  yesVotes: number;
  noVotes: number;
  totalMembers: number;
  hasVoted: boolean;
  userVote?: 'yes' | 'no';
  status: 'active' | 'passed' | 'failed' | 'expired';
  createdDate: string;
  createdBy: string;
}

export interface PayoutEntry {
  position: number;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  status: 'completed' | 'upcoming' | 'pending';
}

export interface CreateCircleRequest {
  name: string;
  description?: string;
  contributionAmount: number;
  frequency: 'weekly' | 'monthly';
  maxMembers: number;
  startDate: string;
  positionMethod: 'lottery' | 'vote';
}

export interface CreateCircleResponse {
  success: boolean;
  circle?: CircleDetail;
  inviteCode?: string;
  message?: string;
}
