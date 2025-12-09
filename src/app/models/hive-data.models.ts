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