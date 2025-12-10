import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Home,
  Users,
  Wallet,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  HandCoins,
  Sun,
  Moon,
  Trophy,
  Banknote,
  Tag,
  BookOpen,
  ArrowRightLeft,
  Grid3x3,
} from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';

interface NavItem {
  label: string;
  route: string;
  icon: any;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private authService = inject(AuthService);
  protected layoutService = inject(LayoutService);

  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;
  protected readonly User = User;
  protected readonly Sun = Sun;
  protected readonly Moon = Moon;
  protected readonly Trophy = Trophy;
  protected readonly Banknote = Banknote;
  protected readonly Tag = Tag;
  protected readonly BookOpen = BookOpen;
  protected readonly ArrowRightLeft = ArrowRightLeft;
  protected readonly Grid3x3 = Grid3x3;

  get currentUser() {
    return this.authService.currentUser();
  }

  get isCollapsed() {
    return this.layoutService.isCollapsed;
  }

  protected readonly navItems: NavItem[] = [
    { label: 'Home', route: '/app/dashboard', icon: Home },
    { label: 'Circles', route: '/app/circles', icon: HandCoins },
    { label: 'Credit Score', route: '/app/credit', icon: Trophy },
    { label: 'Loans', route: '/app/loans', icon: Banknote },
    { label: 'Marketplace', route: '/app/marketplace', icon: Store },
    { label: 'Storefront', route: '/app/earn/storefront/manage', icon: Tag },
    { label: 'Transact', route: '/app/transact', icon: ArrowRightLeft },
    { label: 'Services', route: '/app/services', icon: Grid3x3 },
    { label: 'Learn', route: '/app/learning', icon: BookOpen },
    // Wallet endpoint not supported by backend - commenting out
    // { label: 'Wallet', route: '/app/wallet', icon: Wallet },
    { label: 'Settings', route: '/app/settings', icon: Settings },
  ];

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  getSidebarWidth(): string {
    return this.layoutService.getSidebarWidth();
  }

  toggleTheme(): void {
    this.layoutService.toggleTheme();
  }

  isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
