import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ActiveLoan {
  id: string;
  name: string;
  amount: number;
  outstanding: number;
  progress: number; // percentage
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
}

export interface CompletedLoan {
  id: string;
  name: string;
  creditPoints: number;
  completedDate: string;
}

export interface LoanOpportunity {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  eligible: boolean;
  locked: boolean;
  lockReason?: string;
  requiredCreditScore?: number;
}

@Injectable({
  providedIn: 'root',
})
export class LoansService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getActiveLoans(): Observable<ActiveLoan[]> {
    if (environment.useMockData) {
      return of(this.getMockActiveLoans()).pipe(delay(500));
    }
    return this.http.get<ActiveLoan[]>(`${this.apiUrl}/loans/active`);
  }

  getCompletedLoans(): Observable<CompletedLoan[]> {
    if (environment.useMockData) {
      return of(this.getMockCompletedLoans()).pipe(delay(500));
    }
    return this.http.get<CompletedLoan[]>(`${this.apiUrl}/loans/completed`);
  }

  getLoanOpportunities(): Observable<LoanOpportunity[]> {
    if (environment.useMockData) {
      return of(this.getMockLoanOpportunities()).pipe(delay(500));
    }
    return this.http.get<LoanOpportunity[]>(`${this.apiUrl}/loans/opportunities`);
  }

  private getMockActiveLoans(): ActiveLoan[] {
    return [
      {
        id: '1',
        name: 'Short-Term Loan',
        amount: 150,
        outstanding: 82.5,
        progress: 50,
        nextPaymentDate: '2024-12-20',
        nextPaymentAmount: 27.5,
      },
    ];
  }

  private getMockCompletedLoans(): CompletedLoan[] {
    return [
      {
        id: '2',
        name: 'Micro Loan',
        creditPoints: 10,
        completedDate: '2024-11-15',
      },
    ];
  }

  private getMockLoanOpportunities(): LoanOpportunity[] {
    return [
      {
        id: '3',
        name: 'Micro Loan',
        minAmount: 10,
        maxAmount: 50,
        eligible: true,
        locked: false,
      },
      {
        id: '4',
        name: 'Short-Term Loan',
        minAmount: 50,
        maxAmount: 200,
        eligible: true,
        locked: false,
      },
      {
        id: '5',
        name: 'Growth Loan',
        minAmount: 200,
        maxAmount: 500,
        eligible: false,
        locked: true,
        lockReason: 'Required: Credit score 700+',
        requiredCreditScore: 700,
      },
    ];
  }
}
