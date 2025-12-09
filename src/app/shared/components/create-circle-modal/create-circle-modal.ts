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
  Users,
  TrendingUp,
  Repeat,
  Sparkles,
  Eye,
  Lock,
} from 'lucide-angular';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { FormErrorComponent } from '../../../components/form-error/form-error.component';
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
  @Output() circleCreated = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private circlesService = inject(CirclesService);

  // Icons
  protected readonly X = X;
  protected readonly DollarSign = DollarSign;
  protected readonly Users = Users;
  protected readonly TrendingUp = TrendingUp;
  protected readonly Repeat = Repeat;
  protected readonly Sparkles = Sparkles;
  protected readonly Eye = Eye;
  protected readonly Lock = Lock;

  // State
  isLoading = signal(false);
  errorMessage = signal('');
  shakeState = signal('');

  // Form
  circleForm: FormGroup;
  protected readonly CircleFrequency = CircleFrequency;
  formValue: Signal<any>;

  constructor() {
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
        [Validators.required, Validators.min(1), Validators.max(1000)],
      ],
      frequency: [CircleFrequency.MONTHLY, [Validators.required]],
      maxMembers: [
        8,
        [Validators.required, Validators.min(4), Validators.max(10)],
      ],
      isPublic: [false],
    });

    this.formValue = toSignal(
      this.circleForm.valueChanges.pipe(startWith(this.circleForm.value))
    );
  }

  // Smart Summary Computed Values
  cycleDuration = computed(() => {
    const { maxMembers, frequency } = this.formValue();

    if (frequency === CircleFrequency.WEEKLY) {
      return `${maxMembers} Weeks`;
    }
    if (frequency === CircleFrequency.BI_WEEKLY) {
      return `${maxMembers * 2} Weeks`;
    }
    return `${maxMembers} Months`;
  });

  totalCommitment = computed(() => {
    const { contributionAmount, maxMembers } = this.formValue();
    return contributionAmount * maxMembers;
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

  // Utility methods
  getErrorMsg(fieldName: string): string {
    const field = this.circleForm.get(fieldName);
    if (!field || !field.touched || !field.errors) return '';

    const errors = field.errors;

    if (errors['required'])
      return `${this.getFieldLabel(fieldName)} is required`;
    if (errors['minlength'])
      return `Minimum ${errors['minlength'].requiredLength} characters required`;
    if (errors['maxlength'])
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    if (errors['min']) return `Minimum value is $${errors['min'].min}`;
    if (errors['max']) return `Maximum value is $${errors['max'].max}`;

    return 'Invalid value';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      name: 'Circle name',
      contributionAmount: 'Contribution amount',
      frequency: 'Frequency',
      maxMembers: 'Max members',
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
  selectFrequency(freq: CircleFrequency): void {
    this.circleForm.patchValue({ frequency: freq });
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
    this.isLoading.set(true);

    const formValue = this.circleForm.value;

    const request: CreateCircleDto = {
      name: formValue.name.trim(),
      description: formValue.description?.trim() || undefined,
      contributionAmount: Number(formValue.contributionAmount),
      frequency: formValue.frequency,
      maxMembers: Number(formValue.maxMembers),
      isPublic: formValue.isPublic,
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
            err.error?.message || 'An unexpected error occurred.',
          );
          this.shakeState.set('shake');
          setTimeout(() => this.shakeState.set(''), 500);
        },
      });
  }
}
