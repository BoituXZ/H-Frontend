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
  template: `
    <nav
      class="lg:hidden fixed bottom-0 left-0 right-0 bg-hive-900 z-50 safe-area-bottom shadow-lg"
    >
      <div class="flex justify-around items-center h-16 px-2">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="text-white bg-hive-700"
            [routerLinkActiveOptions]="{
              exact: item.route === '/app/dashboard',
            }"
            class="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-hive-300 hover:text-white hover:bg-hive-800 transition-colors duration-200 min-w-0 flex-1"
          >
            <lucide-angular
              [img]="item.icon"
              class="w-5 h-5"
              [strokeWidth]="2"
            ></lucide-angular>
            <span
              class="text-xs font-medium truncate w-full text-center font-sans"
              >{{ item.label }}</span
            >
          </a>
        }
      </div>
    </nav>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .safe-area-bottom {
        padding-bottom: env(safe-area-inset-bottom);
      }
    `,
  ],
})
export class BottomNavComponent {
  protected readonly navItems: NavItem[] = [
    { label: 'Home', route: '/app/dashboard', icon: Home },
    { label: 'Circles', route: '/app/circles', icon: Users },
    { label: 'Wallet', route: '/app/wallet', icon: Wallet },
    { label: 'Market', route: '/app/marketplace', icon: Store },
    { label: 'Settings', route: '/app/settings', icon: Settings },
  ];
}
