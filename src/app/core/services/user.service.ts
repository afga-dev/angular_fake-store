import { computed, inject, Injectable, signal } from '@angular/core';
import { API_URL } from './api.tokens';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = inject(API_URL);
  private httpClient = inject(HttpClient);

  private _user = signal<User | null>(null);

  private _isLoaded = signal<boolean>(false);
  readonly isLoaded = this._isLoaded.asReadonly();

  readonly isAuthenticated = computed(() => !!this._user());

  fetchUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/users/${id}`);
  }

  // Loads the user from localStorage if an ID exists,
  // fetches full user data from API and updates the _user signal
  async loadUserFromLocalStorage() {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      try {
        const user = await firstValueFrom(this.fetchUser(Number(storedId)));
        this._user.set(user);
      } catch {
        this._user.set(null);
      }
    }
    this._isLoaded.set(true);
  }

  setUser(user: User): void {
    localStorage.setItem('id', user.id.toString());
    this._user.set(user);
  }

  removeUser(): void {
    localStorage.removeItem('id');
    this._user.set(null);
  }
}
