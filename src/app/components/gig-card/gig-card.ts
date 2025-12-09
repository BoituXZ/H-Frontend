import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Star,
  ShieldCheck,
  Award,
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

  isVerified(): boolean {
    return this.gig.isMukandoMember || this.gig.creditScore >= 700;
  }

  onCardClick(): void {
    this.gigClick.emit(this.gig.id);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onCardClick();
    }
  }
}

