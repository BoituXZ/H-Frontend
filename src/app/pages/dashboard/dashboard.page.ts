import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardData } from '../../models/dashboard.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import {
  LucideAngularModule,
  TrendingUp,
  Wallet,
  Users,
  CheckCircle,
  Clock,
  RefreshCw,
  Check,
  DollarSign,
  Plus,
  ArrowDownToLine,
  Repeat,
  Banknote,
  History,
  Settings,
} from 'lucide-angular';
import {
  fadeInAnimation,
  slideUpAnimation,
} from '../../shared/utils/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    PageHeaderComponent,
    LucideAngularModule,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
  animations: [fadeInAnimation, slideUpAnimation],
})
export class DashboardPage implements OnInit {
  // Lucide icons
  readonly TrendingUp = TrendingUp;
  readonly Wallet = Wallet;
  readonly Users = Users;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly RefreshCw = RefreshCw;
  readonly Check = Check;
  readonly DollarSign = DollarSign;
  readonly Plus = Plus;
  readonly ArrowDownToLine = ArrowDownToLine;
  readonly Repeat = Repeat;
  readonly Banknote = Banknote;
  readonly History = History;
  readonly Settings = Settings;

  dashboardData = signal<DashboardData | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load dashboard data. Please try again.');
        this.loading.set(false);
        console.error('Dashboard data error:', err);
      },
    });
  }

  get user() {
    return this.authService.currentUser;
  }

  logout(): void {
    this.authService.logout();
  }

  // Helper methods for template
  getTierColor(tier: string): string {
    const colors: Record<string, string> = {
      Bronze: '#CD7F32',
      Silver: '#C0C0C0',
      Gold: '#FFD700',
    };
    return colors[tier] || colors['Bronze'];
  }

  getNextTier(currentTier: string): string {
    const tiers: Record<string, string> = {
      Bronze: 'Silver',
      Silver: 'Gold',
      Gold: 'Platinum',
    };
    return tiers[currentTier] || 'Next Level';
  }

  getProgressPercentage(score: number, tier: string): number {
    const tierRanges: Record<string, { min: number; max: number }> = {
      Bronze: { min: 300, max: 699 },
      Silver: { min: 700, max: 799 },
      Gold: { min: 800, max: 900 },
    };

    const range = tierRanges[tier] || tierRanges['Bronze'];
    const scoreInRange = score - range.min;
    const rangeSize = range.max - range.min;
    const percentage = (scoreInRange / rangeSize) * 100;

    return Math.min(Math.max(percentage, 0), 100);
  }

  getTotalRewards(recommendations: Array<{ reward: number }>): number {
    return recommendations.reduce((sum, rec) => sum + rec.reward, 0);
  }

  getCountdown(dateString: string): string {
    const now = new Date().getTime();
    const target = new Date(dateString).getTime();
    const distance = target - now;

    if (distance < 0) {
      return 'Payout Due!';
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  getPaidCount(members: Array<{ status: string }>): number {
    return members.filter((m) => m.status === 'paid').length;
  }

  getPendingCount(members: Array<{ status: string }>): number {
    return members.filter((m) => m.status === 'pending').length;
  }

  // Navigation methods
  navigateToScore(): void {
    // TODO: Navigate to credit score details page
    console.log('Navigate to score details');
  }

  navigateToWallet(): void {
    this.router.navigate(['/app/wallet']);
  }

  navigateToCircles(): void {
    this.router.navigate(['/app/circles']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/app/settings']);
  }
}
