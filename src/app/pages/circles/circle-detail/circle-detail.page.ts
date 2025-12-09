import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  MoreVertical,
  Users,
  Banknote,
  Vote,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp,
  Hash,
  Copy,
  AlertCircle
} from 'lucide-angular';

import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CirclesService } from '../../../services/circles.service';
import {
  CircleDetail,
  CircleMember,
  PayoutEntry,
} from '../../../models/circle.model';
import { fadeIn, slideUp } from '../../../shared/utils/animations';

interface MockTransaction {
  id: string;
  type: 'in' | 'out';
  amount: number;
  date: string;
  description: string;
}

interface MockVote {
  id: string;
  title: string;
  description: string;
  type: 'emergency_exit' | 'rule_change';
  endDate: string;
}

@Component({
  selector: 'app-circle-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, LoadingSpinnerComponent, RouterModule],
  templateUrl: './circle-detail.page.html',
  styleUrls: ['./circle-detail.page.css'],
  animations: [fadeIn, slideUp],
})
export class CircleDetailPage {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private circlesService = inject(CirclesService);

  // Icons
  protected readonly ArrowLeft = ArrowLeft;
  protected readonly MoreVertical = MoreVertical;
  protected readonly Users = Users;
  protected readonly Banknote = Banknote;
  protected readonly Vote = Vote;
  protected readonly CheckCircle = CheckCircle;
  protected readonly Clock = Clock;
  protected readonly Calendar = Calendar;
  protected readonly TrendingUp = TrendingUp;
  protected readonly Hash = Hash;
  protected readonly Copy = Copy;
  protected readonly AlertCircle = AlertCircle;

  // State Signals
  private circleId = signal<string | null>(null);

  // Separate data signals for each endpoint
  private circleData = signal<CircleDetail | null>(null);
  private membersData = signal<CircleMember[]>([]);
  private timelineData = signal<PayoutEntry[]>([]);

  // Mock Data Signals
  public transactions = signal<MockTransaction[]>([
    { id: '1', type: 'in', amount: 160, date: '2023-11-01', description: 'Payout Received' },
    { id: '2', type: 'out', amount: 20, date: '2023-10-25', description: 'Weekly Contribution' },
    { id: '3', type: 'out', amount: 20, date: '2023-10-18', description: 'Weekly Contribution' },
    { id: '4', type: 'out', amount: 20, date: '2023-10-11', description: 'Weekly Contribution' },
  ]);

  public activeVote = signal<MockVote | null>({
    id: 'v1',
    title: 'Emergency Exit Request',
    description: 'Member "John Doe" has requested an emergency exit due to medical reasons.',
    type: 'emergency_exit',
    endDate: '2023-12-10'
  });

  // Granular loading states
  public circleLoading = signal<boolean>(true);
  public membersLoading = signal<boolean>(true);
  public timelineLoading = signal<boolean>(true);

  // Granular error states
  public circleError = signal<string | null>(null);
  public membersError = signal<string | null>(null);
  public timelineError = signal<string | null>(null);

  public showDropdown = signal<boolean>(false);
  public activeTab = signal<'overview' | 'members' | 'transactions' | 'governance'>('overview');

  // Computed Signals
  public circleDetail = computed(() => this.circleData());
  public members = computed(() => this.membersData());
  public timeline = computed(() => this.timelineData());

  // Overall loading state - true if any section is loading
  public loading = computed(
    () =>
      this.circleLoading() || this.membersLoading() || this.timelineLoading(),
  );

  // Overall error - only if circle detail fails (critical data)
  public error = computed(() => this.circleError());

  constructor() {
    this.circleId.set(this.route.snapshot.paramMap.get('id'));
    this.loadCircleData();
  }

  loadCircleData(): void {
    if (!this.circleId()) {
      this.circleError.set('Circle ID is missing.');
      this.circleLoading.set(false);
      this.membersLoading.set(false);
      this.timelineLoading.set(false);
      return;
    }

    // Load circle details (critical)
    this.loadCircleDetails();

    // Load members (independent)
    this.loadMembers();

    // Load timeline (independent)
    this.loadTimeline();
  }

  private loadCircleDetails(): void {
    this.circleLoading.set(true);
    this.circleError.set(null);

    this.circlesService.getCircleById(this.circleId()!).subscribe({
      next: (circle) => {
        this.circleData.set(circle);
        this.circleLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load circle details:', err);
        this.circleError.set(
          'We had trouble loading the circle details. Please try again.',
        );
        this.circleLoading.set(false);
      },
    });
  }

  private loadMembers(): void {
    this.membersLoading.set(true);
    this.membersError.set(null);

    this.circlesService.getCircleMembers(this.circleId()!).subscribe({
      next: (members) => {
        this.membersData.set(members);
        this.membersLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load circle members:', err);
        this.membersError.set('Unable to load members at this time.');
        this.membersLoading.set(false);
      },
    });
  }

  private loadTimeline(): void {
    this.timelineLoading.set(true);
    this.timelineError.set(null);

    this.circlesService.getCircleTimeline(this.circleId()!).subscribe({
      next: (timeline) => {
        this.timelineData.set(timeline);
        this.timelineLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load circle timeline:', err);
        this.timelineError.set('Unable to load timeline at this time.');
        this.timelineLoading.set(false);
      },
    });
  }

  retryCircle(): void {
    this.loadCircleDetails();
  }

  retryMembers(): void {
    this.loadMembers();
  }

  retryTimeline(): void {
    this.loadTimeline();
  }

  navigateBack(): void {
    this.location.back();
  }

  toggleDropdown(): void {
    this.showDropdown.update((v) => !v);
  }

  switchTab(tab: 'overview' | 'members' | 'transactions' | 'governance'): void {
    this.activeTab.set(tab);
  }

  getStatusBadgeClass(status: string): string {
    if (!status) return 'status-badge-neutral';

    switch (status.toLowerCase()) {
      case 'active':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'closed':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  }

  async copyInviteCode(code: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      alert('Invite code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy invite code.');
    }
  }
}
