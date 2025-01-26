import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class MasterControlService {
  private readonly GUEST_EMAIL = 'devcreativecraft@gmail.com';
  private masterPassword: string | null = null;
  
  private isMasterControlEnabled = new BehaviorSubject<boolean>(false);
  private isGuestUser = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {
    // Initialize master control state from localStorage
    this.initializeMasterControl();
    this.initializeMasterPassword();

    // Subscribe to auth state changes to check for guest user
    this.authService.getAuthState().subscribe((isAuthenticated) => {
      const currentUser = this.authService.getCurrentUser();
      const isGuest = currentUser?.email === this.GUEST_EMAIL;
      this.isGuestUser.next(isGuest);
    });
  }

  private async initializeMasterPassword() {
    try {
      const userId = this.authService.getCurrentUser()?.uid;
      if (!userId) {
        console.error('No user logged in');
        return;
      }

      const doc = await this.firestore
        .collection('users')
        .doc(userId)
        .collection('settings')
        .doc('master-control')
        .get()
        .toPromise();

      if (doc?.exists) {
        const data = doc.data() as { password: string };
        this.masterPassword = data.password;
      } else {
        console.error('Master password document not found in Firebase');
      }
    } catch (error) {
      console.error('Error fetching master password:', error);
    }
  }

  private initializeMasterControl() {
    const token = localStorage.getItem('masterControlToken');
    if (token) {
      this.isMasterControlEnabled.next(true);
    } else {
      this.isMasterControlEnabled.next(false);
    }
  }

  verifyMasterPassword(password: string): Promise<{ success: boolean, message: string, token?: string }> {
    return new Promise((resolve) => {
      if (!this.masterPassword) {
        resolve({ 
          success: false, 
          message: 'System error: Master password not initialized' 
        });
        return;
      }

      if (password === this.masterPassword) {
        const token = this.generateToken();
        localStorage.setItem('masterControlToken', token);
        this.isMasterControlEnabled.next(true);
        resolve({ 
          success: true, 
          message: 'Master Control Enabled!',
          token 
        });
      } else {
        resolve({ 
          success: false, 
          message: 'Invalid master password' 
        });
      }
    });
  }

  checkMasterControl(state: boolean) {
    this.isMasterControlEnabled.next(state);
    if (state) {
      const token = this.generateToken();
      localStorage.setItem('masterControlToken', token);
    } else {
      localStorage.removeItem('masterControlToken');
    }
  }

  getMasterControlState() {
    return this.isMasterControlEnabled.asObservable();
  }

  getGuestUserState() {
    return this.isGuestUser.asObservable();
  }

  isActionAllowed(): boolean {
    // If not a guest user, always allow
    if (!this.isGuestUser.value) {
      return true;
    }
    // If guest user, check if master control is enabled
    return this.isMasterControlEnabled.value;
  }

  clearMasterControl() {
    localStorage.removeItem('masterControlToken');
    this.isMasterControlEnabled.next(false);
  }

  private generateToken(): string {
    // Simple token generation - in real app use a more secure method
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
} 