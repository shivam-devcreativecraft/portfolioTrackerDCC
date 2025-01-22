import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  email: string = '';
  password: string = '';
  showResendButton: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router, 
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Check if user is already logged in
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // console.log('Currently logged in user:', {
      //   email: currentUser.email,
      //   uid: currentUser.uid,
      //   emailVerified: currentUser.emailVerified,
      //   displayName: currentUser.displayName,
      //   photoURL: currentUser.photoURL,
      //   creationTime: currentUser.metadata.creationTime,
      //   lastSignInTime: currentUser.metadata.lastSignInTime
      // });
      this.notificationService.info('You are already logged in!');
      this.router.navigate(['/']);
    }
  }

  async loginFromFirebase() {
    if (!this.email || !this.password) {
      this.notificationService.error('Please enter both email and password');
      return;
    }

    this.isLoading = true;
    this.showResendButton = false;

    try {
      const result = await this.authService.login(this.email, this.password);
      // Log user details after successful login
      console.log('Logged in user details:', {
        email: result.user.email,
        uid: result.user.uid,
        emailVerified: result.user.emailVerified,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        creationTime: result.user.metadata.creationTime,
        lastSignInTime: result.user.metadata.lastSignInTime
      });
    } catch (err: any) {
      if (err.message === "Email not verified") {
        this.showResendButton = true;
      } else {
        this.notificationService.error(err.message);
      }
    } finally {
      this.isLoading = false;
    }
  }

  async resendVerificationEmail() {
    if (!this.email) {
      this.notificationService.error('Please enter your email address');
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.resendVerificationEmail();
      this.showResendButton = false;
    } catch (error) {
      // Error is already handled in the service
    } finally {
      this.isLoading = false;
    }
  }

  async forgotPassword() {
    if (!this.email) {
      this.notificationService.error('Please enter your email address');
      return;
    }
    
    this.isLoading = true;
    try {
      await this.authService.forgotPassword(this.email);
    } finally {
      this.isLoading = false;
    }
  }

  async signOut() {
    await this.authService.signOut();
  }
}
