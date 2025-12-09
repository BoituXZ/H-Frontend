import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LoansService,
  ActiveLoan,
  CompletedLoan,
  LoanOpportunity,
} from '../../services/loans.service';
import {
  LucideAngularModule,
  Lock,
  Check,
  PlusCircle,
  Banknote,
  Calendar,
  TrendingUp,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
  Clock,
  ChevronRight,
} from 'lucide-angular';

export interface LoanStats {
  outstandingBalance: number;
  nextPaymentDate: string;
  repaymentRate: number;
}

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css',
})
export class LoansComponent implements OnInit {
  // Icons
  protected readonly Lock = Lock;
  protected readonly Check = Check;
  protected readonly PlusCircle = PlusCircle;
  protected readonly Banknote = Banknote;
  protected readonly Calendar = Calendar;
  protected readonly TrendingUp = TrendingUp;
  protected readonly CheckCircle = CheckCircle;
  protected readonly ShieldCheck = ShieldCheck;
  protected readonly AlertCircle = AlertCircle;
  protected readonly Clock = Clock;
  protected readonly ChevronRight = ChevronRight;

  activeTab = signal<'my-loans' | 'opportunities'>('my-loans');
  activeLoans = signal<ActiveLoan[]>([]);
  completedLoans = signal<CompletedLoan[]>([]);
  loanOpportunities = signal<LoanOpportunity[]>([]);
  loading = signal(true);

  // Computed Stats (Mocked based on active loans or static for demo)
  loanStats = computed<LoanStats>(() => {
    const loans = this.activeLoans();
    const totalOutstanding = loans.reduce((acc, loan) => acc + loan.outstanding, 0);
    
    // Find earliest next payment date (mock logic)
    const nextPayment = loans.length > 0 ? 'Jan 10, 2025' : 'N/A';

    return {
      outstandingBalance: totalOutstanding,
      nextPaymentDate: nextPayment,
      repaymentRate: 100 // Mock value
    };
  });

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

  getRepaidAmount(loan: ActiveLoan): number {
    return loan.amount - loan.outstanding;
  }
}
