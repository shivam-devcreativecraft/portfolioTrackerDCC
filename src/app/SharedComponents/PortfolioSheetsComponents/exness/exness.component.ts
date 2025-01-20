import {
  Component,
  OnInit,
  ViewChild,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { DataService } from 'src/app/services/data.service';
import { MasterControlComponent } from '../../master-control/master-control.component';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { UpdateEntryComponent } from '../update-entry/update-entry.component';
@Component({
  selector: 'app-exness',
  templateUrl: './exness.component.html',
  styleUrls: ['./exness.component.scss']
})
export class ExnessComponent implements OnInit {
  @Input() exchangeName!: string;
  @Input() sheetName!: string;



  totalInvested_Temp: number = 50;
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
    Balance: 0,
    TotalInvested: 0
  };

  IsMasterControlEnabled: boolean = false;


  constructor(

    private functionsServiceRef: FunctionsService, private dataServiceRef: DataService, private googleSheetAPIServiceRef:GoogleSheetApiService, 
    private _dialog: MatDialog,

  ) {

    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })


  }

  ngOnInit() {





    this.googleSheetAPIServiceRef.setSheetName(this.sheetName)


    this.displayedColumns = this.functionsServiceRef.exness_DisplayColumns.Exness
    this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', 1, this, this.componentDestroyed$)
      .then((sheetData) => {
        if (sheetData) {

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
    this.dataServiceRef.sendDestroyObservable(true);

    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', this.currentPage + 1, this, this.componentDestroyed$);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', this.currentPage - 1, this, this.componentDestroyed$);
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

  tradingPairCounts: { [key: string]: number } = {};

  calculateColumnTotals() {
    let buyCount = 0;
    let sellCount = 0;
    this.columnTotals.TotalInvested = this.totalInvested_Temp;
    // Initialize totals
    this.sheetData.forEach((element: any) => {
      this.columnTotals.Pnl_USDT =
        this.columnTotals.Pnl_USDT + element.Pnl_USDT;

      this.columnTotals.Balance = this.columnTotals.TotalInvested + this.columnTotals.Pnl_USDT


      if (element.Pnl_USDT < 0) {
        this.columnTotals.TotalLoss += element.Pnl_USDT;
        this.columnTotals.TotalLossTrades++;
      }
      if (element.Pnl_USDT > 0) {
        this.columnTotals.TotalProfitTrades++;
        this.columnTotals.TotalProfit += element.Pnl_USDT;
      }

      // most profit & loss

      if (element.Type == 'BUY') {
        buyCount++;
        this.columnTotals.TotalBuyTrades = buyCount;
      }
      if (element.Type == 'SELL') {
        sellCount++;
        this.columnTotals.TotalSellTrades = sellCount;
      }

      // Calculate most frequent trading pair
      let tradingPair = element.Symbol;
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
      (count) => count === this.columnTotals.HighestCount
    );

    // Handle the condition where all pairs are equal
    if (equalFrequencies) {
      this.columnTotals.MostFrequentTradingPair = 'All Equal';
    }

  }


}
