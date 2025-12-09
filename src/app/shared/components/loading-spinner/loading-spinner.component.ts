import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [class]="containerClass">
      <div
        class="spinner"
        [style.width.px]="size"
        [style.height.px]="size"
      ></div>
      @if (message) {
        <span class="ml-3 text-text-secondary">{{ message }}</span>
      }
    </div>
  `,
  styles: [
    `
      .spinner {
        border: 3px solid rgba(255, 184, 0, 0.1);
        border-top-color: var(--color-gold-500);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  @Input() size: number = 40;
  @Input() message: string = '';
  @Input() containerClass: string = '';
}
