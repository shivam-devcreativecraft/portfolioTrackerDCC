import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { AddNewComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/add-new/add-new.component';

@Component({
  selector: 'app-portfolio-delta-sheets',
  templateUrl: './portfolio-delta-sheets.component.html',
  styleUrls: ['./portfolio-delta-sheets.component.scss']
})
export class PortfolioDeltaSheetsComponent  implements OnInit{
  selectedSheetName: string = '';
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
    private _dialog: MatDialog,

  ) {

    
    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })

    // this.googleSheetAPIServiceRef.setSheetName('Money_Flow')
    this.googleSheetAPIServiceRef.selectedSheetName$.subscribe(
      (sheetName) => {
        this.selectedSheetName = sheetName;
        // Handle the selected sheet name change here
      }
    );
    // this.router.navigate([
    //   'portfolio-delta',
    //   'portfolio-delta-sheets',
    //   'delta-money_flow',




    // ]);

  }
  ngOnInit(): void {
    this.onSheetSelect(this.selectedSheetName)
    
  }
  // <!-- -----------------------ENDS floating sheet button --------------------------- -->
  async onSheetSelect(sheetName: string) {
    this.googleSheetAPIServiceRef.setSheetName(sheetName);

    switch (sheetName) {
      case 'Futures':
        // this.googleSheetApiRef.selectedSheetNameMexc='SIP'
        this.router.navigate([
          'portfolio-delta',
          'portfolio-delta-sheets',
          'delta-futures',
        ]);
        this.openMenu = false;

        break;
      case 'Options':
        // this.googleSheetApiRef.selectedSheetNameMexc='P2P'

        this.router.navigate([
          'portfolio-delta',
          'portfolio-delta-sheets',
          'delta-options',
        ]);
        this.openMenu = false;
        break;

      case 'Money_Flow':
        this.router.navigate([
          'portfolio-delta',
          'portfolio-delta-sheets',
          'delta-money_flow'
        ])
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
              data : {ExchangeName : 'Delta', SheetName : 'Money_Flow'},
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
        data : {ExchangeName : 'Delta', SheetName : 'Money_Flow'},
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
