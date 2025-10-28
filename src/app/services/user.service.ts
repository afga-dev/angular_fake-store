import { computed, inject, Injectable, signal } from '@angular/core';
import { API_URL } from './api.tokens';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { Signin, SigninResponse } from '../models/signin.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = inject(API_URL);
  private httpClient = inject(HttpClient);

  private _user = signal<User | null>(null);

  private _isLoaded = signal(false);
  readonly isLoaded = this._isLoaded.asReadonly();

  private _isPageLoaded = signal(false);
  readonly isPageLoaded = this._isPageLoaded.asReadonly();

  readonly isAuthenticated = computed(() => !!this._user());

  fetchUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/users/${id}`);
  }

  signIn(user: Signin): Observable<SigninResponse> {
    return this.httpClient.post<SigninResponse>(
      `${this.baseUrl}/auth/login`,
      user
    );
  }

  async loadUserFromLocalStorage() {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      const user = await firstValueFrom(this.fetchUser(Number(storedId)));
      this._user.set(user);
    }
    this._isLoaded.set(true);
  }

  setUser(user: User): void {
    localStorage.setItem('id', user.id.toString());
    this._user.set(user);
  }

  setPageLoaded(state: boolean): void {
    this._isPageLoaded.set(state);
  }

  signOut(): void {
    localStorage.removeItem('id');
    this._user.set(null);
  }

  decodeJWT(token: string) {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }
}
