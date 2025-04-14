import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mpi-gradebook-frontend';
  currentYear: number = new Date().getFullYear();
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.getIsLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }
  navigateToDashboard(): void {
    if (this.authService.isTeacher()) {
      this.router.navigate(['/teacher/dashboard']);
    }
    else if (this.authService.isStudent()) {
      this.router.navigate(['/student/dashboard']);
    }
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?',
        singleButton: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
