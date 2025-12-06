import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { otpCodeValidator, getErrorMessage } from '../../validators/custom-validators';
import { shakeAnimation } from '../../../../shared/utils/animations';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthLayoutComponent,
    FormErrorComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './verify-otp.page.html',
  styleUrl: './verify-otp.page.css',
  animations: [shakeAnimation]
})
export class VerifyOtpPage implements OnInit {
  otpForm: FormGroup;
  userId: string = '';
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  shakeState = signal('');
  resendCooldown = signal(0);
  canResend = computed(() => this.resendCooldown() === 0);

  private cooldownInterval?: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.otpForm = this.fb.group({
      code: ['', [Validators.required, otpCodeValidator()]]
    });
  }

  ngOnInit(): void {
    // Get userId from navigation state
    const navigation = window.history.state;
    this.userId = navigation?.userId;

    if (!this.userId) {
      this.router.navigate(['/register']);
    }
  }

  get code() {
    return this.otpForm.get('code');
  }

  getErrorMsg(fieldName: string): string {
    const field = this.otpForm.get(fieldName);
    if (field && field.touched && field.errors) {
      return getErrorMessage(field.errors);
    }
    return '';
  }

  getInputClass(fieldName: string): string {
    const field = this.otpForm.get(fieldName);
    if (!field || !field.touched) {
      return 'glass-input';
    }
    return field.valid ? 'glass-input valid' : 'glass-input error';
  }

  onSubmit(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      this.shakeState.set('shake');
      setTimeout(() => this.shakeState.set(''), 500);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const code = this.otpForm.value.code;

    this.authService.verifyOtp(this.userId, code).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.successMessage.set('Verification successful! Redirecting...');
          setTimeout(() => {
            this.router.navigate(['/app/dashboard']);
          }, 1500);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Invalid OTP code. Please try again.');
        this.shakeState.set('shake');
        setTimeout(() => this.shakeState.set(''), 500);
      }
    });
  }

  resendOtp(): void {
    if (!this.canResend()) {
      return;
    }

    this.authService.resendOtp(this.userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage.set('New OTP code sent!');
          setTimeout(() => this.successMessage.set(''), 3000);
          this.startCooldown();
        }
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Failed to resend OTP. Please try again.');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  private startCooldown(): void {
    this.resendCooldown.set(60);

    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }

    this.cooldownInterval = setInterval(() => {
      const current = this.resendCooldown();
      if (current <= 1) {
        clearInterval(this.cooldownInterval);
        this.resendCooldown.set(0);
      } else {
        this.resendCooldown.set(current - 1);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }
}
