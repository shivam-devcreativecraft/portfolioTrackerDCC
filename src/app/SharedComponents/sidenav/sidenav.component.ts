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
  selectedLink: any;//for routing
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  newOrdersData: any;
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
    
    private googleSheetApiServiceRef: GoogleSheetApiService,
    private loaderServiceRef: LoaderService
  ) {


    this.dataServiceRef.getDestroyObservable().subscribe((flag: boolean) => {
      // Handle the received data in your constructor...
      // console.log('flag : ', flag)
      this.destroyedComponentFlag = flag
    });

    this.googleSheetApiServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })

    



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
  // isTradeSetupActive(): boolean {
  //   const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
  //   const targetUrlPrefix = '/trade-setup';
  //   return currentUrl.startsWith(targetUrlPrefix);
  // }
  isTradingViewActive(): boolean {
    const currentUrl = (this.activatedRoute.snapshot as any)['_routerState'].url;
    const targetUrlPrefix = '/tradingview';
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

  // open_SpotCoin_Search_Dialog() {
  //   const dialogRef = this.dialog.open(SearchSpotCoinDialogComponent, {
  //     // data: item, // Pass the 'item' data to the dialog component
  //     disableClose: false, // Prevent the dialog from closing on click outside
  //     hasBackdrop: false, // Allow interaction with the underlying page
  //     // panelClass: ['draggable-dialog']
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     // Handle any data returned from the dialog if needed
  //     // console.log('Dialog was closed with result:', result);
  //   });
  // }

//   refresh() {

//  const currentUrl = this.router.url;
//         console.log(currentUrl)
//         this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {

//           this.router.navigate([currentUrl]);
//         });

//   }



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

 

}
