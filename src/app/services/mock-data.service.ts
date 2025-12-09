import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, delay, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Storefront,
  Product,
  Order,
  StorefrontAnalytics,
  Gig,
  Booking,
  LearningContent,
  Badge,
  LeaderboardEntry,
  BudgetProfile,
  BudgetAnalysis,
} from '../models/hive-data.models';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private storefrontSubject = new BehaviorSubject<Storefront | null>(null);

  constructor() {
    // Initialize with mock data
    this.storefrontSubject.next(this.getMockStorefront());
  }

  get storefront$(): Observable<Storefront | null> {
    return this.storefrontSubject.asObservable();
  }

  getStorefront(): Observable<Storefront> {
    return of(this.getMockStorefront()).pipe(delay(500));
  }

  getStorefrontAnalytics(): Observable<StorefrontAnalytics> {
    return of(this.getMockAnalytics()).pipe(delay(500));
  }

  getStorefrontBySlug(slug: string): Observable<Storefront | null> {
    if (environment.useMockData) {
      const storefront = this.getMockStorefront();
      // In a real app, this would filter by slug
      return of(storefront.slug === slug ? storefront : null).pipe(delay(500));
    }
    return this.http.get<Storefront>(`${this.apiUrl}/storefronts/${slug}`);
  }

  private getMockStorefront(): Storefront {
    return {
      id: '1',
      name: "Boitu's Designs",
      slug: 'boitu-designs',
      description: 'Professional graphic design services...',
      logoUrl: '',
      bannerUrl: '',
      ownerId: 'user-1',
      products: [
        {
          id: '1',
          name: 'Logo Design',
          price: 15.0,
          description: 'Professional logo design service',
          imageUrl: '',
          isAvailable: true,
        },
        {
          id: '2',
          name: 'Social Media Graphics',
          price: 5.0,
          description: 'Custom social media graphics',
          imageUrl: '',
          isAvailable: true,
        },
        {
          id: '3',
          name: 'Website Banner',
          price: 25.0,
          description: 'Custom website banner design',
          imageUrl: '',
          isAvailable: false,
        },
      ],
      orders: [
        {
          id: 'ORD-1234',
          customerName: 'John Doe',
          customerPhone: '+1234567890',
          date: '2024-12-05T10:00:00Z',
          status: 'completed',
          total: 15.0,
          items: [
            {
              productName: 'Logo Design',
              quantity: 1,
              price: 15.0,
            },
          ],
        },
        {
          id: 'ORD-1233',
          customerName: 'Jane Smith',
          customerPhone: '+1234567891',
          date: '2024-12-04T14:30:00Z',
          status: 'pending',
          total: 15.0,
          items: [
            {
              productName: 'Social Media Graphics',
              quantity: 3,
              price: 5.0,
            },
          ],
        },
      ],
    };
  }

  private getMockAnalytics(): StorefrontAnalytics {
    return {
      revenue: 340.0,
      totalOrders: 23,
      avgSale: 14.78,
      mukandoContributionDue: 20.0,
      salesOverTime: [
        { label: 'Nov', amount: 120 },
        { label: 'Dec', amount: 220 },
      ],
      topProducts: [
        {
          name: 'Logo Design',
          sales: 12,
          revenue: 180.0,
        },
        {
          name: 'Social Media Graphics',
          sales: 8,
          revenue: 120.0,
        },
        {
          name: 'Website Banner',
          sales: 3,
          revenue: 40.0,
        },
      ],
    };
  }

  // Learning methods
  getLearningContent(): Observable<LearningContent[]> {
    const mockContent: LearningContent[] = [
      // Beginner Tier
      {
        id: '1',
        title: 'Introduction to Budgeting',
        type: 'article',
        duration: '5 min',
        points: 10,
        tier: 'Beginner',
        isCompleted: false,
        isLocked: false,
        category: 'Finance',
      },
      {
        id: '2',
        title: 'Understanding Credit Scores',
        type: 'video',
        duration: '10 min',
        points: 15,
        tier: 'Beginner',
        isCompleted: true,
        isLocked: false,
        category: 'Finance',
      },
      {
        id: '3',
        title: 'Saving Money Basics',
        type: 'article',
        duration: '7 min',
        points: 10,
        tier: 'Beginner',
        isCompleted: true,
        isLocked: false,
        category: 'Savings',
      },
      // Growing Tier
      {
        id: '4',
        title: 'Building an Emergency Fund',
        type: 'video',
        duration: '12 min',
        points: 20,
        tier: 'Growing',
        isCompleted: false,
        isLocked: false,
        category: 'Savings',
      },
      {
        id: '5',
        title: 'Credit Card Management',
        type: 'article',
        duration: '8 min',
        points: 15,
        tier: 'Growing',
        isCompleted: false,
        isLocked: false,
        category: 'Credit',
      },
      // Established Tier (Recommended for credit score 650)
      {
        id: '6',
        title: 'Loan Repayment Strategies',
        type: 'article',
        duration: '5 min',
        points: 25,
        tier: 'Established',
        isCompleted: false,
        isLocked: false,
        category: 'Loans',
      },
      {
        id: '7',
        title: 'Investment Fundamentals',
        type: 'video',
        duration: '8 min',
        points: 30,
        tier: 'Established',
        isCompleted: false,
        isLocked: false,
        category: 'Investing',
      },
      {
        id: '8',
        title: 'Understanding Mortgage Options',
        type: 'video',
        duration: '15 min',
        points: 35,
        tier: 'Established',
        isCompleted: false,
        isLocked: false,
        category: 'Loans',
      },
      // Trusted Tier (Locked - requires higher score)
      {
        id: '9',
        title: 'Advanced Investment Strategies',
        type: 'video',
        duration: '20 min',
        points: 50,
        tier: 'Trusted',
        isCompleted: false,
        isLocked: true,
        requiredScore: 700,
        category: 'Investing',
      },
      {
        id: '10',
        title: 'Tax Optimization Techniques',
        type: 'article',
        duration: '12 min',
        points: 40,
        tier: 'Trusted',
        isCompleted: false,
        isLocked: true,
        requiredScore: 750,
        category: 'Finance',
      },
      {
        id: '11',
        title: 'Wealth Building Blueprint',
        type: 'video',
        duration: '25 min',
        points: 60,
        tier: 'Trusted',
        isCompleted: false,
        isLocked: true,
        requiredScore: 750,
        category: 'Investing',
      },
      {
        id: '12',
        title: 'Real Estate Investment',
        type: 'article',
        duration: '18 min',
        points: 45,
        tier: 'Trusted',
        isCompleted: false,
        isLocked: true,
        requiredScore: 700,
        category: 'Investing',
      },
    ];
    return of(mockContent).pipe(delay(500));
  }

  getLearningContentById(id: string): Observable<LearningContent | null> {
    return this.getLearningContent().pipe(
      map((content) => content.find((c) => c.id === id) || null),
      delay(300),
    );
  }

  markContentAsComplete(id: string): Observable<boolean> {
    return of(true).pipe(delay(300));
  }

  getBadges(): Observable<Badge[]> {
    const mockBadges: Badge[] = [
      {
        id: '1',
        name: 'First Steps',
        icon: '🎯',
        description: 'Complete your first lesson',
        isUnlocked: true,
      },
      {
        id: '2',
        name: 'Budget Master',
        icon: '💰',
        description: 'Complete all budget lessons',
        isUnlocked: false,
      },
    ];
    return of(mockBadges).pipe(delay(500));
  }

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    const mockLeaderboard: LeaderboardEntry[] = [
      { userId: 'user-1', name: 'John Doe', points: 150, rank: 1 },
      { userId: 'current-user', name: 'You', points: 60, rank: 5 },
      { userId: 'user-2', name: 'Jane Smith', points: 120, rank: 2 },
    ];
    return of(mockLeaderboard).pipe(delay(500));
  }

  // Marketplace methods
  getGigs(): Observable<Gig[]> {
    const mockGigs: Gig[] = [
      {
        id: '1',
        title: 'Math Tutoring',
        description: 'Expert math tutoring for high school students. Specializing in algebra, calculus, and test prep.',
        category: 'Academic',
        rate: 25,
        rateType: 'hourly',
        provider: {
          id: 'provider-1',
          name: 'Sarah Johnson',
          avatar: 'SJ',
          rating: 4.8,
          trustScore: 850,
          isVerified: true,
          memberSince: '2023-01',
          jobsCompleted: 47,
        },
        location: 'Remote',
        availability: 'Weekdays 3-6 PM',
        reviewCount: 12,
        reviews: [
          { name: 'John D.', rating: 5, comment: 'Excellent tutor, very patient and clear explanations.' },
          { name: 'Sarah M.', rating: 5, comment: 'Helped my child improve significantly in math.' },
          { name: 'Mike T.', rating: 4, comment: 'Good service, would recommend.' },
        ],
      },
      {
        id: '2',
        title: 'Logo Design',
        description: 'Professional logo design services for businesses and startups. Includes 3 revisions.',
        category: 'Creative',
        rate: 50,
        rateType: 'fixed',
        provider: {
          id: 'provider-2',
          name: 'Mike Chen',
          avatar: 'MC',
          rating: 5.0,
          trustScore: 920,
          isVerified: true,
          memberSince: '2022-08',
          jobsCompleted: 83,
        },
        location: 'Remote',
        availability: 'Flexible',
        reviewCount: 8,
        reviews: [
          { name: 'Lisa K.', rating: 5, comment: 'Amazing work! Captured our brand perfectly.' },
          { name: 'Tom R.', rating: 5, comment: 'Fast turnaround and excellent communication.' },
        ],
      },
      {
        id: '3',
        title: 'Web Development',
        description: 'Full-stack web development services. React, Angular, Node.js expertise.',
        category: 'Tech',
        rate: 45,
        rateType: 'hourly',
        provider: {
          id: 'provider-3',
          name: 'Alex Rivera',
          avatar: 'AR',
          rating: 4.9,
          trustScore: 880,
          isVerified: true,
          memberSince: '2022-11',
          jobsCompleted: 62,
        },
        location: 'Remote',
        availability: 'Monday-Friday, 9 AM - 5 PM',
        reviewCount: 15,
        reviews: [
          { name: 'David P.', rating: 5, comment: 'Built our entire platform. Highly skilled!' },
          { name: 'Emily W.', rating: 5, comment: 'Professional and delivers on time.' },
        ],
      },
      {
        id: '4',
        title: 'Home Cleaning',
        description: 'Professional home cleaning services. Deep cleaning and regular maintenance.',
        category: 'Physical',
        rate: 30,
        rateType: 'hourly',
        provider: {
          id: 'provider-4',
          name: 'Grace Moyo',
          avatar: 'GM',
          rating: 4.7,
          trustScore: 820,
          isVerified: true,
          memberSince: '2023-03',
          jobsCompleted: 38,
        },
        location: 'On-site',
        availability: 'Weekends & Evenings',
        reviewCount: 9,
        reviews: [
          { name: 'Rachel B.', rating: 5, comment: 'Very thorough and reliable.' },
          { name: 'James L.', rating: 4, comment: 'Good service, always on time.' },
        ],
      },
      {
        id: '5',
        title: 'Photography Session',
        description: 'Professional photography for events, portraits, and product shoots.',
        category: 'Creative',
        rate: 75,
        rateType: 'fixed',
        provider: {
          id: 'provider-5',
          name: 'Tyler Brooks',
          avatar: 'TB',
          rating: 4.9,
          trustScore: 900,
          isVerified: true,
          memberSince: '2022-05',
          jobsCompleted: 71,
        },
        location: 'On-site',
        availability: 'Flexible',
        reviewCount: 18,
        reviews: [
          { name: 'Sophia M.', rating: 5, comment: 'Captured our wedding beautifully!' },
          { name: 'Mark H.', rating: 5, comment: 'Professional and creative.' },
        ],
      },
      {
        id: '6',
        title: 'Essay Writing Help',
        description: 'Academic writing assistance for college and university students.',
        category: 'Academic',
        rate: 20,
        rateType: 'hourly',
        provider: {
          id: 'provider-6',
          name: 'Dr. Amanda Lee',
          avatar: 'AL',
          rating: 5.0,
          trustScore: 950,
          isVerified: true,
          memberSince: '2021-09',
          jobsCompleted: 124,
        },
        location: 'Remote',
        availability: 'Daily, 8 AM - 10 PM',
        reviewCount: 28,
        reviews: [
          { name: 'Chris P.', rating: 5, comment: 'Helped me get an A on my thesis!' },
          { name: 'Nina S.', rating: 5, comment: 'Excellent guidance and feedback.' },
        ],
      },
      {
        id: '7',
        title: 'Furniture Assembly',
        description: 'Professional furniture assembly service. All types of furniture.',
        category: 'Physical',
        rate: 35,
        rateType: 'hourly',
        provider: {
          id: 'provider-7',
          name: 'Jason Martinez',
          avatar: 'JM',
          rating: 4.6,
          trustScore: 790,
          isVerified: false,
          memberSince: '2023-06',
          jobsCompleted: 21,
        },
        location: 'On-site',
        availability: 'Weekends',
        reviewCount: 5,
        reviews: [
          { name: 'Beth K.', rating: 5, comment: 'Quick and efficient.' },
          { name: 'Paul D.', rating: 4, comment: 'Did a good job.' },
        ],
      },
      {
        id: '8',
        title: 'Mobile App Development',
        description: 'iOS and Android app development. Native and cross-platform solutions.',
        category: 'Tech',
        rate: 55,
        rateType: 'hourly',
        provider: {
          id: 'provider-8',
          name: 'Priya Patel',
          avatar: 'PP',
          rating: 4.8,
          trustScore: 870,
          isVerified: true,
          memberSince: '2022-03',
          jobsCompleted: 56,
        },
        location: 'Remote',
        availability: 'Monday-Saturday',
        reviewCount: 12,
        reviews: [
          { name: 'Kevin L.', rating: 5, comment: 'Built our app from scratch. Great work!' },
          { name: 'Olivia C.', rating: 5, comment: 'Very responsive and skilled.' },
        ],
      },
    ];
    return of(mockGigs).pipe(delay(500));
  }

  getGigById(id: string): Observable<Gig | null> {
    return this.getGigs().pipe(
      map((gigs) => gigs.find((g) => g.id === id) || null),
      delay(300),
    );
  }

  getMyBookings(type: 'customer' | 'provider'): Observable<Booking[]> {
    const mockBookings: Booking[] = [
      {
        id: 'booking-1',
        gigTitle: 'Math Tutoring',
        otherPartyName: type === 'customer' ? 'Sarah Johnson' : 'John Doe',
        date: '2024-12-15T14:00:00Z',
        duration: 2,
        totalCost: 50,
        status: 'confirmed',
        type,
      },
    ];
    return of(mockBookings).pipe(delay(500));
  }

  // Budget methods
  analyzeBudget(profile: BudgetProfile): Observable<BudgetAnalysis> {
    const totalExpenses =
      profile.rent +
      profile.groceries +
      profile.transport +
      profile.utilities +
      profile.entertainment;
    const remainingBudget = profile.totalIncome - totalExpenses;
    const savingsRate = (remainingBudget / profile.totalIncome) * 100;
    const healthScore = Math.min(100, Math.max(0, savingsRate * 1.2));

    const analysis: BudgetAnalysis = {
      totalExpenses,
      remainingBudget,
      savingsRate: Math.round(savingsRate * 100) / 100,
      healthScore: Math.round(healthScore),
      recommendations: [
        'Consider reducing entertainment expenses',
        'Try to save at least 20% of your income',
      ],
      breakdown: {
        needs: profile.rent + profile.groceries + profile.utilities,
        wants: profile.entertainment + profile.transport,
        savings: Math.max(0, remainingBudget),
      },
    };

    return of(analysis).pipe(delay(800));
  }
}
