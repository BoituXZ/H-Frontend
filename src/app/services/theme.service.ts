import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'hivefund_theme';

  // Reactive theme state using signals
  readonly currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Apply theme whenever it changes
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  /**
   * Get initial theme from localStorage or default to 'light'
   */
  private getInitialTheme(): Theme {
    try {
      const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
      return stored === 'dark' || stored === 'light' ? stored : 'light';
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
      return 'light';
    }
  }

  /**
   * Apply theme by setting 'data-theme' attribute on document.documentElement
   */
  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    this.saveThemePreference(theme);
  }

  /**
   * Save theme preference to localStorage
   */
  private saveThemePreference(theme: Theme): void {
    try {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    this.currentTheme.update((current) =>
      current === 'light' ? 'dark' : 'light',
    );
  }

  /**
   * Set theme to a specific value
   */
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  /**
   * Check if current theme is dark
   */
  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }

  /**
   * Check if current theme is light
   */
  isLight(): boolean {
    return this.currentTheme() === 'light';
  }
}
