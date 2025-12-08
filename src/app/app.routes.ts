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
  // OTP verification not supported by backend - commenting out
  // {
  //   path: 'verify-otp',
  //   loadComponent: () =>
  //     import('./pages/verify-otp/verify-otp.page').then((m) => m.VerifyOtpPage),
  //   title: 'Verify OTP - HiveFund',
  // },

  // Protected routes (require authentication)
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
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
        path: 'circles/:id',
        loadComponent: () =>
          import('./pages/circles/circle-detail/circle-detail.page').then(
            (m) => m.CircleDetailPage,
          ),
        title: 'Circle Details - HiveFund',
      },
      {
        path: 'wallet',
        loadComponent: () =>
          import('./pages/wallet/wallet.page').then((m) => m.WalletPage),
        title: 'Wallet - HiveFund',
      },
      {
        path: 'credit',
        loadComponent: () =>
          import('./pages/credit/credit.page').then((m) => m.CreditPage),
        title: 'Credit Score - HiveFund',
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./pages/loans/loans.component').then((m) => m.LoansComponent),
        title: 'Loan Hub - HiveFund',
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
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.page').then((m) => m.SettingsPage),
        title: 'Settings - HiveFund',
      },
      {
        path: 'earn/storefront',
        redirectTo: 'earn/storefront/manage',
        pathMatch: 'full',
      },
      {
        path: 'earn/storefront/create',
        loadComponent: () =>
          import('./pages/storefront/create-storefront/create-storefront.component').then(
            (m) => m.CreateStorefrontComponent,
          ),
        title: 'Create Storefront - HiveFund',
      },
      {
        path: 'earn/storefront/manage',
        loadComponent: () =>
          import('./pages/storefront/manage-storefront/manage-storefront.component').then(
            (m) => m.ManageStorefrontComponent,
          ),
        title: 'Manage Storefront - HiveFund',
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // Public routes (outside MainLayoutComponent)
  {
    path: 'store/:slug',
    loadComponent: () =>
      import('./pages/storefront/public-storefront/public-storefront.component').then(
        (m) => m.PublicStorefrontComponent,
      ),
    title: 'Storefront - HiveFund',
  },

  // Wildcard route - redirect to landing
  {
    path: '**',
    redirectTo: '',
  },
];
