import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NAV_ITEMS, NavItem } from '../../shared/config/navigation.config';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})
export class BottomNavComponent {
  navItems: NavItem[] = NAV_ITEMS;

  constructor() {}
}
