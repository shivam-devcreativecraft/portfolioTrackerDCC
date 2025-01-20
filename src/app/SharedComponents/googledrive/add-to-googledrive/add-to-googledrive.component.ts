import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../file-upload.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-to-googledrive',
  templateUrl: './add-to-googledrive.component.html',
  styleUrls: ['./add-to-googledrive.component.scss']
})
export class AddToGoogledriveComponent implements OnInit {
  type: string = '';
  uploadData: any;
  uploadResponse: any;
  selectedFiles: File[] = []; // Store selected files
  customFileNames: string[] = []; // Store custom file names
  fileDescriptions: string[] = []; // Store file descriptions
  folderName: string = ''; // New property for folder name
  folderId: string = ''; // New property for folder ID
  isUploadClicked: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public injectedData: any,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddToGoogledriveComponent>,
    private http: HttpClient,
    private fileUploadService: FileUploadService,
  ) {
    this.uploadData = this.injectedData;
  }

  ngOnInit(): void {
    this.uploadData = this.injectedData;
    this.type = this.injectedData.type;

    if (this.type === 'file') {
      this.folderName = this.uploadData.folderName;
    }

    this.folderId = this.uploadData.folderId;
  }

  onFilesSelected(event: any) {
    const files = event.target.files;
    this.selectedFiles = Array.from(files);
    this.customFileNames = new Array(this.selectedFiles.length).fill('');
    this.fileDescriptions = new Array(this.selectedFiles.length).fill('');

    // Reset custom names and descriptions
    this.selectedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Preview functionality can be added here if needed
      };
      reader.readAsDataURL(file);
    });
  }

  resetFileUpload() {
    this.selectedFiles = [];
    this.customFileNames = [];
    this.fileDescriptions = [];
    this.folderName = '';
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.folderName && !this.folderId) {
      alert('Please provide either a folder name or folder ID.');
      return;
    }

    this.isUploadClicked = true;
    this.uploadResponse = null;

    const formData = new FormData();
    if (this.folderId) {
      formData.append('folderId', this.folderId); // Send folder ID to backend
    }
    else if  (!this.folderId) {
      formData.append('folderName', this.folderName); // Send folder ID to backend
    }
    this.selectedFiles.forEach((file, index) => {
      const finalFileName = this.customFileNames[index] ? `${this.customFileNames[index]}${file.name.slice(file.name.lastIndexOf('.'))}` : file.name;
      const renamedFile = new File([file], finalFileName, { type: file.type });

      formData.append('files', renamedFile); // Append each file

      // Only append the description if it exists
      if (this.fileDescriptions[index]) {
        formData.append(`descriptions[${index}]`, this.fileDescriptions[index]);
      }
    });

    this.fileUploadService.uploadFile(formData).subscribe(
      (response: any) => {
        this.uploadResponse = response;
        this.resetFileUpload();
        this.isUploadClicked = false;
        this.dialogRef.close(response);
      },
      (error) => {
        console.error('Error uploading files:', error);
        this.isUploadClicked = false;
        this.dialogRef.close(error);
      }
    );
}


}
