import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { slideDownAnimation } from '../../../../shared/utils/animations';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (message) {
      <div class="text-danger-dark text-sm mt-1" @slideDown>
        {{ message }}
      </div>
    }
  `,
  animations: [slideDownAnimation]
})
export class FormErrorComponent {
  @Input() message: string = '';
}
