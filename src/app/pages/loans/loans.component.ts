import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import {
  LoansService,
  ActiveLoan,
  CompletedLoan,
  LoanOpportunity,
} from '../../services/loans.service';
import { LucideAngularModule, Lock, Check } from 'lucide-angular';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css',
})
export class LoansComponent implements OnInit {
  protected readonly Lock = Lock;
  protected readonly Check = Check;

  activeTab = signal<'my-loans' | 'opportunities'>('my-loans');
  activeLoans = signal<ActiveLoan[]>([]);
  completedLoans = signal<CompletedLoan[]>([]);
  loanOpportunities = signal<LoanOpportunity[]>([]);
  loading = signal(true);

  constructor(private loansService: LoansService) {}

  ngOnInit(): void {
    this.loadLoansData();
  }

  loadLoansData(): void {
    this.loading.set(true);

    this.loansService.getActiveLoans().subscribe({
      next: (data) => {
        this.activeLoans.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading active loans:', err);
        this.loading.set(false);
      },
    });

    this.loansService.getCompletedLoans().subscribe({
      next: (data) => {
        this.completedLoans.set(data);
      },
      error: (err) => {
        console.error('Error loading completed loans:', err);
      },
    });

    this.loansService.getLoanOpportunities().subscribe({
      next: (data) => {
        this.loanOpportunities.set(data);
      },
      error: (err) => {
        console.error('Error loading loan opportunities:', err);
      },
    });
  }

  setActiveTab(tab: 'my-loans' | 'opportunities'): void {
    this.activeTab.set(tab);
  }

  onPayEarly(loanId: string): void {
    // TODO: Implement pay early logic
    console.log('Pay early for loan:', loanId);
  }

  onApplyNow(opportunityId: string): void {
    // TODO: Implement apply now logic
    console.log('Apply for loan opportunity:', opportunityId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
