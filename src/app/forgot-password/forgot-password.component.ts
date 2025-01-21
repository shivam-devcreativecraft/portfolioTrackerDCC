import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Check if user is already logged in
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      console.log('Currently logged in user:', {
        email: currentUser.email,
        uid: currentUser.uid
      });
      this.notificationService.info('You are already logged in!');
      this.router.navigate(['/']);
    }
  }

  async resetPassword() {
    if (!this.email) {
      this.notificationService.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.notificationService.error('Please enter a valid email address');
      return;
    }

    try {
      await this.authService.forgotPassword(this.email);
      this.notificationService.success('Password reset email sent. Please check your inbox.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.notificationService.error(error.message);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 