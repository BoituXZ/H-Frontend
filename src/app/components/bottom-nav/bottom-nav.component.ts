import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  Home,
  Users,
  Wallet,
  Store,
  Settings,
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
  protected readonly navItems: NavItem[] = [
    { label: 'Home', route: '/app/dashboard', icon: Home },
    { label: 'Circles', route: '/app/circles', icon: Users },
    // Wallet endpoint not supported by backend - commenting out
    // { label: 'Wallet', route: '/app/wallet', icon: Wallet },
    { label: 'Market', route: '/app/marketplace', icon: Store },
    { label: 'Settings', route: '/app/settings', icon: Settings },
  ];
}
