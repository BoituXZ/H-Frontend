import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  Home,
  Users,
  ArrowRightLeft,
  Wallet,
  Menu,
  Banknote,
  ShieldCheck,
  Briefcase,
  ShoppingBag,
  BookOpen,
  User,
  X
} from 'lucide-angular';

@Component({
  selector: 'app-mobile-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.css'
})
export class MobileNavbarComponent {
  isMenuOpen: WritableSignal<boolean> = signal(false);

  // Icons
  readonly Home = Home;
  readonly Users = Users;
  readonly ArrowRightLeft = ArrowRightLeft;
  readonly Wallet = Wallet;
  readonly Menu = Menu;
  readonly Banknote = Banknote;
  readonly ShieldCheck = ShieldCheck;
  readonly Briefcase = Briefcase;
  readonly ShoppingBag = ShoppingBag;
  readonly BookOpen = BookOpen;
  readonly User = User;
  readonly X = X;

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
