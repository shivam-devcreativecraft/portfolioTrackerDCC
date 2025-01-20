import { Component, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { UpdateEntryComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/update-entry/update-entry.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from 'src/app/SharedComponents/confirm-dialog/confirm-dialog.component';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-delta-futures',
  templateUrl: './delta-futures.component.html',
  styleUrls: ['./delta-futures.component.scss'],
})
export class DeltaFuturesComponent implements OnDestroy {
  private exchangeName:string='Delta'; //for 1. MatTablle , 2. deleteEntry()
  private sheetName:string='Futures' //for 1. MatTablle , 2. deleteEntry()

  IsMasterControlEnabled: boolean = false;


  columnTotals: any = {
    Pnl_USDT: 0,
    MostFrequentTradingPair: 'NONE',
    HighestCount: 0,
    MostTradedDirection: 'NONE',
    MostTradedDirectionTrades: 0,
    TotalProfit: 0,
    TotalLoss: 0,
    TotalLossTrades: 0,
    TotalProfitTrades: 0,
    TotalBuyTrades: 0,
    TotalSellTrades: 0,
    TotalTrades: 0,
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



    this.displayedColumns=this.functionsServiceRef.delta_DisplayColumns.Futures
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

 
  // Initialize totals and properties
  tradingPairCounts: { [key: string]: number } = {};

  // HighestCount = 0;

  // Calculate column totals and find the most frequent trading pair
  calculateColumnTotals() {
    let buyCount = 0;
    let sellCount = 0;
    // Initialize totals
    this.sheetData.forEach((element: any) => {
      this.columnTotals.Pnl_USDT =
        this.columnTotals.Pnl_USDT + element.Pnl_USDT;

      if (element.Pnl_USDT < 0) {
        this.columnTotals.TotalLoss += element.Pnl_USDT;
        this.columnTotals.TotalLossTrades++;
      }
      if (element.Pnl_USDT > 0) {
        this.columnTotals.TotalProfit += element.Pnl_USDT;
        this.columnTotals.TotalProfitTrades++;
      }

      // most profit & loss

      if (element.Direction == 'BUY') {
        buyCount++;
        this.columnTotals.TotalBuyTrades = buyCount;
      }
      if (element.Direction == 'SELL') {
        sellCount++;
        this.columnTotals.TotalSellTrades = sellCount;
      }

      // Calculate most frequent trading pair
      let tradingPair = element.Trading_Pair;
      if (this.tradingPairCounts[tradingPair]) {
        this.tradingPairCounts[tradingPair]++;
      } else {
        this.tradingPairCounts[tradingPair] = 1;
      }
    });

    this.columnTotals.TotalTrades =
      this.columnTotals.TotalBuyTrades + this.columnTotals.TotalSellTrades;

    if (buyCount > sellCount) {
      this.columnTotals.MostTradedDirection = 'BUY/LONG';
      this.columnTotals.MostTradedDirectionTrades = buyCount;
    }
    if (sellCount > buyCount) {
      this.columnTotals.MostTradedDirection = 'SELL/SHORT';
      this.columnTotals.MostTradedDirectionTrades = sellCount;
    }
    if (sellCount == buyCount) {
      this.columnTotals.MostTradedDirection = 'All Equall';
      this.columnTotals.MostTradedDirectionTrades = 0;
    }

    // Find the most frequent trading pair
    for (const tradingPair in this.tradingPairCounts) {
      if (
        this.tradingPairCounts[tradingPair] > this.columnTotals.HighestCount
      ) {
        this.columnTotals.MostFrequentTradingPair = tradingPair;
        this.columnTotals.HighestCount = this.tradingPairCounts[tradingPair];
      }
    }

    // Check if all trading pairs have equal frequency
    const equalFrequencies = Object.values(this.tradingPairCounts).every(
      (count) => count == this.columnTotals.HighestCount
    );
    // Handle the condition where all pairs are equal
    if (equalFrequencies) {
      this.columnTotals.MostFrequentTradingPair = 'All Equal';
    }
  }
}
