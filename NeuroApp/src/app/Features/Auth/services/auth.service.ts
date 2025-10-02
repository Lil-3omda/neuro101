import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
  userName: string;
  role: string;
}

export interface OtpResponse {
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://localhost:7284/api/Auth';

  register(data: RegisterRequest): Observable<OtpResponse> {
    return this.http.post<OtpResponse>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        this.setTokens(response.token, response.refreshToken);
        this.setUserInfo(response.email, response.userName, response.role);
      })
    );
  }

  verifyOtp(data: VerifyOtpRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-otp`, data).pipe(
      tap(response => {
        this.setTokens(response.token, response.refreshToken);
        this.setUserInfo(response.email, response.userName, response.role);
      })
    );
  }

  resendOtp(email: string): Observable<OtpResponse> {
    return this.http.post<OtpResponse>(`${this.apiUrl}/resend-otp`, { email });
  }

  private setTokens(token: string, refreshToken: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private setUserInfo(email: string, userName: string, role: string): void {
    localStorage.setItem('email', email);
    localStorage.setItem('userName', userName);
    localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
