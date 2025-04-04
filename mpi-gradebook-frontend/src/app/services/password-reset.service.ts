import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = 'http://localhost:8080/api/reset-password';

  constructor(private http: HttpClient) { }

  sendResetCode(email: string): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/request?email=${encodeURIComponent(email)}`,
      null,
      { responseType: 'text' }
    );
  }

  verifyResetCode(email: string, code: string): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
      null,
      { responseType: 'text' }  
    );
  }

  resetPassword(email: string, newPassword: string): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/reset?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`,
      null,
      { responseType: 'text' }  
    );
  }
  
}