import { Component, OnInit } from '@angular/core';
import { PasswordResetService } from '../../services/password-reset.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  passwordMismatch: boolean = false;

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router
  ) {}

  ngOnInit() {
    const savedEmail = localStorage.getItem('resetEmail');
    if (savedEmail) {
      this.email = savedEmail;
    } else {
      this.message = 'Email not found. Please start the reset process again.';

    }
  }
  checkPasswords() {
    this.passwordMismatch = this.newPassword !== this.confirmPassword;
  }
  resetPassword() {
    if (this.passwordMismatch) {
      this.message = 'Passwords do not match';
      return;
    }

    this.passwordResetService.resetPassword(this.email, this.newPassword).subscribe({
      next: (response: string) => {
        this.message = response; 
        if (response.includes('successfully')) { 
          localStorage.removeItem('resetEmail');
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.message = 'Error resetting password. Please try again.';
        console.error('Password reset error:', error);
      }
      
    });
    this.message = 'Password successfully reset!';
    localStorage.removeItem('resetEmail');
  }
}