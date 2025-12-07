import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Landing page
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.page').then((m) => m.LandingPage),
    title: 'HiveFund - Build Credit Through Community Savings',
  },

  // Auth routes (public)
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
    title: 'Register - HiveFund',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
    title: 'Login - HiveFund',
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./pages/verify-otp/verify-otp.page').then((m) => m.VerifyOtpPage),
    title: 'Verify OTP - HiveFund',
  },

  // Protected routes (require authentication)
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/app-layout/app-layout.component').then(
        (m) => m.AppLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPage,
          ),
        title: 'Dashboard - HiveFund',
      },
      {
        path: 'circles',
        loadComponent: () =>
          import('./pages/circles/circles.page').then((m) => m.CirclesPage),
        title: 'Circles - HiveFund',
      },
      {
        path: 'marketplace',
        loadComponent: () =>
          import('./pages/marketplace/marketplace.page').then(
            (m) => m.MarketplacePage,
          ),
        title: 'Marketplace - HiveFund',
      },
      {
        path: 'wallet',
        loadComponent: () =>
          import('./pages/wallet/wallet.page').then((m) => m.WalletPage),
        title: 'Wallet - HiveFund',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.page').then((m) => m.SettingsPage),
        title: 'Settings - HiveFund',
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // Wildcard route - redirect to landing
  {
    path: '**',
    redirectTo: '',
  },
];
