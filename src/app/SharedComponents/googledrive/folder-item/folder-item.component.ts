import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { FileUploadService } from '../file-upload.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.scss']
})
export class FolderItemComponent implements OnInit {

  private baseUrl = environment.BACKEND_URL;


  @Input() item: any; // Adjust the type as per your data structure

  isViewing: boolean = false; // Track if the file is being viewed


  sanitizedFileUrl: SafeResourceUrl | undefined;

  constructor(private fileUploadService: FileUploadService, private sanitizer: DomSanitizer, private http: HttpClient, private toastr : ToastrService) { }



  ngOnInit(): void {
    // console.log(this.item)
  }

  toggle() {
    if (this.item.type === 'folder') {
      // If the folder is being collapsed, set all children to not expanded
      if (this.item.expanded) {
        this.collapseAll(this.item);
      } else {
        // If the folder is being expanded, set to expanded
        this.item.expanded = true;
      }
    }
  }

  // Recursive method to collapse all child folders
  collapseAll(folder: any) {
    folder.expanded = false; // Collapse this folder
    if (folder.children && folder.children.length > 0) {
      folder.children.forEach((child: any) => {
        this.collapseAll(child); // Recursively collapse all children
      });
    }
  }


  viewFile(file: any) {
    // console.log(fileId);
    // this.isViewing = !this.isViewing; // Toggle the viewing state
    this.isViewing = true;
    file.isViewing = true;
    const fileUrl = `${this.baseUrl}/api/drive/view/${file.id}`;
    this.sanitizedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);

    if (!this.sanitizedFileUrl) {
      console.error("Sanitized URL is invalid.");
      this.isViewing = !this.isViewing; // Toggle the viewing state
      return;
    }


  }

  viewFileFullScreen(item:any){
   this.toastr.info('Not Available Yet','Working !')
  }

  // Method to close the file preview
  closeFile(file: any) {
    file.isViewing = false;
    this.isViewing = false;  // Close the preview by setting isViewing to false
    this.sanitizedFileUrl = undefined;  // Clear the file URL
  }


  loadingDownload: boolean = false; // To track the downloading state


  downloadFile(fileId: string) {
    this.loadingDownload = true; // Show loading message
    const downloadUrl = `${this.baseUrl}/api/drive/download/${fileId}`; // Adjust URL as needed

    this.http.get(downloadUrl, { responseType: 'blob' }).subscribe(
      (response) => {
        const blob = new Blob([response]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileId}.jpg`; // Set the file name for download
        document.body.appendChild(a);
        a.click(); // Programmatically click the anchor element to trigger the download
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url); // Clean up the URL object

        this.loadingDownload = false; // Hide loading message
      },
      (error) => {
        console.error('Download error:', error);
        this.loadingDownload = false; // Hide loading message on error
      }
    );
  }




  getThumbnailUrl(fileId: string): string {
    // console.log(fileId)
    return `${this.baseUrl}/api/drive/thumbnail/${fileId}`; // Replace with your actual thumbnail URL format
  }






}
