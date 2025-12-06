import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

/**
 * Validator for Zimbabwe phone numbers
 * Accepts formats: 263XXXXXXXXX or 0XXXXXXXXX
 */
export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const phoneNumber = control.value.toString().trim();

    // Pattern for Zimbabwe phone numbers
    // Either starts with 263 followed by 9 digits
    // Or starts with 0 followed by 9 digits
    const pattern = /^(263[0-9]{9}|0[0-9]{9})$/;

    if (!pattern.test(phoneNumber)) {
      return {
        invalidPhone: {
          value: control.value,
          message: 'Phone number must be in format 0XXXXXXXXX or 263XXXXXXXXX'
        }
      };
    }

    return null;
  };
}

/**
 * Validator for password strength
 * Requires: min 8 characters, at least 1 uppercase, 1 lowercase, 1 number
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const password = control.value.toString();
    const requirements: string[] = [];

    // Check minimum length
    if (password.length < 8) {
      requirements.push('At least 8 characters');
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      requirements.push('One uppercase letter');
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      requirements.push('One lowercase letter');
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
      requirements.push('One number');
    }

    if (requirements.length > 0) {
      return {
        weakPassword: {
          requirements,
          message: `Password must contain: ${requirements.join(', ')}`
        }
      };
    }

    return null;
  };
}

/**
 * Validator to check if two password fields match
 * Use this as a form group validator
 */
export function passwordsMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;

    const password = formGroup.get(passwordField);
    const confirmPassword = formGroup.get(confirmPasswordField);

    if (!password || !confirmPassword) {
      return null;
    }

    // Don't validate if either field is empty
    if (!password.value || !confirmPassword.value) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      // Set error on confirm password field
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Clear the error if passwords match
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    }

    return null;
  };
}

/**
 * Validator for OTP code
 * Requires exactly 6 digits
 */
export function otpCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const otpCode = control.value.toString().trim();

    // Must be exactly 6 digits
    const pattern = /^[0-9]{6}$/;

    if (!pattern.test(otpCode)) {
      return {
        invalidOtp: {
          value: control.value,
          message: 'OTP code must be exactly 6 digits'
        }
      };
    }

    return null;
  };
}

/**
 * Helper function to get error message from validation errors
 */
export function getErrorMessage(errors: ValidationErrors | null): string {
  if (!errors) {
    return '';
  }

  if (errors['required']) {
    return 'This field is required';
  }

  if (errors['email']) {
    return 'Please enter a valid email address';
  }

  if (errors['minlength']) {
    const minLength = errors['minlength'].requiredLength;
    return `Must be at least ${minLength} characters`;
  }

  if (errors['maxlength']) {
    const maxLength = errors['maxlength'].requiredLength;
    return `Must not exceed ${maxLength} characters`;
  }

  if (errors['invalidPhone']) {
    return errors['invalidPhone'].message;
  }

  if (errors['weakPassword']) {
    return errors['weakPassword'].message;
  }

  if (errors['passwordMismatch']) {
    return 'Passwords do not match';
  }

  if (errors['invalidOtp']) {
    return errors['invalidOtp'].message;
  }

  return 'Invalid input';
}
