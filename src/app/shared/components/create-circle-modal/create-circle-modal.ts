import {
  Component,
  Output,
  EventEmitter,
  signal,
  computed,
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
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Repeat,
  Sparkles,
} from 'lucide-angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormErrorComponent } from '../../../components/form-error/form-error.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

export interface CreateCircleRequest {
  name: string;
  description?: string;
  contributionAmount: number;
  frequency: 'weekly' | 'monthly';
  maxMembers: number;
  startDate: string;
  positionMethod: 'lottery' | 'vote';
}

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
    animate(
      '0.5s',
      style({
        transform: 'translateX(0)',
      }),
    ),
    animate(
      '0.1s',
      style({
        transform: 'translateX(-10px)',
      }),
    ),
    animate(
      '0.1s',
      style({
        transform: 'translateX(10px)',
      }),
    ),
    animate(
      '0.1s',
      style({
        transform: 'translateX(-10px)',
      }),
    ),
    animate(
      '0.1s',
      style({
        transform: 'translateX(10px)',
      }),
    ),
    animate(
      '0.1s',
      style({
        transform: 'translateX(0)',
      }),
    ),
  ]),
]);

@Component({
  selector: 'app-create-circle-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    FormErrorComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './create-circle-modal.html',
  styleUrl: './create-circle-modal.css',
  animations: [scaleAnimation, fadeInAnimation, shakeAnimation],
})
export class CreateCircleModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitCircle = new EventEmitter<CreateCircleRequest>();

  private fb = inject(FormBuilder);

  // Icons
  protected readonly X = X;
  protected readonly DollarSign = DollarSign;
  protected readonly Users = Users;
  protected readonly Calendar = Calendar;
  protected readonly TrendingUp = TrendingUp;
  protected readonly Repeat = Repeat;
  protected readonly Sparkles = Sparkles;

  // State
  isLoading = signal(false);
  errorMessage = signal('');
  shakeState = signal('');

  // Form
  circleForm: FormGroup;

  constructor() {
    // Get tomorrow's date as minimum
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    this.circleForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: ['', [Validators.maxLength(200)]],
      contributionAmount: [
        20,
        [Validators.required, Validators.min(5), Validators.max(1000)],
      ],
      frequency: ['monthly', [Validators.required]],
      maxMembers: [
        8,
        [Validators.required, Validators.min(2), Validators.max(12)],
      ],
      startDate: ['', [Validators.required, this.futureDateValidator()]],
      positionMethod: ['lottery', [Validators.required]],
    });
  }

  // Future date validator
  private futureDateValidator() {
    return (control: any) => {
      if (!control.value) return null;

      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        return { futureDate: true };
      }
      return null;
    };
  }

  // Smart Summary Computed Values
  cycleDuration = computed(() => {
    const members = this.circleForm?.get('maxMembers')?.value || 8;
    const frequency = this.circleForm?.get('frequency')?.value || 'monthly';

    if (frequency === 'weekly') {
      return `${members} Weeks`;
    }
    return `${members} Months`;
  });

  totalCommitment = computed(() => {
    const amount = this.circleForm?.get('contributionAmount')?.value || 0;
    const members = this.circleForm?.get('maxMembers')?.value || 8;
    return amount * members;
  });

  payoutValue = computed(() => {
    return this.totalCommitment();
  });

  // Form getters for template
  get name() {
    return this.circleForm.get('name');
  }

  get description() {
    return this.circleForm.get('description');
  }

  get contributionAmount() {
    return this.circleForm.get('contributionAmount');
  }

  get frequency() {
    return this.circleForm.get('frequency');
  }

  get maxMembers() {
    return this.circleForm.get('maxMembers');
  }

  get startDate() {
    return this.circleForm.get('startDate');
  }

  get positionMethod() {
    return this.circleForm.get('positionMethod');
  }

  // Utility methods
  getErrorMsg(fieldName: string): string {
    const field = this.circleForm.get(fieldName);
    if (!field || !field.touched || !field.errors) return '';

    const errors = field.errors;

    if (errors['required'])
      return `${this.getFieldLabel(fieldName)} is required`;
    if (errors['minLength'])
      return `Minimum ${errors['minLength'].requiredLength} characters required`;
    if (errors['maxLength'])
      return `Maximum ${errors['maxLength'].requiredLength} characters allowed`;
    if (errors['min']) return `Minimum value is $${errors['min'].min}`;
    if (errors['max']) return `Maximum value is $${errors['max'].max}`;
    if (errors['futureDate']) return 'Date must be in the future';

    return 'Invalid value';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      name: 'Circle name',
      contributionAmount: 'Contribution amount',
      frequency: 'Frequency',
      maxMembers: 'Max members',
      startDate: 'Start date',
      positionMethod: 'Position method',
    };
    return labels[fieldName] || fieldName;
  }

  getInputClass(fieldName: string): string {
    const field = this.circleForm.get(fieldName);
    if (!field || !field.touched) {
      return 'input-field';
    }
    return field.valid ? 'input-field valid' : 'input-field error';
  }

  // Frequency selection
  selectFrequency(freq: 'weekly' | 'monthly'): void {
    this.circleForm.patchValue({ frequency: freq });
  }

  // Position method selection
  selectPositionMethod(method: 'lottery' | 'vote'): void {
    this.circleForm.patchValue({ positionMethod: method });
  }

  // Close handlers
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    if (!this.isLoading()) {
      this.closeModal.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.close();
  }

  // Form submission
  onSubmit(): void {
    if (this.circleForm.invalid) {
      this.shakeState.set('shake');
      setTimeout(() => this.shakeState.set(''), 500);

      // Mark all as touched to show errors
      Object.keys(this.circleForm.controls).forEach((key) => {
        this.circleForm.get(key)?.markAsTouched();
      });

      this.errorMessage.set('Please fill in all required fields correctly');
      return;
    }

    this.errorMessage.set('');
    const formValue = this.circleForm.value;

    const request: CreateCircleRequest = {
      name: formValue.name.trim(),
      description: formValue.description?.trim() || undefined,
      contributionAmount: Number(formValue.contributionAmount),
      frequency: formValue.frequency,
      maxMembers: Number(formValue.maxMembers),
      startDate: formValue.startDate,
      positionMethod: formValue.positionMethod,
    };

    this.submitCircle.emit(request);
  }
}
