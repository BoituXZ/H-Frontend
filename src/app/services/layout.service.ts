import { Injectable, signal, inject } from '@angular/core';
import { ThemeService, Theme } from './theme.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private themeService = inject(ThemeService);

  readonly isCollapsed = signal(false);

  toggleSidebar(): void {
    this.isCollapsed.update((value) => !value);
  }

  getSidebarWidth(): string {
    return this.isCollapsed() ? 'w-20' : 'w-64';
  }

  // Theme-related methods
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  getCurrentTheme(): Theme {
    return this.themeService.currentTheme();
  }

  isDarkTheme(): boolean {
    return this.themeService.isDark();
  }

  isLightTheme(): boolean {
    return this.themeService.isLight();
  }
}
