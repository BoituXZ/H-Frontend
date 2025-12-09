import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreditScoreData {
  score: number;
  status: string;
  nextTier: {
    name: string;
    targetScore: number;
    progress: number;
  };
  breakdown: {
    paymentConsistency: {
      current: number;
      max: number;
    };
    timeActive: {
      current: number;
      max: number;
    };
  };
  improvementTips: string[];
}

export interface CreditHistoryItem {
  date: string;
  description: string;
  points: number;
  type: 'positive' | 'negative';
}

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCreditScore(): Observable<CreditScoreData> {
    if (environment.useMockData) {
      return of(this.getMockCreditScore()).pipe(delay(500));
    }
    return this.http.get<CreditScoreData>(`${this.apiUrl}/credit/score`);
  }

  getCreditHistory(): Observable<CreditHistoryItem[]> {
    if (environment.useMockData) {
      return of(this.getMockCreditHistory()).pipe(delay(500));
    }
    return this.http.get<CreditHistoryItem[]>(`${this.apiUrl}/credit/history`);
  }

  private getMockCreditScore(): CreditScoreData {
    return {
      score: 650,
      status: 'ESTABLISHED',
      nextTier: {
        name: 'Trusted',
        targetScore: 700,
        progress: 93,
      },
      breakdown: {
        paymentConsistency: {
          current: 260,
          max: 400,
        },
        timeActive: {
          current: 160,
          max: 200,
        },
      },
      improvementTips: [
        'Make payments on time consistently',
        'Join more savings circles',
        'Complete your profile verification',
        'Maintain active participation',
      ],
    };
  }

  private getMockCreditHistory(): CreditHistoryItem[] {
    return [
      {
        date: '2024-12-05',
        description: 'On-time payment',
        points: 5,
        type: 'positive',
      },
      {
        date: '2024-12-01',
        description: 'Missed payment',
        points: -20,
        type: 'negative',
      },
      {
        date: '2024-11-28',
        description: 'On-time payment',
        points: 5,
        type: 'positive',
      },
      {
        date: '2024-11-25',
        description: 'Circle contribution completed',
        points: 10,
        type: 'positive',
      },
      {
        date: '2024-11-20',
        description: 'On-time payment',
        points: 5,
        type: 'positive',
      },
      {
        date: '2024-11-15',
        description: 'Late payment',
        points: -10,
        type: 'negative',
      },
      {
        date: '2024-11-10',
        description: 'On-time payment',
        points: 5,
        type: 'positive',
      },
      {
        date: '2024-11-05',
        description: 'Profile verification completed',
        points: 15,
        type: 'positive',
      },
    ];
  }
}
