import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly isCollapsed = signal(false);

  toggleSidebar(): void {
    this.isCollapsed.update((value) => !value);
  }

  getSidebarWidth(): string {
    return this.isCollapsed() ? 'w-20' : 'w-64';
  }
}
