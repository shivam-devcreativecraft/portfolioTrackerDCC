import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddNewComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/add-new/add-new.component';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-open-orders-aio-sheets',
  templateUrl: './open-orders-aio-sheets.component.html',
  styleUrls: ['./open-orders-aio-sheets.component.scss']
})
export class OpenOrdersAioSheetsComponent {
  selectedOpenOrdersAIOExchangeName: string = ''
  IsMasterControlEnabled: boolean = false;

  // <!-- -----------------------STARTS floating sheet button --------------------------- -->
  public openMenu: boolean = false;
  isOver = false;

  clickMenu() {
    this.openMenu = !this.openMenu;
  }


  constructor(
    private router: Router,
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private toastr: ToastrService,
    private _dialog: MatDialog,


  ) {


    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })

    
    this.googleSheetAPIServiceRef.selectedSheetName$.subscribe((sheetName) => {
      this.selectedOpenOrdersAIOExchangeName = sheetName;
      // Handle the selected sheet name change here
    });

    // this.googleSheetAPIServiceRef.setSheetName(this.selectedOpenOrdersAIOExchangeName)
    this.onSheetSelect(this.selectedOpenOrdersAIOExchangeName)

    // this.router.navigate(['open-orders-aio', 'open-orders-aio-sheets', 'open-orders-binance']);



  }


  // <!-- -----------------------ENDS floating sheet button --------------------------- -->
  async onSheetSelect(sheetName: string) {
    this.googleSheetAPIServiceRef.setSheetName(sheetName);

    switch (sheetName) {

      case 'Binance':

        this.router.navigate(['open-orders-aio', 'open-orders-aio-sheets', 'open-orders-binance']);
        this.openMenu = false;
        break;

      case 'Bybit':
        this.router.navigate(['open-orders-aio', 'open-orders-aio-sheets', 'open-orders-bybit']);

        this.openMenu = false;

        break;


      case 'Mexc':
        this.router.navigate(['open-orders-aio', 'open-orders-aio-sheets', 'open-orders-mexc']);

        this.openMenu = false;

        break;


      case 'Kucoin':
        this.router.navigate(['open-orders-aio', 'open-orders-aio-sheets', 'open-orders-kucoin']);

        this.openMenu = false;

        break;


      case 'Gateio':
        this.router.navigate(['open-orders-aio', 'open-orders-aio-sheets', 'open-orders-gateio']);

        this.openMenu = false;

        break;

    }
  }


  IsAddDialogOpened: boolean = false;

  openAddNewEntryDialogForm() {
    this.IsAddDialogOpened = true;

    if (!this.IsMasterControlEnabled) {
      if (!this.IsMasterControlEnabled) {

        const dialogRef = this._dialog.open(MasterControlComponent, {
          disableClose: false,
          hasBackdrop: true
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {


            const dialogRef = this._dialog.open(AddNewComponent, {
              data : {ExchangeName : this.selectedOpenOrdersAIOExchangeName, SheetName : 'SIP_Open_Orders', Location : 'Orders'},
              disableClose: false, // Prevent the dialog from closing on click outside
              hasBackdrop: false, // Allow interaction with the underlying page
            });

            dialogRef.afterClosed().subscribe(result => {
              this.IsAddDialogOpened=false

              // Handle any data returned from the dialog if needed
              // console.log('Dialog was closed with result:', result);
            });
          }
        })

      }
    }

    else {

      const dialogRef = this._dialog.open(AddNewComponent, {
        data : {ExchangeName : this.selectedOpenOrdersAIOExchangeName, SheetName : 'SIP_Open_Orders', Location : 'Orders'},
        disableClose: false, // Prevent the dialog from closing on click outside
        hasBackdrop: false, // Allow interaction with the underlying page
      });

      dialogRef.afterClosed().subscribe(result => {
        this.IsAddDialogOpened=false

        // Handle any data returned from the dialog if needed
        // console.log('Dialog was closed with result:', result);
      });

    }
  }
}
