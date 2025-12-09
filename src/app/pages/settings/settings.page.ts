import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import {
  LucideAngularModule,
  User,
  Lock,
  Bell,
  ShieldCheck,
  Smartphone,
  LogOut,
  ChevronRight,
} from 'lucide-angular';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css',
})
export class SettingsPage {
  // Icons
  protected readonly User = User;
  protected readonly Lock = Lock;
  protected readonly Bell = Bell;
  protected readonly ShieldCheck = ShieldCheck;
  protected readonly Smartphone = Smartphone;
  protected readonly LogOut = LogOut;
  protected readonly ChevronRight = ChevronRight;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
