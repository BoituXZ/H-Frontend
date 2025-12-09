import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  Home,
  Users,
  Wallet,
  Store,
  Settings,
  Trophy,
  Banknote,
  Tag,
  BookOpen,
} from 'lucide-angular';

interface NavItem {
  label: string;
  route: string;
  icon: any;
}

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
})
export class BottomNavComponent {
  protected readonly BookOpen = BookOpen;

  protected readonly navItems: NavItem[] = [
    { label: 'Home', route: '/app/dashboard', icon: Home },
    { label: 'Circles', route: '/app/circles', icon: Users },
    // Wallet endpoint not supported by backend - commenting out
    // { label: 'Wallet', route: '/app/wallet', icon: Wallet },
    { label: 'Credit', route: '/app/credit', icon: Trophy },
    { label: 'Loans', route: '/app/loans', icon: Banknote },
    { label: 'Learning', route: '/app/learning', icon: BookOpen },
    { label: 'Marketplace', route: '/app/marketplace', icon: Store },
    { label: 'Store', route: '/app/earn/storefront/manage', icon: Tag },
    { label: 'Settings', route: '/app/settings', icon: Settings },
  ];
}
