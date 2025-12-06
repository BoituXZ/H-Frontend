import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Landing page
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.page').then((m) => m.LandingPage),
    title: 'HiveFund - Build Credit Through Community Savings'
  },

  // Auth routes (public)
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.page').then((m) => m.RegisterPage),
    title: 'Register - HiveFund'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
    title: 'Login - HiveFund'
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./features/auth/pages/verify-otp/verify-otp.page').then((m) => m.VerifyOtpPage),
    title: 'Verify OTP - HiveFund'
  },

  // Protected routes (require authentication)
  {
    path: 'app',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
        title: 'Dashboard - HiveFund'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Wildcard route - redirect to landing
  {
    path: '**',
    redirectTo: ''
  }
];
