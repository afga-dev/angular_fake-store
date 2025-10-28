import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

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

      const response = await firstValueFrom(this.userService.signIn(signin));
      const decodedPayload = this.userService.decodeJWT(response.token);
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
      //console.log(err);
    } finally {
      this._isLoading.set(false);
    }
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.signInForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }
}
