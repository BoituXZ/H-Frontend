import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeroCardComponent } from '../../components/dashboard/hero-card/hero-card.component';
import { BalanceWidgetComponent } from '../../components/dashboard/balance-widget/balance-widget.component';
import { CircleCarouselComponent } from '../../components/dashboard/circle-carousel/circle-carousel.component';
import { UpcomingPaymentsComponent } from '../../components/dashboard/upcoming-payments/upcoming-payments.component';
import { ActivityFeedComponent } from '../../components/dashboard/activity-feed/activity-feed.component';
import { FloatingActionMenuComponent } from '../../components/dashboard/floating-action-menu/floating-action-menu.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroCardComponent,
    BalanceWidgetComponent,
    CircleCarouselComponent,
    UpcomingPaymentsComponent,
    ActivityFeedComponent,
    FloatingActionMenuComponent
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css'
})
export class DashboardPage {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get user() {
    return this.authService.currentUser;
  }

  logout(): void {
    this.authService.logout();
  }
}
