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
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

import { ToastrService } from 'ngx-toastr';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { Subject, timestamp } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { BybitAPIService } from 'src/app/services/WorkingExchangeAPI/bybitAPI.service';
import { UpdateEntryComponent } from '../update-entry/update-entry.component';
import { MasterControlComponent } from '../../master-control/master-control.component';
import { MexcAPIService } from 'src/app/services/WorkingExchangeAPI/mexcAPI.service';
@Component({
  selector: 'app-futures',
  templateUrl: './futures.component.html',
  styleUrls: ['./futures.component.scss']
})
export class FuturesComponent implements OnInit {
  @Input() exchangeName!: string;
 private  sheetName: string='Futures';
  
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


  IsMasterControlEnabled: boolean = false;


  constructor(

    private functionsServiceRef: FunctionsService, private dataServiceRef: DataService, private bybitAPIServiceRef: BybitAPIService,
    private _dialog: MatDialog, private googleSheetAPIServiceRef: GoogleSheetApiService,
    private mexcAPIServiceRef: MexcAPIService

  ) {
    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })
  }

  ngOnInit() {

    // console.log("inputs (constructor) : ", " exchangename - ", this.exchangeName, " sheetNamr - ", this.sheetName)



    this.googleSheetAPIServiceRef.setSheetName(this.sheetName)

 

    if (this.exchangeName.toUpperCase() === 'MEXC') {

      this.getTradeHistoryRealtime('MEXC')

    }




    this.displayedColumns = this.functionsServiceRef.bybit_DisplayColumns.ACT_OFFICIAL
    this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', 1, this, this.componentDestroyed$)
      .then((sheetData) => {

        if (sheetData) {
          this.calculateColumnTotals()
          if (this.orderHistoryRealtime) {
            this.checkForNewEntries();
          }
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


  // Initialize totals and properties
  tradingPairCounts: { [key: string]: number } = {};
  // MostFrequentTradingPair = '';
  // HighestCount = 0;

  // Calculate column totals and find the most frequent trading pair
  calculateColumnTotals() {
    let buyCount = 0;
    let sellCount = 0;
    // Initialize totals
    this.sheetData.forEach((element: any) => {
      this.columnTotals.Pnl_USDT =
        this.columnTotals.Pnl_USDT + (element.Pnl_USDT ? element.Pnl_USDT : 0);
      if (element.Pnl_USDT < 0) {
        this.columnTotals.TotalLoss += element.Pnl_USDT;
        this.columnTotals.TotalLossTrades++;
      }
      if (element.Pnl_USDT > 0) {
        this.columnTotals.TotalProfitTrades++;
        this.columnTotals.TotalProfit += element.Pnl_USDT;
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
      let tradingPair = element.Coin;
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







  // ----------------New ORder--------------STARTS
  private orderHistoryRealtime: any;

  async getTradeHistoryRealtime(exchangeName: string) {



    const category = 'limit';
    const limit = 1000
    try {
   
      // --------------
      if (exchangeName.toUpperCase() === 'MEXC') {


        const tradeHistory = await this.mexcAPIServiceRef.getPositionHistoryMexcFutures();

        if (tradeHistory) {
          // console.log(tradeHistory)


          const orderHistoryRealtime_temp = tradeHistory.map((element: any) => {
            const formatDate = (timestamp: string) => {
              const myDate = new Date(parseInt(timestamp))
              return `${myDate.getFullYear()}-${(myDate.getMonth() + 1).toString().padStart(2, '0')}-${myDate.getDate().toString().padStart(2, '0')} ${myDate.getHours().toString().padStart(2, '0')}:${myDate.getMinutes().toString().padStart(2, '0')}:${myDate.getSeconds().toString().padStart(2, '0')}`;

            }

            const formattedCreatedTime = formatDate(element.createTime);
            const formattedUpdateTime = formatDate(element.updateTime);

            return {
              ...element,
              createTime: formattedCreatedTime,
              updateTime: formattedUpdateTime,
              positionType: element.positionType == 1 ? 'BUY' : element.positionType == 2 ? 'SELL' : 'error changing positionType',
              openType: element.openType == 1 ? 'Market' : element.openType == 2 ? 'Limit' : 'error changing openType',

              symbol: element.symbol.replace('_USDT', ''),  // Update the symbol
              closeVol: this.dataServiceRef.getStaticSymbolContractValue(element.closeVol, element.symbol),
              
            };

          });

          this.orderHistoryRealtime = orderHistoryRealtime_temp
            .sort((a: any, b: any) => {
              const timeA = new Date(a.updateTime).getTime();
              const timeB = new Date(b.updateTime).getTime();
              return timeB - timeA;
            });

        }
        // console.log(this.orderHistoryRealtime)
      }
      // -----------------

    }
    catch (error) {
      // Handle errors here if needed
      console.error('Error in fetching trade history:', error);
    }
  }

  orderHistoryRealtime_NotSaved: any[] = [];

  IsNewOrder: boolean = false;

  checkForNewEntries() {

    this.IsNewOrder = false;
    const newUniqueTrades = [];

    // Iterate through orderHistoryRealtime
    for (const order of this.orderHistoryRealtime) {
      const updateTime = order.updateTime;

      // Check if the trade is unique
      const isPresentInSheetData = this.sheetData.some(
        (sheetTrade) => sheetTrade.Close_Date === updateTime
      );

      if (!isPresentInSheetData) {
        // Add the trade to the NewOrders array
        newUniqueTrades.push(order);
      }
    }

    // Add a new entry to orderHistoryRealtime_NotSaved
    this.orderHistoryRealtime_NotSaved.push({
      ExchangeName: this.exchangeName, // Set your predefined value here
      SheetName: this.sheetName,    // Set your predefined value here
      NewOrders: newUniqueTrades,
    });
    this.dataServiceRef.updateOrderHistory(this.orderHistoryRealtime_NotSaved);
    // console.log("Trade history closed pnl bybit/futures (not saved)", this.orderHistoryRealtime_NotSaved)

    this.IsNewOrder = true;

    // console.log("New Unique Trades to Save (orderHistoryRealtime_NotSaved) : ",this.orderHistoryRealtime_NotSaved);
  }
  // ----------------New ORder--------------ENDS






}
