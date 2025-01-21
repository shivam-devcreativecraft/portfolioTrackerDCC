import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { NotificationService } from './services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, 
    private notificationService: NotificationService,
    private auth: Auth
  ) {}

  canActivate(): Promise<boolean> | boolean {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          resolve(true);
        } else {
          this.notificationService.info("Please login to continue!");
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
