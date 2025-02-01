import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile, User, sendEmailVerification } from '@angular/fire/auth';
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
      if (user) {
        // Check email verification first
        if (!user.emailVerified) {
          this.isAuthenticated.next(false);
          await signOut(this.auth);
          this.toastr.warning("Please verify your email before logging in.");
          this.router.navigate(['/login']);
          return;
        }

        // If email is verified, proceed with authentication
        this.isAuthenticated.next(true);
        const token = await user.getIdToken();
        // console.log('Firebase Auth Token:', token);
        // console.log('User UID:', user.uid);
        // console.log('Token is stored in IndexedDB -> firebase-auth-token');
        
        // Only redirect if on login/register page and email is verified
        const currentUrl = this.router.url;
        if (currentUrl.includes('/login') || currentUrl.includes('/register')) {
          this.router.navigate(['/']);
        }
      } else {
        this.isAuthenticated.next(false);
        // console.log('No auth token - User is logged out');
        // Force navigation to login when user is not authenticated
        this.router.navigate(['/login']);
      }
    });
  }

  async login(email: string, password: string) {
    try {
      // First attempt to sign in
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Immediately check email verification before proceeding
      if (!result.user.emailVerified) {
        // Store credentials temporarily for resending verification
        sessionStorage.setItem('tempEmail', email);
        sessionStorage.setItem('tempPassword', password);
        
        // Sign out immediately if not verified
        await signOut(this.auth);
        
        // Send verification email
        try {
          await sendEmailVerification(result.user);
          this.toastr.warning("Please verify your email before logging in. A verification email has been sent.");
        } catch (verificationError: any) {
          if (verificationError.code === "auth/too-many-requests") {
            this.toastr.error("Too many verification attempts. Please try again later.");
          } else {
            this.toastr.error("Failed to send verification email. Please try again later.");
          }
        }
        
        throw new Error("Email not verified");
      }

      // Clear any stored temporary credentials
      sessionStorage.removeItem('tempEmail');
      sessionStorage.removeItem('tempPassword');

      // If we get here, email is verified
      const token = await result.user.getIdToken();
      // console.log('New login token:', token);
      this.toastr.success("Successfully logged in!");
      this.router.navigate(['/']);
      return result;
    } catch (error: any) {
      if (error.message === "Email not verified") {
        throw error;
      }
      if (error.code === "auth/too-many-requests") {
        this.toastr.error("Too many login attempts. Please try again later.");
      } else {
        this.toastr.error(error.message);
      }
      throw error;
    }
  }

  async register(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Send verification email
      await sendEmailVerification(result.user);
      
      // Set default profile data after registration
      await this.updateUserProfile(result.user, {
        displayName: email.split('@')[0], // Use part before @ as display name
        photoURL: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random` // Generate avatar
      });
      
      // Sign out the user until they verify their email
      await signOut(this.auth);
      
      this.toastr.success("Registration successful! Please check your email to verify your account.");
      this.router.navigate(['/login']);
      
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
      // Clear master control token on explicit logout
      localStorage.removeItem('masterControlToken');
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

  async resendVerificationEmail() {
    try {
      const tempEmail = sessionStorage.getItem('tempEmail');
      const tempPassword = sessionStorage.getItem('tempPassword');
      
      if (!tempEmail || !tempPassword) {
        throw new Error("Please try logging in again to receive a verification email.");
      }

      // Sign in again to get user object
      const result = await signInWithEmailAndPassword(this.auth, tempEmail, tempPassword);
      
      // Send verification email
      await sendEmailVerification(result.user);
      
      // Sign out again
      await signOut(this.auth);
      
      this.toastr.success("Verification email sent successfully!");
    } catch (error: any) {
      if (error.code === "auth/too-many-requests") {
        this.toastr.error("Too many verification attempts. Please try again later.");
      } else {
        this.toastr.error(error.message || "Failed to send verification email");
      }
      throw error;
    }
  }
}
