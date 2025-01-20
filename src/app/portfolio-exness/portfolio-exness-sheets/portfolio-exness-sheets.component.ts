import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { AddNewComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/add-new/add-new.component';

@Component({
  selector: 'app-portfolio-exness-sheets',
  templateUrl: './portfolio-exness-sheets.component.html',
  styleUrls: ['./portfolio-exness-sheets.component.scss']
})
export class PortfolioExnessSheetsComponent implements OnInit
{
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
    
    // this.googleSheetAPIServiceRef.setSheetName('Demo')
    this.googleSheetAPIServiceRef.selectedSheetName$.subscribe(
      (sheetName) => {
        this.selectedSheetName = sheetName;
        // Handle the selected sheet name change here
      }
    );
    // this.router.navigate([
    //   'portfolio-exness',
    //   'portfolio-exness-sheets',
    //   'exness-demo',



    // ]);

  
  }
  ngOnInit(): void {
    this.onSheetSelect(this.selectedSheetName)
    
  }
  // <!-- -----------------------ENDS floating sheet button --------------------------- -->
  async onSheetSelect(sheetName: string) {
    this.googleSheetAPIServiceRef.setSheetName(sheetName);

    switch (sheetName) {
      case 'Real':
        // this.googleSheetApiRef.selectedSheetNamefreebitco='SIP'
        this.router.navigate([
          'portfolio-exness',
          'portfolio-exness-sheets',
          'exness-real',
        ]);
        this.openMenu = false;

        break;
      case 'Demo':
        // this.googleSheetApiRef.selectedSheetNamefreebitco='P2P'

        this.router.navigate([
          'portfolio-exness',
          'portfolio-exness-sheets',
          'exness-demo',
        ]);
        this.openMenu = false;
        break;

           
    }
  }

  // modal code
  // closeResult = '';
  // open(addModal: any) {
  //   this.modalService
  //     .open(addModal, {
  //       backdrop: true,
  //       size: 'lg',
  //       centered: true,
  //       // windowClass: 'modal-modified',
  //       // scrollable: true,
  //       keyboard: false,
  //     })
  //     .result.then(
  //       (result) => {
  //         this.closeResult = `Closed with: ${result}`;
  //       },
  //       (reason) => {
  //         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //       }
  //     );
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }

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
              data : {ExchangeName : 'Exness', SheetName : 'ACT_Forex_Demo'},
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
        data : {ExchangeName : 'Exness', SheetName : 'ACAT_Forex_Demo'},
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
