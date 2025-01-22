import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, filter, map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private loaderServiceRef: LoaderService
  ) {
    this.isAuthenticated$ = this.authService.getAuthState();
  }

  ngOnInit(): void {

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



  
}
