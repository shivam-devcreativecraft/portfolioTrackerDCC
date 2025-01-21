import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthLoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.getAuthState().pipe(
      take(1),
      map((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          return true;
        } else {
          this.toastr.info("You are already logged in!");
          this.router.navigate(['/'], { replaceUrl: true });
          return false;
        }
      })
    );
  }
} 