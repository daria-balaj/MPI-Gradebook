import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map(user => {
        if (user?.role === 'STUDENT') {
          return true;
        }
        // If user is a teacher, redirect to teacher dashboard
        if (user?.role === 'TEACHER') {
          this.router.navigate(['/teacher/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}