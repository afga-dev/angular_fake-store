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

  readonly error = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false);

  showPassword = false;

  readonly signInForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.maxLength(128)]],
  });

  async submitSignInForm() {
    try {
      const signin = this.signInForm.getRawValue();
      signin.username = signin.username.trim();
      signin.password = signin.password.trim();

      if (this.signInForm.invalid || this.isLoading() || !signin) return;

      const response = await firstValueFrom(this.userService.signin(signin));
      const decodedPayload = this.userService.decodeJWT(response.token);
      const user = await firstValueFrom(
        this.userService.getUser(decodedPayload.sub)
      );
      this.userService.setUser(user);
      this.signInForm.reset();

      const returnUrl =
        this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigate([returnUrl]);
    } catch (err) {
      this.error.set('Incorrect email or password.');
      //console.log(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.signInForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }
}
