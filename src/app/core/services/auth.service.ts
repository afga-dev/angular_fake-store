import { inject, Injectable, signal } from '@angular/core';
import { Signin, SigninResponse } from '../models/signin.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api.tokens';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = inject(API_URL);
  private httpClient = inject(HttpClient);

  private userService = inject(UserService);

  private _isPageLoaded = signal<boolean>(false);
  readonly isPageLoaded = this._isPageLoaded.asReadonly();

  // Sends sign in credentials to the API and returns the response
  signIn(user: Signin): Observable<SigninResponse> {
    return this.httpClient.post<SigninResponse>(
      `${this.baseUrl}/auth/login`,
      user
    );
  }

  signOut(): void {
    this.userService.removeUser();
  }

  // Decodes a JWT token
  decodeJWT(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Invalid JWT:', e);
      return null;
    }
  }

  setPageLoaded(state: boolean): void {
    this._isPageLoaded.set(state);
  }
}
