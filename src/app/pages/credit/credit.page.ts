import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { CreditService, CreditScoreData, CreditHistoryItem } from '../../services/credit.service';
import { LucideAngularModule, Check } from 'lucide-angular';

@Component({
  selector: 'app-credit',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './credit.page.html',
  styleUrl: './credit.page.css',
})
export class CreditPage implements OnInit {
  protected readonly Check = Check;

  activeTab = signal<'overview' | 'history'>('overview');
  creditScore = signal<CreditScoreData | null>(null);
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
        this.creditScore.set(data);
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
