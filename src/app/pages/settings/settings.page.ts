import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-display font-bold text-text-primary mb-6">
          Settings
        </h1>

        <div class="space-y-4">
          <!-- Account Section -->
          <div class="card p-6">
            <h2 class="text-xl font-semibold text-text-primary mb-4">
              Account
            </h2>
            <div class="space-y-3">
              <button
                class="w-full text-left px-4 py-3 rounded-hive hover:bg-cream-100 transition-colors text-text-secondary"
              >
                Profile Information
              </button>
              <button
                class="w-full text-left px-4 py-3 rounded-hive hover:bg-cream-100 transition-colors text-text-secondary"
              >
                Change Password
              </button>
              <button
                class="w-full text-left px-4 py-3 rounded-hive hover:bg-cream-100 transition-colors text-text-secondary"
              >
                Notifications
              </button>
            </div>
          </div>

          <!-- Security Section -->
          <div class="card p-6">
            <h2 class="text-xl font-semibold text-text-primary mb-4">
              Security
            </h2>
            <div class="space-y-3">
              <button
                class="w-full text-left px-4 py-3 rounded-hive hover:bg-cream-100 transition-colors text-text-secondary"
              >
                Two-Factor Authentication
              </button>
              <button
                class="w-full text-left px-4 py-3 rounded-hive hover:bg-cream-100 transition-colors text-text-secondary"
              >
                Connected Devices
              </button>
            </div>
          </div>

          <!-- Logout -->
          <div class="card p-6">
            <button
              (click)="logout()"
              class="w-full btn-outline text-danger-dark border-danger hover:bg-danger-light"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SettingsPage {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
