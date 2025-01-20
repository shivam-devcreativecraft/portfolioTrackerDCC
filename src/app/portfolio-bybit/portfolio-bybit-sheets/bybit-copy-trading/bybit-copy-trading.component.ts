import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../../SharedComponents/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { Subject } from 'rxjs';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { UpdateEntryComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/update-entry/update-entry.component';

@Component({
  selector: 'app-bybit-copy-trading',
  templateUrl: './bybit-copy-trading.component.html',
  styleUrls: ['./bybit-copy-trading.component.scss'],
})
export class BybitCopyTradingComponent implements OnDestroy {
  private exchangeName:string='Bybit'; //for 1. MatTablle , 2. deleteEntry()
  private sheetName:string='Copy_Trading' //for 1. MatTablle , 2. deleteEntry()


  IsMasterControlEnabled: boolean = false;


  columnTotals: any = {
    WiseAdvicePNLUSDT: 0,
    WiseAdvicePNLPercentage: 0,
    BitcoinMaster9PNLUSDT: 0,
    BitcoinMaster9PNLPercentage: 0,
    BITCOINPNLUSDT: 0,
    BITCOINPNLPercentage: 0,
    TotalPNLUSDT: 0,
    TotalPNLPercentage: 0,
  };
  
  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private _dialog: MatDialog,
    private toastr: ToastrService,
    private functionsServiceRef: FunctionsService

  ) {


    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })


    this.displayedColumns=this.functionsServiceRef.bybit_DisplayColumns.Copy_Trading
    this.functionsServiceRef.loadSheetData(this.exchangeName,this.sheetName, '', 1, this, this.componentDestroyed$)
    .then((sheetData)=>{
      if(sheetData){
        this.calculateColumnTotals() 
      }
    })

 
  }
 
 //#region Material Table
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;

 displayedColumns: string[] = [];
 dataSource!: MatTableDataSource<any>;

 private componentDestroyed$: Subject<void> = new Subject<void>();

 IsSelectedSheetDataLoaded: boolean = false;
 sheetData: any[] = [];
 currentPage = 1;
 totalPages = 1;
 pagesLoaded = 0;
 pageSizeOptions = 0;


 ngOnDestroy(): void {
   this.componentDestroyed$.next();
   this.componentDestroyed$.complete();
 }


 nextPage() {
   if (this.currentPage < this.totalPages) {
     this.functionsServiceRef.loadSheetData(this.exchangeName,this.sheetName, '', this.currentPage + 1, this, this.componentDestroyed$);
   }
 }

 prevPage() {
   if (this.currentPage > 1) {
     this.functionsServiceRef.loadSheetData(this.exchangeName,this.sheetName, '', this.currentPage - 1, this, this.componentDestroyed$);
   }
 }

 applyFilter(event: Event) {
   const filterValue = (event.target as HTMLInputElement).value;
   this.dataSource.filter = filterValue.trim().toLowerCase();

   if (this.dataSource.paginator) {
     this.dataSource.paginator.firstPage();
   }
 }
 //#endregion



 editItem(item: any) {
  // console.log("Edit Method's item on edit click : ", item)

  if (!this.IsMasterControlEnabled) {

    const dialogRef = this._dialog.open(MasterControlComponent, {
      disableClose: false,
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        const dialogRef = this._dialog.open(UpdateEntryComponent, {

          data: {
            tradeData: item, sheetName: this.sheetName, exchangeName: this.exchangeName
          }, // Pass the 'item' data to the dialog component
          disableClose: false, // Prevent the dialog from closing on click outside
          hasBackdrop: false, // Allow interaction with the underlying page

        });
        dialogRef.afterClosed().subscribe((result) => {
          // Handle any data returned from the dialog if needed
          // console.log('Dialog was closed with result:', result);
        })

      }
    })


  }

  else {

    const dialogRef = this._dialog.open(UpdateEntryComponent, {

      data: {
        tradeData: item, sheetName: this.sheetName, exchangeName: this.exchangeName
      }, // Pass the 'item' data to the dialog component
      disableClose: false, // Prevent the dialog from closing on click outside
      hasBackdrop: false, // Allow interaction with the underlying page

    });
    dialogRef.afterClosed().subscribe((result) => {
      // Handle any data returned from the dialog if needed
      // console.log('Dialog was closed with result:', result);
    })
  }
}


deleteEntry(ID: number, element: any) {
  if (!this.IsMasterControlEnabled) {
    if (!this.IsMasterControlEnabled) {

      const dialogRef = this._dialog.open(MasterControlComponent, {
        disableClose: false,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.functionsServiceRef.deleteEntry(this.exchangeName, this.sheetName, ID)
        }
      })

    }
  }

  else {
    this.functionsServiceRef.deleteEntry(this.exchangeName, this.sheetName, ID)
  }

}




  calculateColumnTotals() {
    this.sheetData.forEach((element: any) => {
      if (element.Master_Name.toUpperCase() == 'WISEADVICE') {
        this.columnTotals.WiseAdvicePNLUSDT += element.Pnl_USDT;
        this.columnTotals.WiseAdvicePNLPercentage += element.ROI;
      }
      if (element.Master_Name.toUpperCase() == 'BITCOINMASTER9') {
        this.columnTotals.BitcoinMaster9PNLUSDT += element.Pnl_USDT;
        this.columnTotals.BitcoinMaster9PNLPercentage += element.ROI;
      }
      if (element.Master_Name.toUpperCase() == 'BITCOIN') {
        this.columnTotals.BITCOINPNLUSDT += element.Pnl_USDT;
        this.columnTotals.BITCOINPNLPercentage += element.ROI;
      }
    });

    this.columnTotals.TotalPNLUSDT =
      this.columnTotals.WiseAdvicePNLUSDT +
      this.columnTotals.BitcoinMaster9PNLUSDT +
      this.columnTotals.BITCOINPNLUSDT;
    this.columnTotals.TotalPNLPercentage =
      this.columnTotals.WiseAdvicePNLPercentage +
      this.columnTotals.BitcoinMaster9PNLPercentage +
      this.columnTotals.BITCOINPNLPercentage;
  }
}
