import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthResult, User } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokenSignal = signal<string | null>(null);
  private readonly userSignal = signal<User | null>(null);

  readonly token = computed(() => this.tokenSignal());
  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => Boolean(this.tokenSignal() && this.userSignal()));

  constructor() {
    this.restoreFromSession();
  }

  login(email: string, password: string) {
    return this.http
      .post<ApiResponse<AuthResult>>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(tap((response) => this.setSession(response.data.accessToken, response.data.user)));
  }

  signup(name: string, email: string, password: string) {
    return this.http
      .post<ApiResponse<AuthResult>>(`${environment.apiBaseUrl}/auth/register`, { name, email, password })
      .pipe(tap((response) => this.setSession(response.data.accessToken, response.data.user)));
  }

  fetchCurrentUser() {
    return this.http
      .get<ApiResponse<User>>(`${environment.apiBaseUrl}/auth/me`)
      .pipe(tap((response) => this.userSignal.set(response.data)));
  }

  logout() {
    const token = this.tokenSignal();
    const request = token
      ? this.http.post(`${environment.apiBaseUrl}/auth/logout`, {})
      : this.http.post(`${environment.apiBaseUrl}/auth/logout`, {});

    request.subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  clearSession() {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    sessionStorage.removeItem(environment.sessionKeys.token);
    sessionStorage.removeItem(environment.sessionKeys.user);
    void this.router.navigate(['/auth']);
  }

  private setSession(token: string, user: User) {
    this.tokenSignal.set(token);
    this.userSignal.set(user);
    sessionStorage.setItem(environment.sessionKeys.token, token);
    sessionStorage.setItem(environment.sessionKeys.user, JSON.stringify(user));
  }

  private restoreFromSession() {
    const token = sessionStorage.getItem(environment.sessionKeys.token);
    const userRaw = sessionStorage.getItem(environment.sessionKeys.user);

    if (!token || !userRaw) {
      return;
    }

    try {
      const user = JSON.parse(userRaw) as User;
      this.tokenSignal.set(token);
      this.userSignal.set(user);
    } catch {
      this.clearSession();
    }
  }
}
