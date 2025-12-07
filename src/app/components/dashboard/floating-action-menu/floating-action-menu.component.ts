import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-floating-action-menu',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './floating-action-menu.component.html',
  styleUrls: ['./floating-action-menu.component.css']
})
export class FloatingActionMenuComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
