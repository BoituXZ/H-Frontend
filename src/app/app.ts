import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('H-Frontend');
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    // Initialize theme service to ensure it's active
    console.log('Current theme:', this.themeService.currentTheme());
  }
}
