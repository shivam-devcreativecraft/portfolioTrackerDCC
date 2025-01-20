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
import { NewOrdersComponent } from '../PortfolioSheetsComponents/new-orders/new-orders.component';
import { ComponentInstanceService } from 'src/app/services/component-instance.service';
import { MasterControlComponent } from '../master-control/master-control.component';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { LoaderService } from 'src/app/loader.service';
import { TradingToolsComponent } from 'src/app/trading-tools/trading-tools.component';
import { SidenavMenuAsDialogComponent } from 'src/app/SharedComponents/sidenav-menu-as-dialog/sidenav-menu-as-dialog.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  panelOpenState = false;
  selectedLink: any;//for routing
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  newOrdersData: any;
  AreNewOrders: boolean = false;
  // NewOrdersSavingType='multiple';
  NewOrdersSavingType = 'single';
  destroyedComponentFlag: boolean = false;
  allNewOrdersUploadedFlag: boolean = false;
  IsMasterControlEnabled: boolean = false;



  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private dataServiceRef: DataService,
    private componentInstanceServiceRef: ComponentInstanceService,
    private googleSheetApiServiceRef: GoogleSheetApiService,
    private loaderServiceRef: LoaderService
  ) {


    // this.dataServiceRef.setNewOrderSubject$.subscribe((newOrders: any) => {
    //   this.AreNewOrders = false;
    //   if (!Array.isArray(this.newOrdersData)) {
    //     this.newOrdersData = [];
    //   }
    //   this.newOrdersData = this.newOrdersData.concat(newOrders);
    //   if (this.newOrdersData.length > 0) {
    //     this.AreNewOrders = true;
    //   }
    //   console.log('Received new orders ALL (sideNav subscription): ', this.newOrdersData);
    // });
    this.dataServiceRef.getDestroyObservable().subscribe((flag: boolean) => {
      // Handle the received data in your constructor...
      // console.log('flag : ', flag)
      this.destroyedComponentFlag = flag
    });

    this.googleSheetApiServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })

    this.dataServiceRef.setNewOrderSubject$.subscribe((newOrders: any) => {
      if (this.NewOrdersSavingType === 'single') {
        this.newOrdersData = [];
        this.newOrdersData = this.newOrdersData.concat(newOrders);
        this.AreNewOrders = this.newOrdersData.some((order: any) => order.NewOrders.length > 0);
        if (this.AreNewOrders) {
          this.allNewOrdersUploadedFlag = false;

        }
      }

      if (this.NewOrdersSavingType === 'multiple') {
        this.AreNewOrders = false;
        if (!Array.isArray(this.newOrdersData)) {
          this.newOrdersData = [];
        }
        this.newOrdersData = this.newOrdersData.concat(newOrders);
        if (this.newOrdersData.some((order: any) => order.NewOrders.length > 0)) {
          this.AreNewOrders = true;
        }
      }
      this.destroyedComponentFlag = false;
      // console.log(`Received new orders (for ${this.NewOrdersSavingType}) (sideNav subscription): `, this.newOrdersData);
    });




    this.dataServiceRef.getAllNewOrdersUploadedObservable().subscribe((flag: boolean) => {
      this.allNewOrdersUploadedFlag = flag;
    })

  }
  // selectedSheetName:string='';
  ngOnInit(): void {

    // this.googleSheetApiServiceRef.selectedSheetName$.subscribe(
    //   (sheetName) => {
    //     this.selectedSheetName = sheetName;
    //     // Handle the selected sheet name change here
    //   })



    if (localStorage.getItem('masterControlToken')) {
      this.googleSheetApiServiceRef.checkMasterControl(true)
    }
  }

  //for routing
  add_Selected_link(link: string) {
    this.selectedLink = link;

  }
  onLogout() {

    const message = `Are you sure you want to Logout ?`;

    const dialogData = new ConfirmDialogModel("Confirm", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      // position: { left: '550px', top: '365px' }, // Adjust these values as needed
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {

        const token = localStorage.getItem('masterControlToken')
        if (token) {
          const formData = new FormData();
          formData.append('action', 'clearToken');
          formData.append('token', token);
          this.googleSheetApiServiceRef.getMasterControlAccess(formData, this).then((response: any) => {

            if (response.error) {
              this.toastr.warning('Master Control Disabled, but failed to clear masterControl token from Sheets, Clear Manually', 'Successfull !')

            }


          })
        }

        localStorage.removeItem('masterControlToken')
        this.googleSheetApiServiceRef.checkMasterControl(false);
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('exchangeData');
        localStorage.removeItem('driveData');


        this.toastr.success("Succesfull !");
        this.router.navigate(['./login']);
        // User confirmed, proceed with logout

      } else {

        this.toastr.warning("Cancelled !")

      }
    });

  }


  // ------------------------------STARTS to block changing of route url on re press nav link of portfolio section for bybit and binance ------------------------------

  isPortfolioBybitActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/portfolio-bybit/portfolio-bybit';
    return currentUrl.startsWith(targetUrlPrefix);
  }

  isPortfolioBinanceActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/portfolio-binance/portfolio-binance';
    return currentUrl.startsWith(targetUrlPrefix);
  }

  isPortfolioMexcActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/portfolio-mexc/portfolio-mexc';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isPortfolioFreebitcoActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/portfolio-freebitco/portfolio-freebitco';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isPortfolioMainDashboardActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/dashboard';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  // -------------------------------
  isPortfolioMainWatchlistActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/watchlist';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  // -------------------------------
  isPortfolioLoggingActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/logging';
    return currentUrl.startsWith(targetUrlPrefix);
  }

  isPortfolioMainAssetsDetailActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/assets';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isPortfolioMainOpenOrdersAIOActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/open-orders-aio';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isGoogleDriveActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/google-drive';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isPortfolioExnessActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/portfolio-exness';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isPortfolioKucoinActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/portfolio-kucoin';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isPortfolioDeltaActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/portfolio-delta';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isPortfolioGateioActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/portfolio-gateio';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isPortfolioOurbitActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/portfolio-ourbit';
    return currentUrl.startsWith(targetUrlPrefix);
  }

  isDemoTradingActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/demo-trading';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isTradeSetupActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/trade-setup';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isTradingViewActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/tradingview';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isTrackerActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/tracker';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isPasswordManagerActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/password-manager';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isPortfolioTradingToolsActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/trading-tools';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  isPortfolioNotesActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/portfolio-notes';
    return currentUrl.startsWith(targetUrlPrefix);
  }
  // ------------------------------ENDS to block changing of route url on re press nav link of portfolio section for bybit and binance ------------------------------

  // to close the sidenav on click on nav-links (On mobile screens) STARTS
  @ViewChild('drawer') drawer!: MatSidenav;

  // ...

  handleNavLinkClickAutoCollapse(): void {
    if (this.isMobile) {
      this.drawer.toggle();
    }
  }

  get isMobile(): boolean {
    return this.breakpointObserver.isMatched(Breakpoints.Handset);
  }

  // to close the sidenav on click on nav-links (On mobile screens) ENDS

  //#region Search Spot Coin

  open_SpotCoin_Search_Dialog() {
    const dialogRef = this.dialog.open(SearchSpotCoinDialogComponent, {
      // data: item, // Pass the 'item' data to the dialog component
      disableClose: false, // Prevent the dialog from closing on click outside
      hasBackdrop: false, // Allow interaction with the underlying page
      // panelClass: ['draggable-dialog']
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle any data returned from the dialog if needed
      // console.log('Dialog was closed with result:', result);
    });
  }

  refresh() {


    // Get the current route snapshot
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    const componentName = snapshot.url.split('/').pop(); // Assuming the component name is the last segment of the URL

    switch (componentName) {
      case 'assets-detail-exchange': {
        localStorage.removeItem('AssetsDetail');
        let AssetsDetailExchangeComponent_componentInstance = this.componentInstanceServiceRef.getComponentInstance('AssetsDetailExchangeComponent');
        if (AssetsDetailExchangeComponent_componentInstance) {
          AssetsDetailExchangeComponent_componentInstance.initialize();
        }

        break;
      }

      case 'assets-detail-history': {

        let AssetsDetailHistoryComponent_componentInstance = this.componentInstanceServiceRef.getComponentInstance('AssetsDetailHistoryComponent');
        if (AssetsDetailHistoryComponent_componentInstance) {
          AssetsDetailHistoryComponent_componentInstance.isSheetDataLoaded = {};
          AssetsDetailHistoryComponent_componentInstance.loadSheetDataForExchange(0);
        }
        break;
      }
      default: {
        const currentUrl = this.router.url;
        // console.log(currentUrl)
        this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {

          this.router.navigate([currentUrl]);
        });
      }

    }






  }


  openNewOrderDialog() {


    if (!this.IsMasterControlEnabled) {

      const dialogRef = this.dialog.open(MasterControlComponent, {
        disableClose: false,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const dialogRef = this.dialog.open(NewOrdersComponent, {
            data: this.newOrdersData, // Pass the 'item' data to the dialog component
            disableClose: false, // Prevent the dialog from closing on click outside
            hasBackdrop: true, // Allow interaction with the underlying page
            minWidth: '90vw',
            // minHeight: '90vh'
          });

          dialogRef.afterClosed().subscribe((result) => {
            // Handle any data returned from the dialog if needed
            // console.log('Dialog was closed with result:', result);
          });
        }
      })

    }
    else {

      const dialogRef = this.dialog.open(NewOrdersComponent, {
        data: this.newOrdersData, // Pass the 'item' data to the dialog component
        disableClose: false, // Prevent the dialog from closing on click outside
        hasBackdrop: true, // Allow interaction with the underlying page
        minWidth: '90vw',
        // minHeight: '90vh'
      });

      dialogRef.afterClosed().subscribe((result) => {
        // Handle any data returned from the dialog if needed
        // console.log('Dialog was closed with result:', result);
      });
    }
  }

  onOpenAssetDialog() {
    // const dialogRef = this.dialog.open(AssetsComponent, {
    //   disableClose: false, // Prevent the dialog from closing on click outside
    //   // hasBackdrop: false, // Allow interaction with the underlying page
    //   minWidth:'95vw',
    //   minHeight : '93vh',
    //   maxHeight:'93vh'
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   // Handle any data returned from the dialog if needed
    //   // console.log('Dialog was closed with result:', result);
    // });
  }
  // isMasterControlChecked: boolean = false;
  // onMasterControlChange(event: any) {
  //   if (event.checked) {
  //     this.openMasterControlDialog();
  //   }
  // }

  openMasterControlDialog() {

    const dialogRef = this.dialog.open(MasterControlComponent, {
      data: { location: 'sidenav' },
      disableClose: false,
      hasBackdrop: false

    });

    dialogRef.afterClosed().subscribe((result) => {
      // if (!result) {
      //   this.googleSheetApiServiceRef.checkMasterControl(false);


      // }
      // else if (result == 'token') {
      //   this.masterControl_Token = result
      //   this.googleSheetApiServiceRef.checkMasterControl(true)



      //   console.log(this.masterControl_Token)

      // }
      // // if (result === undefined) {
      // //   // Dialog was closed without submit action, uncheck the toggle
      // //   this.isMasterControlChecked = false;
      // // }
      // // localStorage.setItem('masterControl_Token','vgfchr67nhf b')


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
        this.loaderServiceRef.show(); // Show loader

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
            this.loaderServiceRef.hide(); // Show loader

          })
        }

        if (fileList_droveStorageData) {
          localStorage.removeItem('driveData');
        }



      }
    })
  }

  // #region Open AS Modal events 



  private touchStartTime = 0;
  private longPressDuration = 500; // Duration to consider as long press in milliseconds

  // Handle right-click (desktop)
  onMenuItemRightClick(event: MouseEvent, route: string): void {
    event.preventDefault(); // Prevent the default context menu
    this.openDialog(route);
  }

  // Handle touch start for long press (mobile)
  onMenuItemTouchStart(event: TouchEvent, route: string): void {
    this.touchStartTime = event.timeStamp;

    // Use RxJS to listen for the touch end event
    fromEvent(document, 'touchend').pipe(
      debounceTime(50), // Debounce time to avoid multiple triggers
      filter(() => (event.timeStamp - this.touchStartTime) >= this.longPressDuration)
    ).subscribe(() => {
      event.preventDefault(); // Prevent the default behavior
      this.openDialog(route);
    });
  }

  // Open dialog based on route
  private openDialog(route: string): void {
    let dialogRef;
    let componentTitle = '';

    // console.log(route)


    switch (route) {
      case 'trading-tools':
        componentTitle = 'Calculator';


        dialogRef = this.dialog.open(SidenavMenuAsDialogComponent, {
          data: {
            openType: 'DIAOG', title: componentTitle, componentName: route
          },
          disableClose: false,
          hasBackdrop: false,
          // width: '80vw', // Adjust width as needed
          // height: '80vh' // Adjust height as needed
        });
        dialogRef.afterClosed().subscribe((result) => {
          // Handle any data returned from the dialog if needed
          // console.log('Dialog was closed with result:', result);
        })
        this.handleNavLinkClickAutoCollapse()



        break;

      case 'logging':
        componentTitle = 'API Logs';

        dialogRef = this.dialog.open(SidenavMenuAsDialogComponent, {
          data: {
            openType: 'DIAOG', title: componentTitle, componentName: route
          },
          disableClose: false,
          hasBackdrop: false,
          minWidth: '89vw', // Adjust width as needed
          minHeight: '78vh' // Adjust height as needed
        });
        dialogRef.afterClosed().subscribe((result) => {
          // Handle any data returned from the dialog if needed
          // console.log('Dialog was closed with result:', result);
        })
        this.handleNavLinkClickAutoCollapse()



        break;




      // Add cases for other routes if needed
    }




    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        // Handle dialog result if needed
      });
    }
  }

  // #endregion




}
