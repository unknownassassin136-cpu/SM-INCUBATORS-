import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  email: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AdminUser;
}

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'smi_admin_token';
  private readonly USER_KEY = 'smi_admin_user';

  currentUser = signal<AdminUser | null>(this.getStoredUser());
  token = signal<string | null>(this.getStoredToken());

  private getStoredToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private getStoredUser(): AdminUser | null {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res.success && res.token) {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.TOKEN_KEY, res.token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
          }
          this.token.set(res.token);
          this.currentUser.set(res.user);
        }
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  getAuthHeaders(): { Authorization: string } {
    const t = this.getStoredToken();
    return { Authorization: t ? `Bearer ${t}` : '' };
  }
}

