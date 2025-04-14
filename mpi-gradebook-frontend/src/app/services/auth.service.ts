import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '..//types/user.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  public currentUserSubject = new BehaviorSubject<User | null>(null);

  signup(userData: Partial<User>): Observable<any> {
    console.log(userData);
    return this.http.post(`${this.baseUrl}/api/users`, userData);
  }

  login(username: string, password: string): Observable<string> {
    const loginEndpoint = `${this.baseUrl}/api/auth/token`;
    return this.http
      .post<string>(
        loginEndpoint,
        { username, password },
        { responseType: 'text' as 'json' }
      )
      .pipe(
        tap((token: string) => {
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
          this.getCurrentUser();
        })
      );
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  setIsLoggedIn(loggedIn: boolean): void {
    this.isLoggedInSubject.next(loggedIn);
  }

  setCurrentUser(): Observable<User> {
    const username = this.getUsername();

    if (!username) {
      throw new Error('User not logged in');
    }
    return this.http.get<User>(
      `${this.baseUrl}/api/users/username/${username}`
    );
  }

  getCurrentUser(): Observable<User | null> {
    if (this.currentUserSubject.value) {
      return this.currentUserSubject.asObservable();
    }
    
    return this.setCurrentUser().pipe(
      tap((user: User) => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Error fetching current user:', error);
        return of(null);
      })
    );
  }

  isTeacher(): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      const username = this.getUsername();
      if (!username) return false;
      
      this.getCurrentUser().subscribe();
      return false;
    }
    return currentUser.role === 'TEACHER';
  }
  
  isStudent(): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      // If no user is set, try to get it synchronously from localStorage
      const username = this.getUsername();
      if (!username) return false;
      
      // Trigger async user fetch for future calls
      this.getCurrentUser().subscribe();
      return false;
    }
    return currentUser.role === 'STUDENT';
  }

  checkUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/api/users/check-username`, {
      params: { username },
    });
  }

  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/api/users/check-email`, {
      params: { email },
    });
  }
}
