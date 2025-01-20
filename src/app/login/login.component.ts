import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
// import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
// import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  email: string = '';
  password: string = '';


  constructor(private router: Router, private toastr: ToastrService, 
    // private authService: SocialAuthService
    ) { }
  onSubmit() {
    const emailFromEnv = environment.email
    const passwordFromEnv = environment.password;

    if (this.email === emailFromEnv && this.password === passwordFromEnv) {
      localStorage.setItem('email', emailFromEnv);
      localStorage.setItem('password', passwordFromEnv)
      this.toastr.success("Successfull !")
      this.router.navigate(['/']);
    } else {
      this.toastr.error("Not found !")
      this.router.navigate(['/login']);
    }
  }
  ngOnInit() {
    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
    //   this.loggedIn = (user != null);
    // });
  }
  // user: any;
  // loggedIn: boolean = false;

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  // signInWithFacebook(): void {
  //   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }

  // signOut(): void {
  //   this.authService.signOut();
  // }
}
