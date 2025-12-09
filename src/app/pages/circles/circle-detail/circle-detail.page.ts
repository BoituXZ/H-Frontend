import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  LucideAngularModule,
  AlertCircle,
  ArrowLeft,
  MoreVertical,
  Copy,
} from 'lucide-angular';

import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CirclesService } from '../../../services/circles.service';
import {
  CircleDetail,
  CircleMember,
  PayoutEntry,
} from '../../../models/circle.model';
import { fadeIn, slideUp } from '../../../shared/utils/animations';

@Component({
  selector: 'app-circle-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, LoadingSpinnerComponent],
  templateUrl: './circle-detail.page.html',
  styleUrls: ['./circle-detail.page.css'],
  animations: [fadeIn, slideUp],
})
export class CircleDetailPage {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private circlesService = inject(CirclesService);

  // Icons
  AlertCircle = AlertCircle;
  ArrowLeft = ArrowLeft;
  MoreVertical = MoreVertical;
  Copy = Copy;

  // State Signals
  private circleId = signal<string | null>(null);
  private circleData = signal<{
    circle: CircleDetail;
    members: CircleMember[];
    timeline: PayoutEntry[];
  } | null>(null);

  public loading = signal<boolean>(true);
  public error = signal<string | null>(null);
  public showDropdown = signal<boolean>(false);
  public activeTab = signal<'overview' | 'members' | 'timeline'>('overview');

  // Computed Signals
  public circleDetail = computed(() => this.circleData()?.circle);
  public members = computed(() => this.circleData()?.members || []);
  public timeline = computed(() => this.circleData()?.timeline || []);

  constructor() {
    this.circleId.set(this.route.snapshot.paramMap.get('id'));
    this.loadCircleData();
  }

  loadCircleData(): void {
    if (!this.circleId()) {
      this.error.set('Circle ID is missing.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // Using forkJoin to handle multiple parallel requests
    forkJoin({
      circle: this.circlesService.getCircleById(this.circleId()!),
      members: this.circlesService.getCircleMembers(this.circleId()!),
      timeline: this.circlesService.getCircleTimeline(this.circleId()!), // Assuming this method exists
    }).subscribe({
      next: (data) => {
        this.circleData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load circle details:', err);
        this.error.set(
          'We had trouble loading the circle details. Please try again.',
        );
        this.loading.set(false);
      },
    });
  }

  retry(): void {
    this.loadCircleData();
  }

  navigateBack(): void {
    this.location.back();
  }

  toggleDropdown(): void {
    this.showDropdown.update((v) => !v);
  }

  switchTab(tab: 'overview' | 'members' | 'timeline'): void {
    this.activeTab.set(tab);
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-badge-success';
      case 'pending':
        return 'status-badge-warning';
      case 'closed':
        return 'status-badge-neutral';
      default:
        return 'status-badge-neutral';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  async copyInviteCode(code: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      // Optional: Add a toast notification for better UX
      alert('Invite code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy invite code.');
    }
  }
}
