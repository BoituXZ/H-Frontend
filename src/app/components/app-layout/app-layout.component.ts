import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, BottomNavComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
})
export class AppLayoutComponent {
  sidebarCollapsed = false;

  onSidebarToggle(isCollapsed: boolean): void {
    this.sidebarCollapsed = isCollapsed;
  }
}
