import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { StorageService } from '../../../../core/services/storage.service';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { phoneNumberValidator, getErrorMessage } from '../../validators/custom-validators';
import { shakeAnimation } from '../../../../shared/utils/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthLayoutComponent,
    FormErrorComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
  animations: [shakeAnimation]
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  shakeState = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      phoneNumber: ['', [Validators.required, phoneNumberValidator()]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  get phoneNumber() {
    return this.loginForm.get('phoneNumber');
  }

  get password() {
    return this.loginForm.get('password');
  }

  getErrorMsg(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.touched && field.errors) {
      return getErrorMessage(field.errors);
    }
    return '';
  }

  getInputClass(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.touched) {
      return 'glass-input';
    }
    return field.valid ? 'glass-input valid' : 'glass-input error';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.shakeState.set('shake');
      setTimeout(() => this.shakeState.set(''), 500);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { phoneNumber, password, rememberMe } = this.loginForm.value;

    this.authService.login(phoneNumber, password, rememberMe).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          // Check for redirect URL
          const redirectUrl = this.storageService.getRedirectUrl();
          if (redirectUrl) {
            this.storageService.removeRedirectUrl();
            this.router.navigateByUrl(redirectUrl);
          } else {
            this.router.navigate(['/app/dashboard']);
          }
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Login failed. Please check your credentials.');
        this.shakeState.set('shake');
        setTimeout(() => this.shakeState.set(''), 500);
      }
    });
  }
}
