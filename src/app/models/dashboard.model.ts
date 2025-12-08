export interface DashboardData {
  user: {
    name: string;
    level: string;
    creditScore: number;
    tier: string;
    nextTierScore: number;
  };
  activeCircle: {
    name: string;
    round: string;
    contributionAmount: number;
    potValue: number;
    nextPayoutDate: string; // ISO Date
    members: Array<{
      id: string;
      initials: string;
      status: 'paid' | 'pending' | 'received';
      isCurrentUser: boolean;
    }>;
  } | null;
  wallet: {
    balance: number;
    isConnected: boolean;
  };
  recommendations: Array<{
    title: string;
    reward: number;
    type: 'gig' | 'sale';
  }>;
}
