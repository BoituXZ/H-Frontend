import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NAV_ITEMS, NavItem } from '../../shared/config/navigation.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isCollapsed: boolean = false;
  @Output() toggleCollapse = new EventEmitter<boolean>();

  navItems: NavItem[] = NAV_ITEMS;

  constructor() {}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggleCollapse.emit(this.isCollapsed);
  }
}
