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

  private user = signal<User | null>(null);
  private isLoaded = signal(false);
  readonly getIsLoaded = this.isLoaded.asReadonly();

  readonly isSignedOn = computed(() => !!this.user());

  getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/users/${id}`);
  }

  signin(user: Signin): Observable<SigninResponse> {
    return this.httpClient.post<SigninResponse>(
      `${this.baseUrl}/auth/login`,
      user
    );
  }

  setUser(user: User): void {
    localStorage.setItem('id', user.id.toString());
    this.user.set(user);
  }

  async getUserFromLocalStorage() {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      const user = await firstValueFrom(this.getUser(Number(storedId)));
      this.user.set(user);
    }
    this.isLoaded.set(true);
  }

  onSignOut(): void {
    localStorage.removeItem('id');
    this.user.set(null);
  }

  decodeJWT(token: string) {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }
}
