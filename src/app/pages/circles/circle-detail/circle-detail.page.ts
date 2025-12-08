import { Component, signal, computed, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CirclesService } from '../../../services/circles.service';
import {
  CircleDetail,
  CircleMember,
  PayoutEntry,
} from '../../../models/circle.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import {
  LucideAngularModule,
  ArrowLeft,
  MoreVertical,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  Award,
  Shield,
  Copy,
} from 'lucide-angular';
import {
  fadeInAnimation,
  slideUpAnimation,
} from '../../../shared/utils/animations';
import { Subscription, forkJoin } from 'rxjs';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private circlesService = inject(CirclesService);

  // Lucide icons
  readonly ArrowLeft = ArrowLeft;
  readonly MoreVertical = MoreVertical;
  readonly Users = Users;
  readonly DollarSign = DollarSign;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly Calendar = Calendar;
  readonly AlertCircle = AlertCircle;
  readonly Award = Award;
  readonly Shield = Shield;
  readonly Copy = Copy;

  // State signals
  circleDetail = signal<CircleDetail | null>(null);
  members = signal<CircleMember[]>([]);
  timeline = signal<PayoutEntry[]>([]);

  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<'overview' | 'members' | 'timeline'>('overview');
  showDropdown = signal(false);

  private routeSub?: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadCircleData(id);
      } else {
        this.error.set('No circle ID provided');
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private loadCircleData(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      details: this.circlesService.getCircleById(id),
      members: this.circlesService.getCircleMembers(id),
      timeline: this.circlesService.getCircleTimeline(id),
    }).subscribe({
      next: ({ details, members, timeline }) => {
        this.circleDetail.set(details);
        this.members.set(members);
        this.timeline.set(timeline);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading circle data:', err);
        this.error.set('Failed to load circle details. Please try again.');
        this.loading.set(false);
      },
    });
  }

  switchTab(tab: 'overview' | 'members' | 'timeline'): void {
    this.activeTab.set(tab);
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
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-default';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  retry(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCircleData(id);
    }
  }

  copyInviteCode(code: string): void {
    navigator.clipboard.writeText(code);
    // Maybe show a toast notification
  }
}
