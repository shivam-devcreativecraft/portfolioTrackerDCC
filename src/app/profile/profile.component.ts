import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  isEditing: boolean = false;
  editForm = {
    displayName: '',
    photoURL: ''
  };
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = {
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        emailVerified: currentUser.emailVerified,
        creationTime: currentUser.metadata.creationTime,
        lastSignInTime: currentUser.metadata.lastSignInTime
      };
      this.editForm.displayName = currentUser.displayName || '';
      this.editForm.photoURL = currentUser.photoURL || '';
      this.imagePreview = currentUser.photoURL || '';
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form when canceling edit
      this.editForm.displayName = this.user.displayName || '';
      this.editForm.photoURL = this.user.photoURL || '';
      this.selectedFile = null;
      this.imagePreview = this.user.photoURL || '';
    }
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        this.toastr.error('Please select a valid image file (JPEG, PNG, or GIF)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.toastr.error('Image size should be less than 5MB');
        return;
      }

      this.selectedFile = file;
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.toastr.success('Image selected successfully');
      };
      reader.readAsDataURL(file);
    }
  }

  private async uploadImageToStorage(file: File): Promise<string> {
    const storage = getStorage();
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');

    const fileExt = file.name.split('.').pop();
    const fileName = `profile_images/${currentUser.uid}/${Date.now()}_profile.${fileExt}`;
    const storageRef = ref(storage, fileName);

    try {
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'uploadedBy': currentUser.uid,
          'uploadedAt': new Date().toISOString()
        }
      };

      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      if (error.code === 'storage/unauthorized') {
        throw new Error('Permission denied. Please check storage rules.');
      }
      throw error;
    }
  }

  async updateProfile() {
    try {
      if (!this.editForm.displayName.trim()) {
        this.toastr.error('Display name is required');
        return;
      }

      let photoURL = this.user.photoURL;

      // If a new file was selected, upload it
      if (this.selectedFile) {
        try {
          photoURL = await this.uploadImageToStorage(this.selectedFile);
        } catch (error) {
          this.toastr.error('Failed to upload image. Please try again.');
          return;
        }
      } else if (this.imagePreview && this.imagePreview.startsWith('http')) {
        // If using random avatar or existing URL
        photoURL = this.imagePreview;
      }

      // Update profile
      await this.authService.updateCurrentUserProfile({
        displayName: this.editForm.displayName.trim(),
        photoURL: photoURL
      });
      
      // Update local user object
      this.user.displayName = this.editForm.displayName.trim();
      this.user.photoURL = photoURL;
      
      this.isEditing = false;
      this.selectedFile = null;
      this.toastr.success('Profile updated successfully');

      // Force reload current user to update sidenav
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        await currentUser.reload();
      }
    } catch (error: any) {
      this.toastr.error(error.message || 'Error updating profile');
      console.error('Error updating profile:', error);
    }
  }

  generateNewAvatar() {
    if (this.editForm.displayName) {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.editForm.displayName)}&background=random&size=200`;
      this.imagePreview = avatarUrl;
      this.editForm.photoURL = avatarUrl;
      this.selectedFile = null;
      this.toastr.success('Random avatar generated');
    } else {
      this.toastr.warning('Please enter a display name first');
    }
  }
} 