
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = environment.BACKEND_URL;

  constructor(private http: HttpClient) {}

  // Updated uploadFile method to accept FormData (with file and folderName)
  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/drive/upload`, formData);
  }
  createFolder(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/drive/create`, formData);
  }

  // Use FormData to send oldName and newName
  renameFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/drive/rename`, formData);
  }

  // Use FormData to send fileName
  deleteFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/drive/delete`, formData);
  }
    
  // Fetch files from Google Drive
  fetchFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/drive/list`);
  }
}
