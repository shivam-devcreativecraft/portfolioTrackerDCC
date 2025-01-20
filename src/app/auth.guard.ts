import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tostr : ToastrService) {}

  canActivate(): boolean {
    // Replace this with your actual authentication logic
    const isAuthenticated = this.checkAuthentication();

    if (isAuthenticated) {

      return true; // Allow access when authenticated
    } else {
      this.tostr.info("User not looged in !")
      this.router.navigate(['/login']); // Redirect to 'login' path when not authenticated
      return false;
    }
  }

  private checkAuthentication(): boolean {
    // Retrieve email and password from localStorage
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    const emailFromEnv = environment.email
    const passwordFromEnv = environment.password ;

    // Check if email and password match predefined values
    if (storedEmail === emailFromEnv && storedPassword === passwordFromEnv) {
      return true; // Authentication successful
    } else {
      return false; // Authentication failed
    }
  }
}
