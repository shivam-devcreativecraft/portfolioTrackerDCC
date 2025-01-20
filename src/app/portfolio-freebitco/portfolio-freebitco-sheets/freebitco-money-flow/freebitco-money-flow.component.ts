import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { UpdateEntryComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/update-entry/update-entry.component';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';

@Component({
  selector: 'app-freebitco-money-flow',
  templateUrl: './freebitco-money-flow.component.html',
  styleUrls: ['./freebitco-money-flow.component.scss']
})
export class FreebitcoMoneyFlowComponent implements OnInit, OnDestroy {
  private exchangeName: string = 'Freebitco'; //for 1. MatTablle , 2. deleteEntry()
  private sheetName: string = 'Money_Flow' //for 1. MatTablle , 2. deleteEntry()


  IsMasterControlEnabled: boolean = false;


  columnTotals: any = {
    TotalDeposit: 0,
    TotalWithdraw: 0,
    AvgDepositPrice: 0,
    AvgWithdrawPrice: 0
  };

  

  IsColumnTotalExecuted: boolean = false;


  constructor(
    private functionsServiceRef: FunctionsService,
    private _dialog: MatDialog,
    private googleSheetAPIServiceRef: GoogleSheetApiService,


  ) {


    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })
  }


  ngOnInit(): void {
    this.googleSheetAPIServiceRef.setSheetName(this.sheetName)

    this.displayedColumns = this.functionsServiceRef.freebitco_DisplayColumns.Money_Flow;
    this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 200, 1, this, this.componentDestroyed$)
      .then((sheetData) => {
        if (sheetData) {
          this.calculateColumnTotals()
        }
      });
  }


  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
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



  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 200, this.currentPage + 1, this, this.componentDestroyed$);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 200, this.currentPage - 1, this, this.componentDestroyed$);
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


    let depositCount = 0;
    let withdrawCount = 0;
    let totalDepositPrice = 0;
    let totalWithdrawPrice = 0;

    this.sheetData.forEach((element: any) => {
      if (element.Type.toUpperCase() == 'DEPOSIT') {
        this.columnTotals.TotalDeposit += element.Quantity;

        totalDepositPrice += element.Price;
        depositCount++;



      } else if (element.Type.toUpperCase() == 'WITHDRAW') {
        this.columnTotals.TotalWithdraw += element.Quantity;

        totalWithdrawPrice += element.Price;
        withdrawCount++;


      }

    });

    this.columnTotals.AvgDepositPrice = depositCount > 0 ? totalDepositPrice / depositCount : 0;
    this.columnTotals.AvgWithdrawPrice = withdrawCount > 0 ? totalWithdrawPrice / withdrawCount : 0;


    console.log(this.columnTotals, this.sheetData)
    // this.columnTotals.TotalBalance =
    //   this.columnTotals.TotalDeposit - this.columnTotals.TotalWithdraw;
  }


}
