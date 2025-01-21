import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  email: string = '';
  password: string = '';

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
        uid: currentUser.uid,
        emailVerified: currentUser.emailVerified,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        creationTime: currentUser.metadata.creationTime,
        lastSignInTime: currentUser.metadata.lastSignInTime
      });
      this.toastr.info('You are already logged in!');
      this.router.navigate(['/']);
    }
  }

  async loginFromFirebase() {
    if (!this.email || !this.password) {
      this.toastr.error('Please enter both email and password');
      return;
    }

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
      this.toastr.error(err.message);
    }
  }

async forgotPassword() {
  await this.authService.forgotPassword(this.email);
}

 async signOut() {
    await this.authService.signOut( ); 
  }
}
