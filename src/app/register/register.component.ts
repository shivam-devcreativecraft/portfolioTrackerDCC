import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;
  email: string = '';
  password: string = '';


  constructor(private router: Router, private notificationService: NotificationService, 
     private authService: AuthService
    ) { }
  // onSubmit() {

  //   this.loginFromFirebase()
  //   return
  //   const emailFromEnv = environment.email
  //   const passwordFromEnv = environment.password;

  //   if (this.email === emailFromEnv && this.password === passwordFromEnv) {
  //     localStorage.setItem('email', emailFromEnv);
  //     localStorage.setItem('password', passwordFromEnv)
  //     this.toastr.success("Successfull !")
  //     this.router.navigate(['/']);
  //   } else {
  //     this.toastr.error("Not found !")
  //     this.router.navigate(['/login']);
  //   }
  // }

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
      this.notificationService.info('You are already logged in!');
      this.router.navigate(['/']);
    }
  }
  // user: any;
  // loggedIn: boolean = false;

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  // signInWithFacebook(): void {
  //   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }

  signOut(): void {
    this.authService
  }


async loginFromFirebase() {
  try {
    await this.authService.login(this.email, this.password);
    this.notificationService.success("Successfully logged in!");
    this.router.navigate(['/']);
  } catch (err: any) {
    this.notificationService.error(err.message);
    this.router.navigate(['/login']);
  }
}

async registerFromFirebase() {
  if (!this.email || !this.password) {
    this.notificationService.error('Please enter both email and password');
    return;
  }

  try {
    const result = await this.authService.register(this.email, this.password);
    // Log newly registered user details
    console.log('Newly registered user details:', {
      email: result.user.email,
      uid: result.user.uid,
      emailVerified: result.user.emailVerified,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      creationTime: result.user.metadata.creationTime,
      lastSignInTime: result.user.metadata.lastSignInTime
    });
    this.notificationService.success("Successfully registered!");
    this.router.navigate(['/']);
  } catch (err: any) {
    this.notificationService.error(err.message);
  }
}
}
