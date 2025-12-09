import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditService, CreditScoreData, CreditHistoryItem } from '../../services/credit.service';
import {
  LucideAngularModule,
  ShieldCheck,
  History,
  TrendingUp,
  BarChart2,
  Info,
  CheckCircle,
  Circle,
  ChevronRight,
} from 'lucide-angular';

export interface ExtendedCreditScoreData extends CreditScoreData {
  breakdown: {
    paymentConsistency: { current: number; max: number };
    timeActive: { current: number; max: number };
    participation: { current: number; max: number };
    contributionRatio: { current: number; max: number };
  };
}

@Component({
  selector: 'app-credit',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './credit.page.html',
  styleUrl: './credit.page.css',
})
export class CreditPage implements OnInit {
  // Icons
  protected readonly ShieldCheck = ShieldCheck;
  protected readonly History = History;
  protected readonly TrendingUp = TrendingUp;
  protected readonly BarChart2 = BarChart2;
  protected readonly Info = Info;
  protected readonly CheckCircle = CheckCircle;
  protected readonly Circle = Circle;
  protected readonly ChevronRight = ChevronRight;

  activeTab = signal<'overview' | 'history'>('overview');
  creditScore = signal<ExtendedCreditScoreData | null>(null);
  creditHistory = signal<CreditHistoryItem[]>([]);
  loading = signal(true);

  constructor(private creditService: CreditService) {}

  ngOnInit(): void {
    this.loadCreditData();
  }

  loadCreditData(): void {
    this.loading.set(true);
    
    this.creditService.getCreditScore().subscribe({
      next: (data) => {
        // Map to extended structure with mock data for missing fields
        const extendedData: ExtendedCreditScoreData = {
          ...data,
          breakdown: {
            ...data.breakdown,
            participation: { current: 85, max: 100 }, // Mock
            contributionRatio: { current: 90, max: 100 } // Mock
          }
        };
        this.creditScore.set(extendedData);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading credit score:', err);
        this.loading.set(false);
      },
    });

    this.creditService.getCreditHistory().subscribe({
      next: (data) => {
        this.creditHistory.set(data);
      },
      error: (err) => {
        console.error('Error loading credit history:', err);
      },
    });
  }

  setActiveTab(tab: 'overview' | 'history'): void {
    this.activeTab.set(tab);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
