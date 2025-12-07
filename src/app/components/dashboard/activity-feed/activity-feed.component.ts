import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.css']
})
export class ActivityFeedComponent {
  activities = [
    { type: 'deposit', description: 'Deposit from Bank Account', date: 'Dec 7', amount: 500.00, icon: 'arrow-down-circle' },
    { type: 'transfer', description: 'Transfer to John Doe', date: 'Dec 6', amount: -50.00, icon: 'arrow-up-circle' },
    { type: 'payment', description: 'Starbucks Coffee', date: 'Dec 5', amount: -5.75, icon: 'coffee' },
    { type: 'deposit', description: 'Paycheck Received', date: 'Dec 5', amount: 1500.00, icon: 'arrow-down-circle' },
    { type: 'transfer', description: 'Transfer to Jane Smith', date: 'Dec 4', amount: -100.00, icon: 'arrow-up-circle' }
  ];
}
