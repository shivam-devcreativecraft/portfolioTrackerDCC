import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, filter, map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/loader.service';
import { AddComponent } from '../add/add.component';
import { MasterControlService } from 'src/app/services/master-control.service';
import { MasterControlComponent } from '../master-control/master-control.component';
import { NotificationService } from 'src/app/services/notification.service';

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
  isAddDialogOpen: boolean = false;
  
  isAuthenticated$: Observable<boolean>;
  userDetails: any = {
    displayName: 'User',
    email: '',
    photoURL: 'assets/default-avatar.png'
  };
  isActionsAllowed: boolean = true;
  IsMasterControlEnabled: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private overlay: Overlay,
    private toastr: ToastrService,
    private notificationService: NotificationService,
    private dataServiceRef: DataService,
    private authService: AuthService,
    private loaderServiceRef: LoaderService,
    private masterControlService: MasterControlService
  ) {
    this.isAuthenticated$ = this.authService.getAuthState();
  }

  ngOnInit(): void {
    this.updateUserDetails();
    
    // Subscribe to guest user state
    this.masterControlService.getGuestUserState().subscribe(isGuest => {
      this.isActionsAllowed = !isGuest;
    });

    // Subscribe to master control state
    this.masterControlService.getMasterControlState().subscribe(state => {
      console.log('Master Control State:', state); // Debug log
      this.IsMasterControlEnabled = state;
    });

    this.dataServiceRef.getDestroyObservable().subscribe((flag: boolean) => {
      this.destroyedComponentFlag = flag;
    });

    this.dataServiceRef.getAllNewOrdersUploadedObservable().subscribe((flag: boolean) => {
      this.allNewOrdersUploadedFlag = flag;
    });
  }

  private updateUserDetails(): void {
    const user = this.authService.getCurrentUser();
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
      width: '100%',
      data: dialogData,
      panelClass: 'custom-dialog-container',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async dialogResult => {
      if (dialogResult === true) {
        try {
          // Clear master control token if exists
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
  isHistoryActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/history';
    return currentUrl.startsWith(targetUrlPrefix);
  } 
  isSpotTradesActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/spot-trades';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isFuturesTradesActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/futures-trades';
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

  async openAddDialog(): Promise<void> {
    if (!this.isActionsAllowed && !this.IsMasterControlEnabled) {
      // Open master control dialog only if not enabled
      const dialogRef = this.dialog.open(MasterControlComponent, {
        width: '400px',
        data: { location: 'sidenav' }
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) {
        return;
      }
    }
    
    if (this.isAddDialogOpen) {
      this.toastr.warning('Add dialog is already open');
      return;
    }

    const dialogRef = this.dialog.open(AddComponent, {
      width: '100%',
      maxWidth: '800px',
      disableClose: true,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });

    this.isAddDialogOpen = true;

    dialogRef.afterClosed().subscribe(() => {
      this.isAddDialogOpen = false;
    });
  }

  async onDisableMasterControl(): Promise<void> {
    const dialogData = new ConfirmDialogModel(
      "Disable Master Control",
      "Are you sure you want to disable master control?"
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      width: '100%',
      data: dialogData,
      panelClass: 'custom-dialog-container',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.masterControlService.clearMasterControl();
        this.notificationService.success('Master Control Disabled');
      }
    });
  }

  openMasterControlDialog(): void {
    // Only open if not already enabled
    if (!this.IsMasterControlEnabled) {
      const dialogRef = this.dialog.open(MasterControlComponent, {
        width: '400px',
        maxWidth: '90%',
        panelClass: 'custom-dialog-container',
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.toastr.success('Master Control Enabled');
        }
      });
    }
  }
}
