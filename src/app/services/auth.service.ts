import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  
  constructor(
    private auth: Auth, 
    private router: Router,
    private toastr: ToastrService
  ) {
    // Listen to auth state changes
    onAuthStateChanged(this.auth, async (user) => {
      this.isAuthenticated.next(!!user);
      
      if (user) {
        // Get the ID token
        const token = await user.getIdToken();
        console.log('Firebase Auth Token:', token);
        console.log('User UID:', user.uid);
        console.log('Token is stored in IndexedDB -> firebase-auth-token');
        
        // If user is authenticated and on login/register page, redirect to app
        const currentUrl = this.router.url;
        if (currentUrl.includes('/login') || currentUrl.includes('/register')) {
          this.router.navigate(['/']);
        }
      } else {
        console.log('No auth token - User is logged out');
        // Force navigation to login when user is not authenticated
        this.router.navigate(['/login']);
      }
    });
  }

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      // Log token after successful login
      const token = await result.user.getIdToken();
      console.log('New login token:', token);
      this.toastr.success("Successfully logged in!");
      this.router.navigate(['/']);
      return result;
    } catch (error: any) {
      this.toastr.error(error.message);
      throw error;
    }
  }

  async register(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Set default profile data after registration
      await this.updateUserProfile(result.user, {
        displayName: email.split('@')[0], // Use part before @ as display name
        photoURL: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random` // Generate avatar
      });
      
      return result;
    } catch (error: any) {
      this.toastr.error(error.message);
      throw error;
    }
  }

  async updateUserProfile(user: User, profileData: { displayName?: string | null, photoURL?: string | null }) {
    try {
      await updateProfile(user, profileData);
      this.toastr.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      this.toastr.error('Failed to update profile: ' + error.message);
      throw error;
    }
  }

  async updateCurrentUserProfile(profileData: { displayName?: string | null, photoURL?: string | null }) {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return this.updateUserProfile(currentUser, profileData);
    } else {
      this.toastr.error('No user is currently logged in');
      return false;
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
      console.log('Token cleared from IndexedDB');
      this.toastr.success('Logged out successfully');
      // Force clear any cached data here if needed
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getAuthState() {
    return this.isAuthenticated.asObservable();
  }

  async forgotPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email).then(() => {
      this.toastr.success('Password reset email sent successfully');
    }).catch((error: any) => {
      this.toastr.error(error.message);
    });
  }
}
