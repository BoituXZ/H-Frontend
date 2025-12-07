import { Component, signal } from '@angular/core';
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
} from 'lucide-angular';

interface NavItem {
  label: string;
  route: string;
  icon: any;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, CommonModule],
  template: `
    <aside
      [class]="
        'hidden lg:flex flex-col bg-hive-900 h-screen fixed left-0 top-0 z-40 transition-all duration-300 ' +
        (isCollapsed() ? 'w-20' : 'w-64')
      "
    >
      <!-- Logo & Toggle -->
      <div
        class="p-6 flex items-center"
        [class.justify-center]="isCollapsed()"
        [class.justify-between]="!isCollapsed()"
      >
        @if (!isCollapsed()) {
          <img src="/hivefundLogo.png" alt="HiveFund" class="h-10 w-auto" />
        }
        <button
          (click)="toggleSidebar()"
          class="p-2 rounded-lg hover:bg-hive-800 text-white transition-colors"
          [class.mx-auto]="isCollapsed()"
        >
          <lucide-angular
            [img]="isCollapsed() ? ChevronRight : ChevronLeft"
            class="w-5 h-5"
            [strokeWidth]="2"
          ></lucide-angular>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-hive-700 text-white"
            [routerLinkActiveOptions]="{
              exact: item.route === '/app/dashboard',
            }"
            [class]="
              'flex items-center gap-3 px-4 py-3 rounded-hive text-hive-200 hover:bg-hive-800 hover:text-white transition-all duration-200 ' +
              (isCollapsed() ? 'justify-center' : '')
            "
            [title]="isCollapsed() ? item.label : ''"
          >
            <lucide-angular
              [img]="item.icon"
              class="w-5 h-5 shrink-0"
              [strokeWidth]="2"
            ></lucide-angular>
            @if (!isCollapsed()) {
              <span class="font-medium font-sans">{{ item.label }}</span>
            }
          </a>
        }
      </nav>

      <!-- Footer -->
      @if (!isCollapsed()) {
        <div class="p-4">
          <div class="text-xs text-hive-400 text-center font-sans">
            HiveFund © 2025
          </div>
        </div>
      }
    </aside>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class SidebarComponent {
  readonly isCollapsed = signal(false);
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;

  protected readonly navItems: NavItem[] = [
    { label: 'Home', route: '/app/dashboard', icon: Home },
    { label: 'Circles', route: '/app/circles', icon: Users },
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
