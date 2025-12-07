import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, BottomNavComponent],
  template: `
    <div class="min-h-screen bg-cream-100">
      <!-- Desktop Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content Area -->
      <div
        class="lg:ml-64 min-h-screen pb-16 lg:pb-0 transition-all duration-300"
      >
        <router-outlet></router-outlet>
      </div>

      <!-- Mobile Bottom Navigation -->
      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class MainLayoutComponent {}
