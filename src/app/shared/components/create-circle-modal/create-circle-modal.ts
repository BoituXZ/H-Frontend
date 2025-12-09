import {
  Component,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  HostListener,
  Signal,
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
  Clock,
  PiggyBank,
  Trophy,
  Calendar,
  Info,
} from 'lucide-angular';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  CreateCircleDto,
  CircleFrequency,
} from '../../../models/circle.model';
import { CirclesService } from '../../../services/circles.service';
import { finalize, startWith } from 'rxjs';

const scaleAnimation = trigger('scale', [
  transition(':enter', [
    style({ transform: 'scale(0.95)', opacity: 0 }),
    animate(
      '200ms cubic-bezier(0.16, 1, 0.3, 1)',
      style({ transform: 'scale(1)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '150ms cubic-bezier(0.16, 1, 0.3, 1)',
      style({ transform: 'scale(0.95)', opacity: 0 }),
    ),
  ]),
]);

const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
]);

const shakeAnimation = trigger('shake', [
  transition('* => shake', [
    animate('0.5s', keyframes([
      style({ transform: 'translateX(0)', offset: 0 }),
      style({ transform: 'translateX(-4px)', offset: 0.2 }),
      style({ transform: 'translateX(4px)', offset: 0.4 }),
      style({ transform: 'translateX(-4px)', offset: 0.6 }),
      style({ transform: 'translateX(4px)', offset: 0.8 }),
      style({ transform: 'translateX(0)', offset: 1.0 })
    ]))
  ])
]);

@Component({
  selector: 'app-create-circle-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './create-circle-modal.html',
  styleUrl: './create-circle-modal.css',
  animations: [scaleAnimation, fadeInAnimation, shakeAnimation],
})
export class CreateCircleModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() circleCreated = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private circlesService = inject(CirclesService);

  // Icons
  protected readonly X = X;
  protected readonly DollarSign = DollarSign;
  protected readonly Clock = Clock;
  protected readonly PiggyBank = PiggyBank;
  protected readonly Trophy = Trophy;
  protected readonly Calendar = Calendar;
  protected readonly Info = Info;

  // State
  isLoading = signal(false);
  errorMessage = signal('');
  shakeState = signal('');

  // Form
  circleForm: FormGroup;
  protected readonly CircleFrequency = CircleFrequency;
  formValue: Signal<any>;

  constructor() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
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
        [Validators.required, Validators.min(1), Validators.max(5000)],
      ],
      frequency: [CircleFrequency.MONTHLY, [Validators.required]],
      maxMembers: [
        8,
        [Validators.required, Validators.min(2), Validators.max(20)],
      ],
      startDate: [tomorrow.toISOString().split('T')[0], [Validators.required]],
      isPublic: [false],
    });

    this.formValue = toSignal(
      this.circleForm.valueChanges.pipe(startWith(this.circleForm.value))
    );
  }

  // Smart Summary Computed Values
  cycleDuration = computed(() => {
    const val = this.formValue();
    if (!val) return '0 Months';
    
    const { maxMembers, frequency } = val;
    const members = Number(maxMembers) || 0;

    if (frequency === CircleFrequency.WEEKLY) {
      return `${members} Weeks`;
    }
    if (frequency === CircleFrequency.BI_WEEKLY) {
      return `${members * 2} Weeks`;
    }
    return `${members} Months`;
  });

  totalCommitment = computed(() => {
    const val = this.formValue();
    if (!val) return 0;
    
    const amount = Number(val.contributionAmount) || 0;
    const members = Number(val.maxMembers) || 0;
    
    return amount * members;
  });

  payoutValue = computed(() => {
    return this.totalCommitment();
  });

  // Utility methods
  getErrorMsg(fieldName: string): string {
    const field = this.circleForm.get(fieldName);
    if (!field || !field.touched || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) return 'This field is required';
    if (errors['minlength'])
      return `Minimum ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength'])
      return `Maximum ${errors['maxlength'].requiredLength} characters`;
    if (errors['min']) return `Min value: ${errors['min'].min}`;
    if (errors['max']) return `Max value: ${errors['max'].max}`;

    return 'Invalid value';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.circleForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Frequency selection
  selectFrequency(freq: CircleFrequency): void {
    this.circleForm.patchValue({ frequency: freq });
    this.circleForm.markAsDirty();
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

      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    const formValue = this.circleForm.value;

    const request: CreateCircleDto = {
      name: formValue.name.trim(),
      description: formValue.description?.trim() || undefined,
      contributionAmount: Number(formValue.contributionAmount),
      frequency: formValue.frequency,
      maxMembers: Number(formValue.maxMembers),
      isPublic: formValue.isPublic,
      // Note: startDate is used for UI calculation/preview but might not be in DTO yet
      // If backend supports it, add it here.
    };

    this.circlesService
      .createCircle(request)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.circleCreated.emit();
          this.close();
        },
        error: (err) => {
          this.errorMessage.set(
            err.error?.message || 'Failed to create circle. Please try again.',
          );
          this.shakeState.set('shake');
          setTimeout(() => this.shakeState.set(''), 500);
        },
      });
  }
}
