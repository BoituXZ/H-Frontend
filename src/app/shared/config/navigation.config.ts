export interface NavItem {
  label: string;
  route: string;
  lucideIcon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', route: '/app/dashboard', lucideIcon: 'home' },
  { label: 'Circles', route: '/app/circles', lucideIcon: 'users' },
  { label: 'Marketplace', route: '/app/marketplace', lucideIcon: 'shopping-bag' },
  { label: 'Wallet', route: '/app/wallet', lucideIcon: 'wallet' },
  { label: 'Settings', route: '/app/settings', lucideIcon: 'settings' }
];
