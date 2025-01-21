import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, 
    private tostr: ToastrService,
    private auth: Auth
  ) {}

  canActivate(): Promise<boolean> | boolean {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          resolve(true);
        } else {
          this.tostr.info("Please login to continue!");
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
