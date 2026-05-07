import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss'
})
export class AuthPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSignup = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  showPassword = false;

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly signupForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  private readonly loginTouchedSignal = toSignal(this.loginForm.statusChanges, {
    initialValue: this.loginForm.status
  });

  private readonly signupTouchedSignal = toSignal(this.signupForm.statusChanges, {
    initialValue: this.signupForm.status
  });

  readonly activeForm = computed(() => (this.isSignup() ? this.signupForm : this.loginForm));

  readonly formTouched = computed(() => {
    this.loginTouchedSignal();
    this.signupTouchedSignal();
    const form = this.activeForm();
    return form.touched || form.dirty;
  });

  readonly signupTouched = computed(() => {
    this.signupTouchedSignal();
    return this.signupForm.controls.name.touched || this.signupForm.controls.name.dirty;
  });

  toggleMode() {
    this.isSignup.set(!this.isSignup());
    this.errorMessage.set('');
  }

  submit() {
    const form = this.activeForm();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    const request$ = this.isSignup()
      ? this.authService.signup(
          this.signupForm.controls.name.value,
          this.signupForm.controls.email.value,
          this.signupForm.controls.password.value
        )
      : this.authService.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.submitting.set(false);
        this.errorMessage.set(error?.error?.error?.message ?? 'Authentication failed');
      }
    });
  }
}
