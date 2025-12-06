import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
