import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { AddNewComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/add-new/add-new.component';

@Component({
  selector: 'app-portfolio-ourbit-sheets',
  templateUrl: './portfolio-ourbit-sheets.component.html',
  styleUrls: ['./portfolio-ourbit-sheets.component.scss']
})
export class PortfolioOurbitSheetsComponent implements OnInit{
  selectedSheetName: string = '';
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

    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })


    // this.googleSheetAPIServiceRef.setSheetName('Spot_Trades')
    this.googleSheetAPIServiceRef.selectedSheetName$.subscribe(
      (sheetName) => {
        this.selectedSheetName = sheetName;
        // Handle the selected sheet name change here
      }
    );


    this.onSheetSelect(this.selectedSheetName)


    // this.router.navigate([
    //   'portfolio-ourbit',
    //   'portfolio-ourbit-sheets',
    //   'ourbit-futures',




    // ]);

  }

  ngOnInit(): void {
    this.onSheetSelect(this.selectedSheetName)
    
  }


  // <!-- -----------------------ENDS floating sheet button --------------------------- -->
  onSheetSelect(sheetName: string) {
    this.googleSheetAPIServiceRef.setSheetName(sheetName)


    switch (sheetName) {
      case 'Money_Flow':
        // this.googleSheetApiRef.selectedSheetName='SIP'
        this.router.navigate([
          'portfolio-ourbit',
          'portfolio-ourbit-sheets',
          'ourbit-money_flow',
        ]);
        this.openMenu = false;

        break;




      case 'Futures':

        this.router.navigate([
          'portfolio-ourbit',
          'portfolio-ourbit-sheets',
          'ourbit-futures',
        ]);
        this.openMenu = false;
        break;

      case 'Futures_Transfers':

        this.router.navigate([
          'portfolio-ourbit',
          'portfolio-ourbit-sheets',
          'ourbit-futures_transfers',
        ]);
        this.openMenu = false;
        break;

        case 'Spot_Trades':

        this.router.navigate([
          'portfolio-ourbit',
          'portfolio-ourbit-sheets',
          'ourbit-spot_trades',
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


            const dialogRef = this._dialog.open(AddNewComponent, {
              data: { ExchangeName: 'Ourbit', SheetName: 'Futures' },
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

      const dialogRef = this._dialog.open(AddNewComponent, {
        data: { ExchangeName: 'Ourbit', SheetName: 'Futures' },
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
