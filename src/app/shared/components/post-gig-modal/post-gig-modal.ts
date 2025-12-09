import {
  Component,
  Output,
  EventEmitter,
  signal,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  LucideAngularModule,
  X,
  Briefcase,
  User,
} from 'lucide-angular';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { FormErrorComponent } from '../../../components/form-error/form-error.component';
import { GigCategory, GigType } from '../../../models/gig.model';

const scaleAnimation = trigger('scale', [
  transition(':enter', [
    style({ transform: 'scale(0.9)', opacity: 0 }),
    animate(
      '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ transform: 'scale(1)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ transform: 'scale(0.9)', opacity: 0 }),
    ),
  ]),
]);

const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-in', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('150ms ease-out', style({ opacity: 0 }))]),
]);

const shakeAnimation = trigger('shake', [
  transition('* => shake', [
    animate('0.5s', keyframes([
      style({ transform: 'translateX(0)', offset: 0 }),
      style({ transform: 'translateX(-10px)', offset: 0.2 }),
      style({ transform: 'translateX(10px)', offset: 0.4 }),
      style({ transform: 'translateX(-10px)', offset: 0.6 }),
      style({ transform: 'translateX(10px)', offset: 0.8 }),
      style({ transform: 'translateX(0)', offset: 1.0 })
    ]))
  ])
]);

@Component({
  selector: 'app-post-gig-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    FormErrorComponent,
  ],
  templateUrl: './post-gig-modal.html',
  styleUrl: './post-gig-modal.css',
  animations: [scaleAnimation, fadeInAnimation, shakeAnimation],
})
export class PostGigModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() gigPosted = new EventEmitter<any>();

  private fb = inject(FormBuilder);

  // Icons
  protected readonly X = X;
  protected readonly Briefcase = Briefcase;
  protected readonly User = User;

  // State
  isLoading = signal(false);
  errorMessage = signal('');
  shakeState = signal('');
  selectedType = signal<GigType>(GigType.GIG);

  // Form
  gigForm: FormGroup;
  protected readonly GigCategory = GigCategory;
  protected readonly GigType = GigType;

  constructor() {
    this.gigForm = this.fb.group({
      type: [GigType.GIG, [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(1)]],
      category: [GigCategory.ACADEMIC, [Validators.required]],
      skills: [''], // For skill posts - comma separated
    });

    // Watch type changes
    this.gigForm.get('type')?.valueChanges.subscribe((type) => {
      this.selectedType.set(type);
      if (type === GigType.SKILL) {
        this.gigForm.get('skills')?.setValidators([Validators.required]);
      } else {
        this.gigForm.get('skills')?.clearValidators();
      }
      this.gigForm.get('skills')?.updateValueAndValidity();
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (event instanceof KeyboardEvent && !this.isLoading()) {
      this.close();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay') && !this.isLoading()) {
      this.close();
    }
  }

  close(): void {
    if (!this.isLoading()) {
      this.closeModal.emit();
    }
  }

  getInputClass(fieldName: string): string {
    const field = this.gigForm.get(fieldName);
    if (!field || !field.touched) {
      return 'input-field';
    }
    return field.invalid ? 'input-field error' : 'input-field valid';
  }

  getErrorMsg(fieldName: string): string {
    const field = this.gigForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;
    if (errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (errors['minlength']) {
      return `Minimum ${errors['minlength'].requiredLength} characters required`;
    }
    if (errors['maxlength']) {
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    }
    if (errors['min']) {
      return `Minimum value is ${errors['min'].min}`;
    }
    return 'Invalid input';
  }

  onSubmit(): void {
    if (this.gigForm.invalid) {
      this.shakeState.set('shake');
      setTimeout(() => this.shakeState.set(''), 500);
      this.errorMessage.set('Please fill in all required fields correctly.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formValue = this.gigForm.value;
    const gigData = {
      ...formValue,
      skills: formValue.skills ? formValue.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
    };

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.gigPosted.emit(gigData);
      this.close();
    }, 1000);
  }
}

