import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardData } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getDashboardData(): Observable<DashboardData> {
    if (environment.useMockData) {
      return of(this.getMockData()).pipe(delay(800)); // Simulate network delay
    }

    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }

  private getMockData(): DashboardData {
    return {
      user: {
        name: 'Tendai Moyo',
        level: 'Bronze Builder',
        creditScore: 680,
        tier: 'Bronze',
        nextTierScore: 700,
      },
      activeCircle: {
        name: 'Sunrise Savers',
        round: 'Round 3 of 12',
        contributionAmount: 50,
        potValue: 600,
        nextPayoutDate: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 5 days from now
        members: [
          { id: '1', initials: 'TM', status: 'paid', isCurrentUser: true },
          { id: '2', initials: 'SM', status: 'paid', isCurrentUser: false },
          { id: '3', initials: 'NK', status: 'pending', isCurrentUser: false },
          { id: '4', initials: 'PM', status: 'paid', isCurrentUser: false },
          { id: '5', initials: 'RT', status: 'paid', isCurrentUser: false },
          { id: '6', initials: 'CB', status: 'pending', isCurrentUser: false },
          { id: '7', initials: 'LM', status: 'paid', isCurrentUser: false },
          { id: '8', initials: 'JK', status: 'paid', isCurrentUser: false },
          { id: '9', initials: 'WN', status: 'paid', isCurrentUser: false },
          { id: '10', initials: 'FS', status: 'paid', isCurrentUser: false },
          { id: '11', initials: 'DM', status: 'paid', isCurrentUser: false },
          {
            id: '12',
            initials: 'AN',
            status: 'received',
            isCurrentUser: false,
          },
        ],
      },
      wallet: {
        balance: 245.5,
        isConnected: true,
      },
      recommendations: [
        {
          title: 'Complete your profile verification',
          reward: 10,
          type: 'gig',
        },
        { title: 'Refer a friend to HiveFund', reward: 25, type: 'gig' },
        { title: 'Join a new circle', reward: 5, type: 'gig' },
      ],
    };
  }
}
