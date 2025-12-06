import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import {
  phoneNumberValidator,
  passwordStrengthValidator,
  passwordsMatchValidator,
  getErrorMessage
} from '../../validators/custom-validators';
import { shakeAnimation } from '../../../../shared/utils/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthLayoutComponent,
    FormErrorComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.css',
  animations: [shakeAnimation]
})
export class RegisterPage {
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  shakeState = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, phoneNumberValidator()]],
      ecocashNumber: ['', [Validators.required, phoneNumberValidator()]],
      password: ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordsMatchValidator('password', 'confirmPassword') });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }

  get ecocashNumber() {
    return this.registerForm.get('ecocashNumber');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  getErrorMsg(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.touched && field.errors) {
      return getErrorMessage(field.errors);
    }
    return '';
  }

  getInputClass(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.touched) {
      return 'glass-input';
    }
    return field.valid ? 'glass-input valid' : 'glass-input error';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.shakeState.set('shake');
      setTimeout(() => this.shakeState.set(''), 500);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { confirmPassword, ...formData } = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.userId) {
          this.router.navigate(['/verify-otp'], {
            state: { userId: response.userId }
          });
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Registration failed. Please try again.');
        this.shakeState.set('shake');
        setTimeout(() => this.shakeState.set(''), 500);
      }
    });
  }
}
