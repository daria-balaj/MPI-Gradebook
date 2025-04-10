import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '..//types/user.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  public currentUserSubject = new BehaviorSubject<any>(null);

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
          // this.getCurrentUser().subscribe();
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

  // getUserDetails(userId: string) {
  //   const userDetailsEndpoint = `${this.baseUrl}/api/users/${userId}`;
  //   this.http.get<User>(userDetailsEndpoint).subscribe({
  //     next: (user) => {
  //       this.currentUserSubject.next(user);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching user details:', error);
  //     },
  //   });
  // }

  getCurrentUser(): Observable<User> {
    const username = this.getUsername();

    if (!username) {
      throw new Error('User not logged in');
    }
    return this.http.get<User>(
      `${this.baseUrl}/api/users/username/${username}`
    ).pipe(
      tap((user) => this.currentUserSubject.next(user)
    ));
  }

  isTeacher(): boolean {
    return this.currentUserSubject.value?.role === 'TEACHER';
  }
  
  isStudent(): boolean {
    return this.currentUserSubject.value?.role === 'STUDENT';
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
