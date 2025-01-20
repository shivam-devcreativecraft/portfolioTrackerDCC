import { Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { MasterControlComponent } from '../master-control/master-control.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { AddToGoogledriveComponent } from './add-to-googledrive/add-to-googledrive.component';
import { LoaderService } from 'src/app/loader.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-googledrive',
  templateUrl: './googledrive.component.html',
  styleUrls: ['./googledrive.component.scss']
})
export class GoogledriveComponent implements OnInit, OnDestroy {
  private baseUrl = environment.BACKEND_URL;

  driveData: any[] = []; // To store uploaded files info
  sanitizedFileUrl: any; // To hold the sanitized URL for iframe
  loadingView: boolean = false; // To track the loading state
  loadingDownload: boolean = false; // To track the downloading state
  isFileExplorerOpeningButtonClicked: boolean = false;
  IsMasterControlEnabled: boolean = false;

  currentFolder: any; // Track the currently opened folder

  currentPath: any[] = []; // Store the navigation path
  isDropdownOpen: boolean = false; // Track the dropdown state
  isStructuralView: boolean = false;

  isLoading = this.loaderService.loading$;




  constructor(private fileUploadService: FileUploadService, private sanitizer: DomSanitizer, private http: HttpClient, private toastr: ToastrService,
    private _dialog: MatDialog,

    private loaderService: LoaderService,

    private googleSheetAPIRef: GoogleSheetApiService,


  ) {

    this.googleSheetAPIRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;


      if (!IsEnabled) {
        this.driveData = [];
        this.isFileExplorerOpeningButtonClicked = false;
      }

    })
  }
  ngOnInit() {
    // Initialize with root folder

    if (this.IsMasterControlEnabled) {




      // this.currentFolder = { children: this.driveData }; // Represents the root folder
      // this.currentPath.push({ name: 'Root', id: 'root', type: 'folder' }); // Add root to the path
      this.loadFiles();
      document.addEventListener('click', this.closeDropdown);

    }


    if (!this.IsMasterControlEnabled) {
      this.toastr.warning('Master Password required.', 'Failed !')




      const dialogRef = this._dialog.open(MasterControlComponent, {
        disableClose: false,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe((result) => {

        if (result) {


          // this.currentFolder = { children: this.driveData }; // Represents the root folder
          // this.currentPath.push({ name: 'Root', id: 'root', type: 'folder' }); // Add root to the path
          this.loadFiles();
          document.addEventListener('click', this.closeDropdown);

        }
        else
          this.isFileExplorerOpeningButtonClicked = false;


      })

    }



  }
  ngOnDestroy() {
    document.removeEventListener('click', this.closeDropdown);
  }



  //#region 
  isViewing: boolean = false; // Track if the file is being viewed


  // 

  // New method to toggle folder expansion
  toggle(item: any) {
    if (item.type === 'folder') {
      // If the folder is being collapsed, set all children to not expanded
      if (item.expanded) {
        this.collapseAll(item);
      } else {
        // If the folder is being expanded, set to expanded
        item.expanded = true;
      }
    }
  }
  onToggleView() {
    // Toggle the view
    this.isStructuralView = !this.isStructuralView;

    // Remove 'isViewing' property from all files
    this.removeIsViewingProperty(this.driveData);
  }

  removeIsViewingProperty(driveData: any[]) {
    for (const item of driveData) {
      if (item.hasOwnProperty('isViewing')) {
        delete item.isViewing; // Remove the property if it exists
      }

      // If the item is a folder, recurse into its children
      if (item.type === 'folder' && item.children) {
        this.removeIsViewingProperty(item.children);
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


    if (file.mimeType.includes('image')) {

      if (!file.isViewing) {

        file.isViewing = true; // Set the viewing flag for the specific file
        const fileUrl = `${this.baseUrl}/api/drive/view/${file.id}`;

        // Make an HTTP GET request to fetch the file URL
        this.http.get(fileUrl, { responseType: 'blob' }) // Use 'blob' if you're expecting binary data
          .pipe(
            catchError((error: any) => {
              this.toastr.error(`Error fetching file: ${error.message || error.statusText}`);
              file.isViewing = false; // Reset the viewing state if there's an error
              return of(null); // Return an observable with null to complete the stream
            })
          )
          .subscribe((response: Blob | null) => {
            if (response) {
              // Process the response only if it's not null
              const sanitizedUrl = URL.createObjectURL(response);
              file.sanitizedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
            }
          });
      }


    }

    else {
      this.toastr.info(`Can only open Images ! `)
    }

  }

  closeFile(file: any) {
    file.isViewing = false; // Close only the specific file preview
    file.sanitizedFileUrl = undefined; // Clear the URL only for this file

  }

  isFullScreen: boolean = true;

  viewFileFullScreen(item: any) {
    this.toastr.info('Not Available Yet', 'Working !')
  }


  getFileTypeImage(mimeType: string): string {
    let path: string = '';



    if (mimeType.includes('pdf')) {
      path = 'assets/pdf.png';
    } else if (mimeType.includes('text')) {
      path = 'assets/txt.png';
    } else if (mimeType.includes('image')) {
      path = 'assets/image.png';
    } else if (mimeType.includes('document')) {
      path = 'assets/doc.png';
    } else if (mimeType.includes('sheet')) {
      path = 'assets/xls.png';

    } else if (mimeType.includes('compressed') && mimeType.includes('zip')) {
      path = 'assets/zip.png';
    } else if (mimeType.includes('compressed')) {
      path = 'assets/rar.png';
    }
    else {
      path = 'assets/default.png'; // Optional: Add a default icon for unrecognized types
    }

    return path;
  }


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


  //#endregion


  // // #region sorting using name AScending no exception for category and month+years named folders
  // loadFiles() {
  //   this.fileUploadService.fetchFiles().subscribe(
  //     (files) => {
  //       console.log('files before sort:', files);

  //       // Sort the files and folders hierarchically
  //       this.driveData = this.sortFilesAndFolders(files);

  //       // Set currentFolder to the root or first item
  //       this.currentFolder = { children: this.driveData }; // Set initial current folder

  //       console.log('files after sort:', this.driveData);
  //     },
  //     (error) => {
  //       console.error('Error fetching files:', error);
  //     }
  //   );
  // }

  // // Function to sort files and folders while maintaining the hierarchy
  // private sortFilesAndFolders(files: any[]): any[] {
  //   return files
  //     .sort((a, b) => {
  //       // Sort folders first
  //       if (a.type === 'folder' && b.type !== 'folder') return -1;
  //       if (a.type !== 'folder' && b.type === 'folder') return 1;
  //       // Sort by name
  //       return a.name.localeCompare(b.name);
  //     })
  //     .map(file => {
  //       // Recursively sort children if present
  //       if (file.children && file.children.length > 0) {
  //         file.children = this.sortFilesAndFolders(file.children); // Recursively sort children
  //       }
  //       return file;
  //     });
  // }


  //#region 


  //#region sort by name ascending but exception for months and days folder by these in place of name 
  loadFiles() {
    this.driveData = [];
    this.currentFolder = {}; // Represents the root folder
    this.currentPath = []; // Add root to the path
    this.isFileExplorerOpeningButtonClicked = true;
    this.loaderService.show();
    this.currentFolder = { children: this.driveData }; // Represents the root folder

    // this.currentPath.push({ name: 'Root', id: 'root', type: 'folder' }); // Add root to the path

    // Check if files are stored in local storage
    const cachedFiles = localStorage.getItem('driveData');

    if (cachedFiles) {
      // Parse the cached files and use them
      this.driveData = JSON.parse(cachedFiles);
      this.currentFolder = { children: this.driveData };
      this.loaderService.hide();
      // console.log('Loaded files from local storage:', this.driveData);
    } else {
      // If not in local storage, fetch files from the server
      this.fileUploadService.fetchFiles().subscribe(
        (files) => {
          // Sort the files and folders hierarchically
          this.driveData = this.sortFilesAndFolders(files);

          // Store the sorted file list in local storage
          localStorage.setItem('driveData', JSON.stringify(this.driveData));

          // Set currentFolder to the root or first item
          this.currentFolder = { children: this.driveData }; // Set initial current folder
          this.loaderService.hide();

        },
        (error) => {
          console.error('Error fetching files:', error);
          this.loaderService.hide();
          this.isFileExplorerOpeningButtonClicked = false;
          this.toastr.error(error.statusText, error.name);
        }
      );
    }

    // Set timeout to handle long-running API requests
    // setTimeout(() => {
    //   if (this.isFileExplorerOpeningButtonClicked && this.driveData.length === 0) {
    //     this.toastr.warning('Request time out, Reload/Reopen', 'Failed !');
    //     this.loaderService.hide();
    //     this.isFileExplorerOpeningButtonClicked = false;
    //   }
    // }, 10000);
  }


  // Function to sort files and folders while maintaining the hierarchy
  private sortFilesAndFolders(files: any[]): any[] {
    return files
      .sort((a, b) => {
        // Custom sort for months
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October', 'November', 'December'
        ];

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Check if names are months or days
        const aIsMonth = monthNames.includes(a.name);
        const bIsMonth = monthNames.includes(b.name);
        const aIsDay = dayNames.includes(a.name);
        const bIsDay = dayNames.includes(b.name);

        // Sort months first
        if (aIsMonth && !bIsMonth) return -1;
        if (!aIsMonth && bIsMonth) return 1;

        // Sort days next
        if (aIsDay && !bIsDay) return -1;
        if (!aIsDay && bIsDay) return 1;

        // Sort by type (folders first)
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;

        // Finally, sort alphabetically
        return a.name.localeCompare(b.name);
      })
      .map(file => {
        // Recursively sort children if present
        if (file.children && file.children.length > 0) {
          file.children = this.sortFilesAndFolders(file.children); // Recursively sort children
        }
        return file;
      });
  }



  //#endregion

  openFileExplorer() {
    this.isFileExplorerOpeningButtonClicked = true
    if (!this.IsMasterControlEnabled) {
      this.toastr.warning('Master Password required.', 'Failed !')

      const dialogRef = this._dialog.open(MasterControlComponent, {
        disableClose: false,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadFiles();
          this.isFileExplorerOpeningButtonClicked = true;

        }
        else
          this.isFileExplorerOpeningButtonClicked = false;

      });
    }
    else {
      this.loadFiles();
      this.isFileExplorerOpeningButtonClicked = true;


    }

  }

  closeFileExplorer() {
    this.isFileExplorerOpeningButtonClicked = false;
    this.driveData = []

  }


  openFolder(folder: any) {
    if (folder.type === 'folder') {
      this.currentFolder = folder; // Set the current folder to the clicked folder
      // Ensure root is represented in the path
      if (!this.currentPath.length || this.currentPath[0].name !== 'Root') {
        this.currentPath.unshift({ name: 'Root', id: 'root', type: 'folder' }); // Represent root
      }
      if (!this.currentPath.includes(folder)) {
        this.currentPath.push(folder); // Add to path
      }
    }
  }

  navigateToFolder(folder: any) {
    const isRoot = folder.id === 'root'; // Check if it's the root folder
    const index = isRoot ? 0 : this.currentPath.indexOf(folder); // Set index to 0 if root

    if (index !== -1) {
      this.currentPath = this.currentPath.slice(0, index + 1); // Update path
      this.currentFolder = isRoot ? { children: this.driveData } : folder; // Set current folder
    }
  }


  getDisplayedPath(): any[] {
    // Use the same reference of root from currentPath, ensuring consistency
    const rootPath = this.currentPath.find(folder => folder.id === 'root')
      || { name: 'Root', id: 'root', type: 'folder' };

    const currentPathWithoutRoot = this.currentPath.filter(folder => folder.id !== 'root');
    const currentPath = [rootPath, ...currentPathWithoutRoot]; // Combine root with filtered path

    if (currentPath.length <= 4) {
      return currentPath; // Return all if length is 4 or less
    }

    const lastTwo = currentPath.slice(-2); // Get last two folders
    return [rootPath, { name: '...' }, ...lastTwo]; // Return Root, '...', and last two
  }
  goBack() {
    // Check if current path has more than one item
    if (this.currentPath.length > 1) {
      const currentFolder = this.currentPath[this.currentPath.length - 1];

      // Check if the current folder is an immediate child of root
      if (currentFolder.id !== 'root' && this.currentPath[this.currentPath.length - 2].id === 'root') {
        // Reset to load file list
        this.currentFolder = { children: this.driveData }; // Represents the root folder
        this.currentPath = [{ name: 'Root', id: 'root', type: 'folder' }]; // Reset path to root
      } else {
        // Remove the last folder from the current path
        this.currentPath.pop();

        // Set current folder from path
        if (this.currentPath.length > 0) {
          this.currentFolder = this.currentPath[this.currentPath.length - 1]; // Set current folder from path
        } else {
          // Fallback to root if no folders are left
          this.currentFolder = { children: this.driveData }; // Represents the root folder
        }
      }
    } else if (this.currentPath.length === 1 && this.currentPath[0].id === 'root') {
      // If already at root, do not navigate back
      this.toastr.info('Already at root, cannot go back further.');
      this.currentFolder = { children: this.driveData }; // Represents the root folder
      this.currentPath = []
    }

  }

  reloadDriveData() {

    const message = `Drive's saved data will be reloaded.`;

    const dialogData = new ConfirmDialogModel('Confirm Reload', message);

    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === true) {




        const isLocalStorage = localStorage.getItem('driveData')
        if (isLocalStorage) {
          localStorage.removeItem('driveData');
          this.loadFiles()
        }

      }
    })
  }
  // Method to toggle the dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  // Method to close the dropdown when clicking outside
  closeDropdown = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.folder-path') && !target.closest('.dropdown-menu')) {
      this.isDropdownOpen = false;
    }
  };


  addToGoogleDrive(type: string, path: any) {
    // this.currentFolder = { children: this.driveData }; // Represents the root folder

    if (this.currentPath.length == 0) {
      this.currentPath.push({ name: 'Root', id: 'root', type: 'folder' }); // Add root to the path

    }



    const dialogRef = this._dialog.open(AddToGoogledriveComponent, {
      data: {
        type: type,
        path: path,
        folderId: path[path.length - 1].id,
        folderName: path[path.length - 1].name,
      },
      disableClose: false, // Prevent the dialog from closing on click outside
      hasBackdrop: false, // Allow interaction with the underlying page
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.message) {
        // this.toastr.success(result.fileId, result.message);
        // this.toastr.info('Please wait..', 'Refreshing Data !')

        // console.log(this.driveData)
        // console.log(this.currentFolder)
        // console.log(this.currentPath)
        // this.loadFiles()
      } else {
        console.log('Canceled by user');

      }

    });
  }


  //#region right cllick + touch to show option
  currentItem: any;
  private touchTimeout: any;
  // Function to handle left click (open file or folder)
  handleClick(event: MouseEvent, item: any) {
    // If event is triggered by a right-click or touch-hold, prevent folder opening
    if (event.button === 2 || event.type === 'touchstart') {
      event.preventDefault();
      return;
    }

    // Normal left click action, open the folder/file
    this.openFolder(item);
  }

  // Handle right-click on desktop
  handleRightClick(event: MouseEvent, item: any) {
    event.preventDefault();
    this.openOptionsDialog(item);
  }

  // Handle touch-and-hold on mobile
  handleTouchStart(event: TouchEvent, item: any) {
    this.touchTimeout = setTimeout(() => {
      this.openOptionsDialog(item);
    }, 800); // Trigger after 800ms for touch-and-hold
  }

  handleTouchEnd() {
    // Clear the timeout if touch is released quickly (not a long press)
    clearTimeout(this.touchTimeout);
  }
  @ViewChild('optionsDialogTemplate') optionsDialogTemplate!: TemplateRef<any>;
  @ViewChild('confirmDialogTemplate') confirmDialogTemplate!: TemplateRef<any>;
  @ViewChild('renameDialogTemplate') renameDialogTemplate!: TemplateRef<any>;
  @ViewChild('propertiesDialogTemplate') propertiesDialogTemplate!: TemplateRef<any>;

  // private optionsDialogRef!: MatDialogRef<any>; // Main dialog reference/
  optionsDialogRef: MatDialogRef<any, any> | null = null;

  private confirmDialogRef!: MatDialogRef<any>;
  private renameDialogRef!: MatDialogRef<any>;
  private propertiesDialogRef!: MatDialogRef<any>;

  currentFileForOptions: any;
  confirmMessage: string = '';
  Name: string = '';


  openOptionsDialog(item: any) {
    this.currentFileForOptions = item;

    // Check if the dialog is already open
    if (this.optionsDialogRef) {
      return;  // If a dialog reference exists, the dialog is already open
    }

    this.optionsDialogRef = this._dialog.open(this.optionsDialogTemplate, {
      disableClose: false,
      hasBackdrop: true,
    });

    // Optional: Clear the reference when the dialog closes
    this.optionsDialogRef.afterClosed().subscribe(() => {
      this.optionsDialogRef = null;  // Reset reference when dialog closes
    });
  }


  closeDialog(result: string) {
    if (this.optionsDialogRef) {
      this.optionsDialogRef.close(result);
    }
  }

  onOptionClick(option: string) {
    if (option === 'rename') {
      this.openRenameDialog();
    } else if (option === 'delete') {
      this.openConfirmDialog('Delete');
    } else if (option === 'properties') {
      this.showProperties();
    }
  }

  openRenameDialog() {
    this.renameDialogRef = this._dialog.open(this.renameDialogTemplate, {
      disableClose: false,
      hasBackdrop: true,
    });

    this.renameDialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.openConfirmDialog('Rename');
      }
      // If canceled, do nothing; the main dialog remains open.
    });
  }

  openConfirmDialog(action: string) {
    this.confirmMessage = action;
    this.confirmDialogRef = this._dialog.open(this.confirmDialogTemplate, {
      disableClose: false,
      hasBackdrop: true,
    });

    this.confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) { // User pressed "Yes"
        if (action === 'Delete') {
          this.performDelete();
        } else if (action === 'Rename') {
          this.performRename();
        }
        // Close the main dialog after performing the action
        this.toastr.info(action === 'Rename' ? 'Renaming...' : 'Deleting...', 'Please wait!')
        this.closeDialog('');
      }
      // If canceled, do nothing; the main dialog remains open.
    });
  }

  closeRenameDialog(confirmed: boolean) {
    this.renameDialogRef.close(confirmed ? 'yes' : 'cancel');
  }

  closeConfirmDialog(confirmed: boolean) {
    this.confirmDialogRef.close(confirmed); // Close confirmation dialog and pass confirmation status
  }

  performRename() {
    const oldName = this.currentFileForOptions.name;
    const fileId = this.currentFileForOptions.id;
    const newName = this.Name;

    const formData = new FormData();
    formData.append('fileId', fileId);
    formData.append('newName', newName);

    this.fileUploadService.renameFile(formData).subscribe({
      next: (response) => {
        this.toastr.success(`File renamed from ${oldName} to ${newName}`, 'Successful')

        // Handle any additional success logic (e.g., refresh list)
        const cachedFiles = localStorage.getItem('driveData');
        if (cachedFiles) {

          localStorage.removeItem('driveData');

        }

        this.loadFiles()
      },
      error: (err) => {
        this.toastr.error(`Failed to rename file: ${err}`, 'Failed');
        // Handle error (e.g., show error message to user)
      }
    });
  }

  performDelete() {
    const fileId = this.currentFileForOptions.id;

    const formData = new FormData();
    formData.append('fileId', fileId);

    this.fileUploadService.deleteFile(formData).subscribe({
      next: (response) => {
        this.toastr.success(`File ${fileId} deleted`, `Successful`);
        const cachedFiles = localStorage.getItem('driveData');
        if (cachedFiles) {

          localStorage.removeItem('driveData')
        }

        this.loadFiles()
        // Handle any additional success logic (e.g., refresh list)
      },
      error: (err) => {
        this.toastr.error(`Failed to delete file: ${err}`, `Failed`);
        // Handle error (e.g., show error message to user)
      }
    });
  }


  showProperties() {
    if (this.optionsDialogRef) {

      this.optionsDialogRef.close();
    }

    if (this.currentFileForOptions && this.currentFileForOptions.children) {
      this.filesAndFoldersCount = this.countFilesAndFolders(this.currentFileForOptions.children);
      this.currentFileForOptions.contains = `${this.filesAndFoldersCount.files} Files, ${this.filesAndFoldersCount.folders} Folders`;
    }

    this.propertiesDialogRef = this._dialog.open(this.propertiesDialogTemplate, {
      disableClose: false,
      hasBackdrop: true,
    });

    this.propertiesDialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  closePropertiesDialog() {
    this.propertiesDialogRef.close();
  }

  filesAndFoldersCount: { files: number; folders: number } = { files: 0, folders: 0 };

  countFilesAndFolders(children: any[]): { files: number; folders: number } {
    let fileCount = 0;
    let folderCount = 0;

    for (const child of children) {
      if (child.type === 'file') {
        fileCount++;
      } else if (child.type === 'folder') {
        folderCount++;
        const counts = this.countFilesAndFolders(child.children);
        fileCount += counts.files;
        folderCount += counts.folders;
      }
    }

    return { files: fileCount, folders: folderCount };
  }


  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value).then(() => {
      this.toastr.info(value, 'Copied to clipboard !');

      // Optionally, show a message or notification that the ID has been copied
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
  formatId(id: string): string {
    if (id.length <= 7) {
      return id; // If the ID is short enough, return it as is
    }
    return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`;
  }
}
