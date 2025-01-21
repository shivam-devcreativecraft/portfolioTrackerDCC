import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, filter, map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { SearchSpotCoinDialogComponent } from '../search-spot-coin-dialog/search-spot-coin-dialog.component';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { MasterControlComponent } from '../master-control/master-control.component';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { LoaderService } from 'src/app/loader.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  panelOpenState = false;
  selectedLink: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  newOrdersData: any;
  NewOrdersSavingType = 'single';
  destroyedComponentFlag: boolean = false;
  allNewOrdersUploadedFlag: boolean = false;
  IsMasterControlEnabled: boolean = false;
  isAuthenticated$: Observable<boolean>;
  userDetails: any = {
    displayName: 'User',
    email: '',
    photoURL: 'assets/default-avatar.png'
  };

  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private dataServiceRef: DataService,
    private authService: AuthService,
    private googleSheetApiServiceRef: GoogleSheetApiService,
    private loaderServiceRef: LoaderService
  ) {
    this.isAuthenticated$ = this.authService.getAuthState();
  }

  ngOnInit(): void {
    if (localStorage.getItem('masterControlToken')) {
      this.googleSheetApiServiceRef.checkMasterControl(true);
    }

    // Initialize user details
    this.updateUserDetails(this.authService.getCurrentUser());

    // Subscribe to auth state changes
    this.authService.getAuthState().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.updateUserDetails(this.authService.getCurrentUser());
      } else {
        // Reset user details when logged out
        this.userDetails = {
          displayName: 'User',
          email: '',
          photoURL: 'assets/default-avatar.png'
        };
      }
    });

    this.dataServiceRef.getDestroyObservable().subscribe((flag: boolean) => {
      this.destroyedComponentFlag = flag;
    });

    this.googleSheetApiServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    });

    this.dataServiceRef.getAllNewOrdersUploadedObservable().subscribe((flag: boolean) => {
      this.allNewOrdersUploadedFlag = flag;
    });
  }

  private updateUserDetails(user: any): void {
    if (user) {
      // Get display name from: 1. displayName 2. email username 3. 'User'
      const displayName = user.displayName || 
                         (user.email ? user.email.split('@')[0] : 'User');
      
      // Get photo URL, fallback to default avatar
      const photoURL = user.photoURL || 'assets/default-avatar.png';

      this.userDetails = {
        displayName: displayName,
        email: user.email || '',
        photoURL: photoURL
      };
    }
  }

  add_Selected_link(link: string) {
    this.selectedLink = link;
  }

  async onLogout() {
    const message = `Are you sure you want to Logout?`;
    const dialogData = new ConfirmDialogModel("Confirm", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(async dialogResult => {
      if (dialogResult === true) {
        try {
          // Clear master control token if exists
          const token = localStorage.getItem('masterControlToken')
          if (token) {
            const formData = new FormData();
            formData.append('action', 'clearToken');
            formData.append('token', token);
            try {
              await this.googleSheetApiServiceRef.getMasterControlAccess(formData, this);
            } catch (error) {
              this.toastr.warning('Master Control Disabled, but failed to clear masterControl token from Sheets, Clear Manually');
            }
          }

          // Clear all local storage items
          localStorage.removeItem('masterControlToken');
          localStorage.removeItem('exchangeData');
          localStorage.removeItem('driveData');
          this.googleSheetApiServiceRef.checkMasterControl(false);

          // Sign out using auth service
          await this.authService.signOut();
        } catch (error: any) {
          this.toastr.error(error.message || 'Logout failed');
        }
      } else {
        this.toastr.warning("Logout cancelled");
      }
    });
  }

  isPortfolioMainDashboardActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/dashboard';
    return currentUrl.startsWith(targetUrlPrefix);
  }

  isDemoTradingActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/demo-trading';
    return currentUrl.startsWith(targetUrlPrefix);
  }

  isTradingViewActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/tradingview';
    return currentUrl.startsWith(targetUrlPrefix);
  }

  @ViewChild('drawer') drawer!: MatSidenav;

  handleNavLinkClickAutoCollapse(): void {
    if (this.isMobile) {
      this.drawer.toggle();
    }
  }

  get isMobile(): boolean {
    return this.breakpointObserver.isMatched(Breakpoints.Handset);
  }

  openMasterControlDialog() {
    const dialogRef = this.dialog.open(MasterControlComponent, {
      data: { location: 'sidenav' },
      disableClose: false,
      hasBackdrop: false
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  onDisableMasterControl() {
    const message = `Are you sure you want to disable\nMaster Control ?`;
    const dialogData = new ConfirmDialogModel('Confirm Disable', message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === true) {
        this.loaderServiceRef.show();
        const token = localStorage.getItem('masterControlToken')
        const fileList_droveStorageData = localStorage.getItem('driveData')

        if (token) {
          const formData = new FormData();
          formData.append('action', 'clearToken');
          formData.append('token', token);

          this.googleSheetApiServiceRef.getMasterControlAccess(formData, this).then((response: any) => {
            if (response.message) {
              localStorage.removeItem('masterControlToken')
              this.googleSheetApiServiceRef.checkMasterControl(false);
              this.toastr.warning('Master Control Disabled', 'Successfull !')
            }
            else {
              localStorage.removeItem('masterControlToken')
              this.googleSheetApiServiceRef.checkMasterControl(false)
              this.toastr.warning('Master Control Disabled, but failed to clear masterControl token from Sheets, Clear Manually', 'Successfull !')
            }
            this.loaderServiceRef.hide();
          })
        }

        if (fileList_droveStorageData) {
          localStorage.removeItem('driveData');
        }
      }
    })
  }
}
