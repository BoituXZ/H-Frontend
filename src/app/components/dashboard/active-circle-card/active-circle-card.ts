import { Component, Input, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, RefreshCw } from 'lucide-angular';
import {
  trigger,
  transition,
  style,
  animate,
  stagger,
  query,
} from '@angular/animations';

interface CircleMember {
  id: string;
  initials: string;
  status: 'paid' | 'pending' | 'received';
  isCurrentUser: boolean;
}

interface ActiveCircle {
  name: string;
  round: string;
  contributionAmount: number;
  potValue: number;
  nextPayoutDate: string;
  members: CircleMember[];
}

@Component({
  selector: 'app-active-circle-card',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './active-circle-card.html',
  styleUrl: './active-circle-card.css',
  animations: [
    trigger('staggerMembers', [
      transition(':enter', [
        query(
          '.member-avatar',
          [
            style({ opacity: 0 }),
            stagger(30, [animate('200ms ease-out', style({ opacity: 1 }))]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class ActiveCircleCard implements OnInit, OnDestroy {
  readonly RefreshCw = RefreshCw;

  @Input() circle: ActiveCircle | null = null;

  countdown = signal('');
  private countdownInterval?: any;

  ngOnInit() {
    if (this.circle?.nextPayoutDate) {
      this.startCountdown();
    }
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    const updateCountdown = () => {
      if (!this.circle?.nextPayoutDate) return;

      const now = new Date().getTime();
      const target = new Date(this.circle.nextPayoutDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        this.countdown.set('Payout Due!');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      this.countdown.set(`${days}d ${hours}h ${minutes}m`);
    };

    updateCountdown();
    this.countdownInterval = setInterval(updateCountdown, 60000); // Update every minute
  }

  getStatusClass(status: string, isCurrentUser: boolean): string {
    if (isCurrentUser) return 'ring-2 ring-honey-500 ring-offset-2';
    if (status === 'paid') return 'border-2 border-green-500';
    if (status === 'received') return 'border-2 border-hive-500';
    return 'border-2 border-gray-300 opacity-60';
  }

  getStatusBg(status: string): string {
    if (status === 'paid') return 'bg-green-100 text-green-700';
    if (status === 'received') return 'bg-hive-100 text-hive-700';
    return 'bg-gray-100 text-gray-500';
  }

  getPaidCount(): number {
    return this.circle?.members.filter((m) => m.status === 'paid').length || 0;
  }

  getTotalMembers(): number {
    return this.circle?.members.length || 0;
  }
}
