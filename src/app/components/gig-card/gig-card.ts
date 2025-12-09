import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Star,
  ShieldCheck,
  Award,
  MapPin,
  Clock,
} from 'lucide-angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { Gig } from '../../models/gig.model';

@Component({
  selector: 'app-gig-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './gig-card.html',
  styleUrl: './gig-card.css',
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
export class GigCard {
  @Input() gig!: Gig;
  @Input() isFeatured = false;
  @Output() gigClick = new EventEmitter<string>();

  // Icons
  protected readonly Star = Star;
  protected readonly ShieldCheck = ShieldCheck;
  protected readonly Award = Award;
  protected readonly MapPin = MapPin;
  protected readonly Clock = Clock;

  isVerified(): boolean {
    return this.gig.isMukandoMember || this.gig.creditScore >= 700;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getLocation(): string {
    return this.gig.category === 'Tech' || this.gig.category === 'Academic' ? 'Remote' : 'On-site';
  }

  getAvailability(): string {
    return 'Flexible';
  }

  onCardClick(): void {
    this.gigClick.emit(this.gig.id);
  }

  onViewDetails(event: Event): void {
    event.stopPropagation();
    this.gigClick.emit(this.gig.id);
  }

  onBookNow(event: Event): void {
    event.stopPropagation();
    this.gigClick.emit(this.gig.id);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onCardClick();
    }
  }
}

