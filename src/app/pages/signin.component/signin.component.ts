import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  protected formBuilder = inject(FormBuilder);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected userService = inject(UserService);

  protected error = signal<string | null>(null);
  protected isLoading = signal<boolean>(false);

  protected showPassword = false;

  readonly signInForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  protected async submitSignInForm() {
    try {
      const signin = this.signInForm.getRawValue();

      if (this.signInForm.invalid || this.isLoading() || !signin) return;

      const response = await firstValueFrom(this.userService.signin(signin));
      const decodedPayload = this.decodeJWT(response.token);
      const user = await firstValueFrom(this.userService.getUser(decodedPayload.sub));
      this.userService.setUser(user);
      this.signInForm.reset();

      const returnUrl =
        this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigate([returnUrl]);
    } catch (err) {
      this.error.set(`Email and/or password doesn't match.`);
      //console.log(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected decodeJWT(token: string) {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  protected hasError(controlName: string, error: string) {
    const control = this.signInForm.get(controlName);
    return !!(control?.touched && control?.hasError(error));
  }
}
