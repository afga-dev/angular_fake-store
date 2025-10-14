import { computed, inject, Injectable, signal } from '@angular/core';
import { API_URL } from './api.tokens';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  protected baseUrl = inject(API_URL);
  protected httpClient = inject(HttpClient);

  user = signal<User | null>(null);
  isLoaded = signal(false);

  isSignedOn = computed(() => !!this.user());

  setUser(user: User) {
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

  getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/users/${id}`);
  }
}
