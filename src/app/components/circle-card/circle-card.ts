import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  DollarSign,
  Users, // Added Users icon
  CheckCircle2,
} from 'lucide-angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { Circle } from '../../models/circle.model';

@Component({
  selector: 'app-circle-card',
  standalone: true,
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
  @Input() circle!: Circle;
  @Input() isFeatured = false;
  @Output() circleClick = new EventEmitter<string>();

  // Icons
  protected readonly DollarSign = DollarSign;
  protected readonly Users = Users; // Added Users icon
  protected readonly CheckCircle2 = CheckCircle2;

  getStatusBadge(): { label: string; class: string } {
    switch (this.circle.status) {
      case 'active':
        return { label: 'Active', class: 'badge-success' };
      case 'completed':
        return { label: 'Completed', class: 'badge-complete' };
      case 'pending':
        return { label: 'Pending', class: 'badge-warning' };
      default:
        return { label: this.circle.status, class: 'badge-neutral' };
    }
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
