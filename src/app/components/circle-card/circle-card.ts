import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  DollarSign,
  Users,
  Award,
  Calendar,
  Gift,
  CheckCircle2,
} from 'lucide-angular';
import { trigger, transition, style, animate } from '@angular/animations';

interface CircleSummary {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'forming';
  contributionAmount: number;
  frequency: 'weekly' | 'monthly';
  memberCount: number;
  maxMembers: number;
  userPosition: number;
  hasPaidOut: boolean;
  progress: {
    currentRound: number;
    totalRounds: number;
    percentage: number;
  };
  nextPayment?: {
    date: string;
    amount: number;
  };
  nextPayout?: {
    date: string;
    amount: number;
  };
}

@Component({
  selector: 'app-circle-card',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './circle-card.html',
  styleUrl: './circle-card.css',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
    ]),
  ],
})
export class CircleCard {
  @Input() circle!: CircleSummary;
  @Input() isFeatured = false;
  @Output() circleClick = new EventEmitter<string>();

  // Icons
  protected readonly DollarSign = DollarSign;
  protected readonly Users = Users;
  protected readonly Award = Award;
  protected readonly Calendar = Calendar;
  protected readonly Gift = Gift;
  protected readonly CheckCircle2 = CheckCircle2;

  getStatusBadge(): { label: string; class: string } {
    if (!this.circle.hasPaidOut && this.circle.status === 'active') {
      return {
        label: 'Payment Due',
        class: 'badge-warning',
      };
    }

    if (this.circle.hasPaidOut && this.circle.status === 'active') {
      return {
        label: 'Paid',
        class: 'badge-success',
      };
    }

    if (this.circle.status === 'completed') {
      return {
        label: 'Completed',
        class: 'badge-complete',
      };
    }

    return {
      label: 'Forming',
      class: 'badge-neutral',
    };
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const currentYear = new Date().getFullYear();
    const dateYear = date.getFullYear();

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: dateYear !== currentYear ? 'numeric' : undefined,
    });
  }

  formatFrequency(): string {
    return `$${this.circle.contributionAmount.toFixed(0)}/${this.circle.frequency}`;
  }

  getDisplayMembers(): string[] {
    // Generate initials for first 3 members
    const defaults = ['JD', 'SM', 'KL', 'AB', 'CD', 'EF', 'GH', 'IJ'];
    return defaults.slice(0, Math.min(3, this.circle.memberCount));
  }

  getRemainingCount(): number {
    return Math.max(0, this.circle.memberCount - 3);
  }

  onCardClick(): void {
    this.circleClick.emit(this.circle.id);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onCardClick();
    }
  }
}
