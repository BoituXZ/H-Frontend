export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  salesCount?: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string; // ISO Date
  status: 'pending' | 'completed';
  total: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export interface StorefrontAnalytics {
  revenue: number;
  totalOrders: number;
  avgSale: number;
  mukandoContributionDue?: number;
  salesOverTime: Array<{
    label: string;
    amount: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export interface Storefront {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  ownerId: string;
  visitCount?: number;
  merchantId?: string;
  products: Product[];
  orders: Order[];
}

export interface StorefrontData {
  details: {
    name: string;
    slug: string;
    description: string;
    logoUrl: string;
    visitCount: number;
  };
  stats: {
    revenue: number;
    ordersCount: number;
    avgSale: number;
    mukandoContributionDue: number;
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    isAvailable: boolean;
    salesCount: number;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    date: string;
    total: number;
    status: 'pending' | 'completed';
    items: string[];
  }>;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: 'Academic' | 'Creative' | 'Tech' | 'Physical';
  rate: number;
  rateType: 'hourly' | 'fixed';
  provider: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    trustScore: number;
    isVerified: boolean;
    memberSince?: string;
    jobsCompleted?: number;
  };
  location: string;
  availability: string;
  reviewCount?: number;
  reviews?: Array<{
    name: string;
    rating: number;
    comment: string;
  }>;
}

export interface Booking {
  id: string;
  gigTitle: string;
  otherPartyName: string; // provider or customer name
  date: string; // ISO Date
  duration: number; // hours
  totalCost: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  type: 'customer' | 'provider'; // perspective: customer booking or provider booking
}

export interface LearningContent {
  id: string;
  title: string;
  type: 'article' | 'video';
  duration: string;
  points: number;
  tier: 'Beginner' | 'Growing' | 'Established' | 'Trusted';
  isCompleted: boolean;
  isLocked: boolean;
  requiredScore?: number;
  category: string;
  content?: string; // Optional content field for article/video descriptions
}

export interface Badge {
  id: string;
  name: string;
  icon: string; // emoji or icon identifier
  description: string;
  isUnlocked: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  points: number;
  rank: number;
}

export interface BudgetProfile {
  totalIncome: number;
  rent: number;
  groceries: number;
  transport: number;
  utilities: number;
  entertainment: number;
  savingsGoal: number;
}

export interface BudgetAnalysis {
  totalExpenses: number;
  remainingBudget: number;
  savingsRate: number; // percentage
  healthScore: number; // 0-100
  recommendations: string[]; // AI tips
  breakdown: {
    needs: number;
    wants: number;
    savings: number;
  };
}

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  bio?: string;
  creditScore: number;
  tier: string;
  profileImage?: string;
}

// Wallet & Transactions
export interface Transaction {
  id: string;
  title: string;
  subtitle?: string;
  amount: number;
  date: Date;
  type: 'credit' | 'debit';
  category: 'contribution' | 'storefront' | 'gig' | 'loan' | 'utilities' | 'food' | 'transport';
}

export interface WalletData {
  balance: number;
  lastUpdated: string;
  transactions: Transaction[];
}

// Credit Score
export interface CreditScore {
  score: number;
  tier: string;
  nextTier: string;
  pointsToNext: number;
  breakdown: {
    paymentConsistency: { current: number; max: number };
    timeActive: { current: number; max: number };
    circleActivity?: { current: number; max: number };
    marketActivity?: { current: number; max: number };
  };
}

export interface CreditHistoryItem {
  date: string;
  event: string;
  pointsChange: number;
  description: string;
}

// Loans
export interface LoanProduct {
  id: string;
  name: string;
  range: string;
  interest: string;
  duration: string;
  isEligible: boolean;
  lockReason?: string;
}

export interface Loan {
  id: string;
  type: string;
  amount: number;
  remainingAmount: number;
  progress: number; // percentage
  status: 'active' | 'completed' | 'defaulted';
  nextPaymentDate?: string;
  completedDate?: string;
  creditPoints?: number;
}

// Services
export interface ServiceProduct {
  id: string;
  provider: 'SmartFund' | 'EcoSure' | 'ZESA' | 'Dura';
  name: string;
  description: string;
  price: number | 'Variable';
  category: 'Connect' | 'Utilities' | 'Security';
  icon: string; // Heroicon name
}