import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private authService = inject(AuthService);
  private userService = inject(UserService);

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  showPassword = false;

  readonly signInForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.maxLength(128)]],
  });

  async onSubmit() {
    try {
      const signin = this.signInForm.getRawValue();
      signin.username = signin.username.trim();
      signin.password = signin.password.trim();

      if (this.signInForm.invalid || this._isLoading() || !signin) return;

      this._isLoading.set(true);

      const response = await firstValueFrom(this.authService.signIn(signin));
      const decodedPayload = this.authService.decodeJWT(response.token);
      const user = await firstValueFrom(
        this.userService.fetchUser(decodedPayload.sub)
      );
      this.userService.setUser(user);
      this.signInForm.reset();

      const returnUrl =
        this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigate([returnUrl]);
    } catch (err) {
      this._error.set('Incorrect email or password.');
      // console.error(err);
    } finally {
      this._isLoading.set(false);
    }
  }

  // Helper for form validation state
  hasError(controlName: string, error: string): boolean {
    const control = this.signInForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }
}
