import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

import { ToastrService } from 'ngx-toastr';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { AddNewComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/add-new/add-new.component';

@Component({
  selector: 'app-portfolio-binance-sheets',
  templateUrl: './portfolio-binance-sheets.component.html',
  styleUrls: ['./portfolio-binance-sheets.component.scss']
})
export class PortfolioBinanceSheetsComponent implements OnInit{
  selectedSheetName: string = ''
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

    
    // this.googleSheetAPIServiceRef.setSheetName('Spot_Trades')
    this.googleSheetAPIServiceRef.selectedSheetName$.subscribe(
      (sheetName) => {
      this.selectedSheetName = sheetName;
      // Handle the selected sheet name change here
    });
   

    // this.router.navigate([
    //   'portfolio-binance',
    //   'portfolio-binance-sheets',
    //   'binance-spot_trades',


    // ]);


  }
ngOnInit(): void {
  this.onSheetSelect(this.selectedSheetName)
  
}

  // <!-- -----------------------ENDS floating sheet button --------------------------- -->
  async onSheetSelect(sheetName: string) {
    this.googleSheetAPIServiceRef.setSheetName(sheetName);

    switch (sheetName) {

      case 'P2P':

        this.router.navigate(['portfolio-binance', 'portfolio-binance-sheets', 'binance-p2p']);
        this.openMenu = false;
        break;

      case 'Spot_Trades':
        this.router.navigate(['portfolio-binance', 'portfolio-binance-sheets', 'binance-spot_trades']);
        this.openMenu = false;

        break;


      case 'FunBuySell_For_FreeBitco':
        this.router.navigate(['portfolio-binance', 'portfolio-binance-sheets', 'binance-FunBuySell_For_FreeBitco']);
        this.openMenu = false;

        break;


      case 'Money_Flow_Crypto':
        this.router.navigate(['portfolio-binance', 'portfolio-binance-sheets', 'binance-money_flow_crypto']);
        this.openMenu = false;

        break;


      case 'Futures_PNL':
        this.router.navigate(['portfolio-binance', 'portfolio-binance-sheets', 'binance-futures_pnl']);
        this.openMenu = false;

        break;

      case 'Old_Withdraws':
        this.router.navigate(['portfolio-binance', 'portfolio-binance-sheets', 'binance-old_withdraws']);
        this.openMenu = false;

        break;

      case 'Futures_Trade':
        this.router.navigate(['portfolio-binance', 'portfolio-binance-sheets', 'binance-futures_trade']);
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
              data : {ExchangeName : 'Binance', SheetName : 'Spot_Trades'},
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
        data : {ExchangeName : 'Binance',  SheetName : 'Spot_Trades'},
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
