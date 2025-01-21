import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { AddDemoTradingDeltaFuturesComponent } from '../add-demo-trading-delta-futures/add-demo-trading-delta-futures.component';
import { NotificationService } from 'src/app/services/notification.service';



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
    private notificationService: NotificationService
  ) {


  }

ngOnInit(): void {

  // this.googleSheetAPIServiceRef.setSheetName(this.selectedSheetName)


  this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
    this.IsMasterControlEnabled = IsEnabled;
  })


  
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
