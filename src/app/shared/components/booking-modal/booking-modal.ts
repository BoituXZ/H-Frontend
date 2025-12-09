import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  X,
  CreditCard,
  CheckCircle2,
} from 'lucide-angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { Gig } from '../../../models/gig.model';

const scaleAnimation = trigger('scale', [
  transition(':enter', [
    style({ transform: 'scale(0.9)', opacity: 0 }),
    animate(
      '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ transform: 'scale(1)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ transform: 'scale(0.9)', opacity: 0 }),
    ),
  ]),
]);

const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-in', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('150ms ease-out', style({ opacity: 0 }))]),
]);

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './booking-modal.html',
  styleUrl: './booking-modal.css',
  animations: [scaleAnimation, fadeInAnimation],
})
export class BookingModalComponent {
  @Input() gig!: Gig;
  @Input() bookingStatus: 'pending' | 'deposit_paid' | 'completed' = 'pending';
  @Output() closeModal = new EventEmitter<void>();
  @Output() payDeposit = new EventEmitter<void>();
  @Output() releaseRemaining = new EventEmitter<void>();

  // Icons
  protected readonly X = X;
  protected readonly CreditCard = CreditCard;
  protected readonly CheckCircle2 = CheckCircle2;

  // Computed values
  depositAmount = computed(() => this.gig.price * 0.5);
  transactionFee = computed(() => this.gig.price * 0.025);
  depositTotal = computed(() => this.depositAmount() + this.transactionFee());
  remainingAmount = computed(() => this.gig.price * 0.5);

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (event instanceof KeyboardEvent) {
      this.close();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.close();
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  onPayDeposit(): void {
    this.payDeposit.emit();
  }

  onReleaseRemaining(): void {
    this.releaseRemaining.emit();
  }
}

