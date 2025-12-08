import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CirclesService } from '../../../services/circles.service';
import { CircleDetail, CircleTransaction } from '../../../models/circle.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import {
  LucideAngularModule,
  ArrowLeft,
  MoreVertical,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  XCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Award,
  CreditCard,
  Activity,
  Shield,
} from 'lucide-angular';
import {
  fadeInAnimation,
  slideUpAnimation,
} from '../../../shared/utils/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-circle-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    LucideAngularModule,
  ],
  templateUrl: './circle-detail.page.html',
  styleUrl: './circle-detail.page.css',
  animations: [fadeInAnimation, slideUpAnimation],
})
export class CircleDetailPage implements OnInit, OnDestroy {
  // Lucide icons
  readonly ArrowLeft = ArrowLeft;
  readonly MoreVertical = MoreVertical;
  readonly Users = Users;
  readonly DollarSign = DollarSign;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly TrendingUp = TrendingUp;
  readonly Calendar = Calendar;
  readonly XCircle = XCircle;
  readonly AlertCircle = AlertCircle;
  readonly ThumbsUp = ThumbsUp;
  readonly ThumbsDown = ThumbsDown;
  readonly Award = Award;
  readonly CreditCard = CreditCard;
  readonly Activity = Activity;
  readonly Shield = Shield;

  // State signals
  circleDetail = signal<CircleDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<'overview' | 'members' | 'transactions' | 'governance'>(
    'overview',
  );
  transactionFilter = signal<'all' | 'contributions' | 'payouts'>('all');
  showDropdown = signal(false);

  // Computed signals
  filteredTransactions = computed(() => {
    const detail = this.circleDetail();
    const filter = this.transactionFilter();

    if (!detail) return [];

    if (filter === 'all') return detail.transactions;
    if (filter === 'contributions') {
      return detail.transactions.filter((t) => t.type === 'contribution');
    }
    return detail.transactions.filter((t) => t.type === 'payout');
  });

  activeVotes = computed(() => {
    const detail = this.circleDetail();
    if (!detail) return [];
    return detail.votes.filter((v) => v.status === 'active');
  });

  private routeSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private circlesService: CirclesService,
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadCircleDetail(id);
      } else {
        this.error.set('No circle ID provided');
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private loadCircleDetail(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.circlesService.getCircleById(id).subscribe({
      next: (data) => {
        this.circleDetail.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading circle details:', err);
        this.error.set('Failed to load circle details. Please try again.');
        this.loading.set(false);
      },
    });
  }

  switchTab(tab: 'overview' | 'members' | 'transactions' | 'governance'): void {
    this.activeTab.set(tab);
  }

  setTransactionFilter(filter: 'all' | 'contributions' | 'payouts'): void {
    this.transactionFilter.set(filter);
  }

  navigateBack(): void {
    this.router.navigate(['/app/circles']);
  }

  toggleDropdown(): void {
    this.showDropdown.update((v) => !v);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'completed':
        return 'badge-info';
      case 'paused':
        return 'badge-warning';
      default:
        return 'badge-default';
    }
  }

  getProgressPercentage(current: number, total: number): number {
    return Math.round((current / total) * 100);
  }

  getDaysUntil(dateString: string): number {
    const target = new Date(dateString);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getCountdown(dateString: string): string {
    const days = this.getDaysUntil(dateString);
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  getMembersByStatus(status: 'paid' | 'pending' | 'received'): number {
    const detail = this.circleDetail();
    if (!detail) return 0;
    return detail.members.filter((m) => m.status === status).length;
  }

  getVoteProgress(yesVotes: number, totalMembers: number): number {
    return Math.round((yesVotes / totalMembers) * 100);
  }

  async submitVote(voteId: string, vote: 'yes' | 'no'): Promise<void> {
    const detail = this.circleDetail();
    if (!detail) return;

    try {
      await this.circlesService.submitVote(detail.id, voteId, vote).toPromise();

      // Update local state optimistically
      this.circleDetail.update((current) => {
        if (!current) return current;

        return {
          ...current,
          votes: current.votes.map((v) => {
            if (v.id === voteId) {
              return {
                ...v,
                hasVoted: true,
                userVote: vote,
                yesVotes: vote === 'yes' ? v.yesVotes + 1 : v.yesVotes,
                noVotes: vote === 'no' ? v.noVotes + 1 : v.noVotes,
              };
            }
            return v;
          }),
        };
      });
    } catch (err) {
      console.error('Error submitting vote:', err);
      // Handle error - could show a toast/notification
    }
  }

  getTransactionAmountClass(type: string): string {
    return type === 'payout' ? 'text-success' : 'text-default';
  }

  isCurrentUserPayout(memberId: string): boolean {
    const detail = this.circleDetail();
    if (!detail) return false;
    const currentUser = detail.members.find((m) => m.isCurrentUser);
    return currentUser ? memberId === currentUser.id : false;
  }

  retry(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCircleDetail(id);
    }
  }
}
