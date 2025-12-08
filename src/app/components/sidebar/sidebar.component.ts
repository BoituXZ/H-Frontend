import { Component, signal, inject } from '@angular/core';
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
} from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

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

  readonly isCollapsed = signal(false);
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;
  protected readonly User = User;

  get currentUser() {
    return this.authService.currentUser();
  }

  protected readonly navItems: NavItem[] = [
    { label: 'Home', route: '/app/dashboard', icon: Home },
    { label: 'Circles', route: '/app/circles', icon: HandCoins },
    { label: 'Wallet', route: '/app/wallet', icon: Wallet },
    { label: 'Marketplace', route: '/app/marketplace', icon: Store },
    { label: 'Settings', route: '/app/settings', icon: Settings },
  ];

  toggleSidebar(): void {
    this.isCollapsed.update((value) => !value);
  }

  getSidebarWidth(): string {
    return this.isCollapsed() ? 'w-20' : 'w-64';
  }
}
