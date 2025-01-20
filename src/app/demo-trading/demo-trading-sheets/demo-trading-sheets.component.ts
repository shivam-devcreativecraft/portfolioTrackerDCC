import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { AddDemoTradingDeltaFuturesComponent } from '../add-demo-trading-delta-futures/add-demo-trading-delta-futures.component';



@Component({
  selector: 'app-demo-trading-sheets',
  templateUrl: './demo-trading-sheets.component.html',
  styleUrls: ['./demo-trading-sheets.component.scss']
})
export class DemoTradingSheetsComponent implements OnInit {
  selectedSheetName: string = 'Delta_Futures';
  // <!-- -----------------------STARTS floating sheet button --------------------------- -->
  public openMenu: boolean = false;
  isOver = false;

  IsMasterControlEnabled: boolean = false;

  clickMenu() {
    this.openMenu = !this.openMenu;
  }

  constructor(
    private router: Router,
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private _dialog: MatDialog,

  ) {


  }

ngOnInit(): void {

  this.googleSheetAPIServiceRef.setSheetName(this.selectedSheetName)


  this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
    this.IsMasterControlEnabled = IsEnabled;
  })


  
  this.googleSheetAPIServiceRef.selectedSheetName$.subscribe(
    (sheetName) => {
      this.selectedSheetName = sheetName;
    }
  );

  
}


  // <!-- -----------------------ENDS floating sheet button --------------------------- -->
  onSheetSelect(sheetName: string) {
    this.googleSheetAPIServiceRef.setSheetName(sheetName)


    switch (sheetName) {
      case 'Delta_Futures':
        // this.googleSheetApiRef.selectedSheetName='SIP'
        this.router.navigate([
          'demo-trading',
          'demo-trading-sheets',
          'delta-exchange',
        ]);
        this.openMenu = false;

        break;




      case 'Futures':

        this.router.navigate([
          'demo-trading',
          'demo-trading-sheets',
          'futures',
        ]);
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


            const dialogRef = this._dialog.open(AddDemoTradingDeltaFuturesComponent, {
              data: { ExchangeName: 'Demo_Trading', SheetName: 'Delta_Futures' },
              disableClose: false, // Prevent the dialog from closing on click outside
              hasBackdrop: false, // Allow interaction with the underlying page
            });

            dialogRef.afterClosed().subscribe(result => {
              this.IsAddDialogOpened = false

              // Handle any data returned from the dialog if needed
              // console.log('Dialog was closed with result:', result);
            });
          }
        })

      }
    }

    else {

      const dialogRef = this._dialog.open(AddDemoTradingDeltaFuturesComponent, {
        data: { ExchangeName: 'Demo_Trading', SheetName: 'Delta_Futures' },
        disableClose: false, // Prevent the dialog from closing on click outside
        hasBackdrop: false, // Allow interaction with the underlying page
      });

      dialogRef.afterClosed().subscribe(result => {
        this.IsAddDialogOpened = false

        // Handle any data returned from the dialog if needed
        // console.log('Dialog was closed with result:', result);
      });

    }
  }
}
