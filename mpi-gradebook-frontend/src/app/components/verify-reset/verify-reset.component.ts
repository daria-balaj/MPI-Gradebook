import { Component, OnInit } from '@angular/core';
import { PasswordResetService } from '../../services/password-reset.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-reset',
  templateUrl: './verify-reset.component.html',
  styleUrls: ['./verify-reset.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class VerifyResetComponent implements OnInit {
  email: string = '';
  code: string = '';
  message: string = '';
  lastResendAttempt: Date | null = null;
  resendDisabled = false;

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router
    
  ) {}

  ngOnInit() {
    const savedEmail = localStorage.getItem('resetEmail');
    if (savedEmail) {
      this.email = savedEmail;
    } else {
      this.message = 'Email not found. Please request a new reset code.';
      // this.router.navigate(['/request-reset']);
    }
  }

  verifyResetCode() {
    if (!this.email) {
      this.message = 'Email is required';
      return;
    }

    this.passwordResetService.verifyResetCode(this.email, this.code).subscribe(
      (response: any) => {
        this.message = response.message || response; 
        if (this.message.includes('Code verified')) { 
          this.router.navigate(['/reset-password']);
        }
      },
      (error) => {
        this.message = 'Invalid or expired reset code.';
        console.error('Verification error:', error);
      }
    );
  }
  resendCode() {
    if (this.resendDisabled) {
      this.message = 'Please wait before requesting a new code.';
      return;
    }
  
    if (!this.email) {
      this.message = 'Email not found. Please restart the password reset process.';
      return;
    }
  
    this.resendDisabled = true;
    this.lastResendAttempt = new Date();
    
    this.passwordResetService.sendResetCode(this.email).subscribe({
      next: (response: string) => {
        this.message = 'New verification code sent to your email.';
    
        setTimeout(() => {
          this.resendDisabled = false;
        }, 60000);
      },
      error: (error) => {
        this.message = 'Error sending new code. Please try again.';
        this.resendDisabled = false;
      }
    });
  }
}