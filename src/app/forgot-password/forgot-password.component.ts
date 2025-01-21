import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService,
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
      this.toastr.info('You are already logged in!');
      this.router.navigate(['/']);
    }
  }

  async resetPassword() {
    if (!this.email) {
      this.toastr.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.toastr.error('Please enter a valid email address');
      return;
    }

    try {
      await this.authService.forgotPassword(this.email);
      this.toastr.success('Password reset email sent. Please check your inbox.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 