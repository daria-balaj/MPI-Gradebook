import { Component } from '@angular/core';
import { PasswordResetService } from '../../services/password-reset.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss'],
  imports: [FormsModule,CommonModule]
})
export class RequestResetComponent {
  email: string = '';
  message: string = '';

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router
  ) {}

  requestResetCode() {
    this.passwordResetService.sendResetCode(this.email).subscribe(
      (response: string) => {
        if (response.toLowerCase().includes('reset code sent')) {
          localStorage.setItem('resetEmail', this.email);
          this.router.navigate(['/verify-reset']);
        } else {
          this.message = response;
        }
      },
      (error) => {
        this.message = 'An error occurred while sending the reset code.';
        console.error('Error details:', error);
      }
    );
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}