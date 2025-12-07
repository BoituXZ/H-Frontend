import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-balance-widget',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './balance-widget.component.html',
  styleUrls: ['./balance-widget.component.css']
})
export class BalanceWidgetComponent {
  totalBalance = 12345.67;
  currency = 'USD';
  showBalance = true;

  toggleBalanceVisibility() {
    this.showBalance = !this.showBalance;
  }
}
