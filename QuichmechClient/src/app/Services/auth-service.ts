import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../Models/AuthModel';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../Environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value && !!this.getToken();
  }

  public get userRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  public isCustomer(): boolean {
    return this.userRole === 'Customer';
  }

  public isMechanic(): boolean {
    return this.userRole === 'Mechanic';
  }

  public isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthResponse(response);
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          this.handleAuthResponse(response);
        })
      );
  }

  private handleAuthResponse(response: AuthResponse): void {
    const user: User = {
      id: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      phoneNumber: '',
      role: response.role
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', response.token);
    localStorage.setItem(
      'tokenExpiry',
      new Date(response.expiresAt).toISOString()
    );
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true;

    const expiryDate = new Date(expiry);
    return expiryDate <= new Date();
  }
}
