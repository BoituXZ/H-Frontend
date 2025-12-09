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
      ],
    };
  }

  // Learning methods
  getLearningContent(): Observable<LearningContent[]> {
    const mockContent: LearningContent[] = [
      {
        id: '1',
        title: 'Loan Repayment Strategies',
        type: 'article',
        duration: '5 min',
        points: 10,
        tier: 'Beginner',
        isCompleted: false,
        category: 'Finance',
        content: 'When you take a loan through HiveFund, ensuring you repay on time is critical to maintaining your credit score and accessing better rates in the future. Here are three key strategies to master repayment.\n\nFirst, Auto-Deduct is your friend. Never rely on your memory alone. Our system integrates directly with EcoCash to automate your payments. By setting this up, you avoid the risk of forgetting a due date and losing valuable credit points.\n\nSecond, Pay Early When Possible. Did you know that every early payment earns you +2 bonus points? If you have a good week with your side hustle, consider clearing your debt immediately. This lowers your utilization ratio and boosts your \'Trusted\' status faster.\n\nFinally, Communicate if you struggle. Life happens. If you know you will miss a payment, do not default silently. Use the app to request a 3-day grace period. Transparency builds trust, while silence destroys it.',
      },
      {
        id: '2',
        title: 'Building Your First Credit Score',
        type: 'article',
        duration: '8 min',
        points: 15,
        tier: 'Beginner',
        isCompleted: false,
        category: 'Finance',
        content: 'Building a credit score from scratch can feel daunting, but with HiveFund, your community participation counts. Your score is not just about how much money you have; it is about how reliable you are.\n\nStart by Joining a Mukando Circle. Consistency is king. Making your $20 contribution on time for three months in a row is the fastest way to jump from \'Newbie\' to \'Established\'.\n\nNext, Complete Learning Modules. You are doing it right now! Every article you read proves you are serious about financial literacy. We reward this curiosity with +5 points per lesson.\n\nLastly, Avoid Over-Borrowing. Just because you are eligible for a $50 loan does not mean you should take it. Only borrow what you can turn into profit or essential value. A paid-off small loan looks better than a struggling large one.',
      },
      {
        id: '3',
        title: 'Scaling Your Side Hustle',
        type: 'video',
        duration: '12 min',
        points: 20,
        tier: 'Growing',
        isCompleted: false,
        category: 'Business',
        content: 'Learn how to turn your weekend gig into a full-time business. In this lesson, we cover pricing strategies that ensure profit, how to market on a budget using WhatsApp Status, and knowing exactly when to hire help without going into debt.',
      },
      {
        id: '4',
        title: 'Understanding Credit Scores',
        type: 'video',
        duration: '10 min',
        points: 15,
        tier: 'Growing',
        isCompleted: true,
        category: 'Finance',
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
        description: 'Expert math tutoring for high school students',
        category: 'Academic',
        rate: 25,
        rateType: 'hourly',
        rating: 4.8,
        reviewCount: 12,
        providerName: 'Sarah Johnson',
        providerId: 'provider-1',
        availability: 'Weekdays 3-6 PM',
      },
      {
        id: '2',
        title: 'Logo Design',
        description: 'Professional logo design services',
        category: 'Creative',
        rate: 50,
        rateType: 'fixed',
        rating: 5.0,
        reviewCount: 8,
        providerName: 'Mike Chen',
        providerId: 'provider-2',
        availability: 'Flexible',
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
