import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Storefront,
  Product,
  Order,
  StorefrontAnalytics,
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
}
