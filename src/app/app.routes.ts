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
        path: 'transact',
        loadComponent: () =>
          import('./pages/transact/transact.page').then((m) => m.TransactPage),
        title: 'Transact - HiveFund',
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./pages/services/services.component').then((m) => m.ServicesComponent),
        title: 'Services - HiveFund',
      },
      {
        path: 'learning',
        loadComponent: () =>
          import('./pages/learning/learning-library/learning-library.component').then(
            (m) => m.LearningLibraryComponent,
          ),
        title: 'Learning - HiveFund',
      },
      {
        path: 'learning/lesson/:id',
        loadComponent: () =>
          import('./pages/learning/lesson-viewer/lesson-viewer.component').then(
            (m) => m.LessonViewerComponent,
          ),
        title: 'Lesson - HiveFund',
      },
      {
        path: 'learning/progress',
        loadComponent: () =>
          import('./pages/learning/my-progress/my-progress.component').then(
            (m) => m.MyProgressComponent,
          ),
        title: 'My Progress - HiveFund',
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
        path: 'earn/marketplace',
        loadComponent: () =>
          import('./pages/marketplace/browse-gigs/browse-gigs.component').then(
            (m) => m.BrowseGigsComponent,
          ),
        title: 'Marketplace - HiveFund',
      },
      {
        path: 'earn/marketplace/create',
        loadComponent: () =>
          import('./pages/marketplace/create-gig/create-gig.component').then(
            (m) => m.CreateGigComponent,
          ),
        title: 'Create Gig - HiveFund',
      },
      {
        path: 'earn/marketplace/bookings',
        loadComponent: () =>
          import('./pages/marketplace/my-bookings/my-bookings.component').then(
            (m) => m.MyBookingsComponent,
          ),
        title: 'My Bookings - HiveFund',
      },
      {
        path: 'earn/marketplace/:gigId',
        loadComponent: () =>
          import('./pages/marketplace/gig-detail/gig-detail.component').then(
            (m) => m.GigDetailComponent,
          ),
        title: 'Gig Details - HiveFund',
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
