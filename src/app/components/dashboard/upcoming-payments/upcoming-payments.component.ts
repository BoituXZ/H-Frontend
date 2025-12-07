import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-upcoming-payments',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './upcoming-payments.component.html',
  styleUrls: ['./upcoming-payments.component.css']
})
export class UpcomingPaymentsComponent {
  payments = [
    { name: 'Netflix Subscription', date: 'Dec 15', amount: 15.99, icon: 'tv' },
    { name: 'Spotify Family', date: 'Dec 20', amount: 16.99, icon: 'music' },
    { name: 'Gym Membership', date: 'Dec 25', amount: 40.00, icon: 'dumbbell' },
    { name: 'Rent', date: 'Jan 1', amount: 1200.00, icon: 'home' }
  ];
}
