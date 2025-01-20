
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import {
  ConfirmDialogModel,
  ConfirmDialogComponent,
} from '../../../SharedComponents/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { Subject } from 'rxjs';
import { BybitAPIService } from 'src/app/services/WorkingExchangeAPI/bybitAPI.service';
import { DataService } from 'src/app/services/data.service';
import { BybitAPICopyTradingAccountService } from 'src/app/services/WorkingExchangeAPI/bybit-apicopy-trading-account.service';
// import { UpdateEntryComponent } from '../update-entry/update-entry.component';
// import { MasterControlComponent } from '../../master-control/master-control.component';
import { BybitAPIDemoService } from 'src/app/services/WorkingExchangeAPI/bybit-api-demo.service';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { UpdateEntryComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/update-entry/update-entry.component';


@Component({
  selector: 'app-bybit-futures-closed-pnl-demo',
  templateUrl: './bybit-futures-closed-pnl-demo.component.html',
  styleUrls: ['./bybit-futures-closed-pnl-demo.component.scss']
})
export class BybitFuturesClosedPnlDemoComponent {
  exchangeName:string='Bybit'; //for 1. MatTablle , 2. deleteEntry()
  sheetName:string='Futures_Closed_Pnl_Demo' //for 1. MatTablle , 2. deleteEntry()
  
  
  columnTotals: any = {
    Closed_Pnl: 0,
    MostFrequentTradingPair: 'NONE',
    HighestCount: 0,
    MostTradedDirection: 'NONE',
    MostTradedDirectionTrades: 0,
    TotalProfit: 0,
    TotalLoss: 0,
    TotalBuyTrades: 0,
    TotalSellTrades: 0,
    TotalProfitTrades: 0,
    TotalLossTrades: 0,
    TotalTrades: 0,
  };

  IsMasterControlEnabled: boolean = false;


  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private _dialog: MatDialog,
    private toastr: ToastrService,
    private functionsServiceRef: FunctionsService,
    private bybitAPIServiceRef: BybitAPIService,
    private bybitAPIDemoServiceRef: BybitAPIDemoService,

    private bybitAPICopyTradingAccountServiceRef: BybitAPICopyTradingAccountService,
    private dataServiceRef: DataService

  ) {


    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })

  }


  ngOnInit() {

    this.googleSheetAPIServiceRef.setSheetName(this.sheetName)

    
    let account;

    if (this.exchangeName != '' && this.sheetName != '') {

      if (this.sheetName == 'Futures_Closed_Pnl') {

        this.getClosedPnlRealtime('Real', 'Main', 'linear', 1000);
      }

      if (this.sheetName == 'Futures_Closed_Pnl_Copy_Trader_Master') {
        this.getClosedPnlRealtime('Real', 'Main', 'linear', 1000);
      }

      if (this.sheetName == 'Futures_Closed_Pnl_Demo') {

        this.getClosedPnlRealtime('Demo', 'Main', 'linear', 1000);
      }

      if (this.sheetName == 'to be create for futures closed pnl for SubAccount') {
        this.getClosedPnlRealtime('Real', 'Sub', 'linear', 1000);
      }


      if (this.sheetName === 'Futures_Closed_Pnl' || this.sheetName === 'Futures_Closed_Pnl_Demo') {
        this.displayedColumns = this.functionsServiceRef.bybit_DisplayColumns.Futures_Closed_Pnl

      }
      if (this.sheetName === 'Futures_Closed_Pnl_Copy_Trader_Master') {
        this.displayedColumns = this.functionsServiceRef.bybit_DisplayColumns.Futures_Closed_Pnl_Copy_Trader_Master

      }


      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 600, 1, this, this.componentDestroyed$)
        .then((sheetData) => {
          if (sheetData) {
            this.calculateColumnTotals()
            if (this.orderHistoryRealtime) {

              this.checkForNewEntries();
            }
          }
        })
    }

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
    // Initialize totals
    this.sheetData.forEach((element: any) => {
      this.columnTotals.Closed_Pnl =
        this.columnTotals.Closed_Pnl + element.Closed_Pnl;
      if (element.Closed_Pnl > 0) {
        this.columnTotals.TotalProfit += element.Closed_Pnl;
        this.columnTotals.TotalProfitTrades++;
      }
      if (element.Closed_Pnl < 0) {
        this.columnTotals.TotalLoss += element.Closed_Pnl;
        this.columnTotals.TotalLossTrades++;
      }

      // most profit & loss

      if (element.Opening_Direction == 'BUY') {
        // this.columnTotals.TotalProfit+=element.Closed_Pnl
        buyCount++;

        this.columnTotals.TotalBuyTrades = buyCount;
      }
      if (element.Opening_Direction == 'SELL') {
        // this.columnTotals.TotalLoss+=element.Closed_Pnl
        sellCount++;
        this.columnTotals.TotalSellTrades = sellCount;
      }

      // Calculate most frequent trading pair
      let tradingPair = element.Contracts;
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

  async getClosedPnlRealtime(accountType: string, account: string, category: string, limit: number) {
    let tradeHistory;
    try {




      if (accountType == 'Real') {
        if (account === 'Main') {

          tradeHistory = await this.bybitAPIServiceRef.getClosedPnl_Bybit(category, limit);

        }

        if (account === 'Sub') {
          tradeHistory = await this.bybitAPICopyTradingAccountServiceRef.getClosedPnl_Bybit(category, limit);

        }

      }

      if (accountType == 'Demo') {


        if (account === 'Main') {
          tradeHistory = await this.bybitAPIDemoServiceRef.getClosedPnl_Bybit(category, limit);

        }

      }


      if (tradeHistory) {
        const orderHistoryRealtime_temp = tradeHistory.map((element: any) => {
          const formatDate = (timestamp: string) => {
            const myDate = new Date(parseInt(timestamp));
            return `${myDate.getFullYear()}-${(myDate.getMonth() + 1).toString().padStart(2, '0')}-${myDate.getDate().toString().padStart(2, '0')} ${myDate.getHours().toString().padStart(2, '0')}:${myDate.getMinutes().toString().padStart(2, '0')}:${myDate.getSeconds().toString().padStart(2, '0')}`;
          };


          // const formattedUpdatedTime = formatDate(element.updatedTime);
          const formattedCreatedTime = formatDate(element.createdTime);
          let addedKeyValue_TradeType_BasedOn_ClosingSide;
          if (element.side === 'Buy' || element.side === 'BUY' || element.side === 'buy') {
            addedKeyValue_TradeType_BasedOn_ClosingSide = 'SELL'
          }
          else if (element.side === 'Sell' || element.side === 'SELL' || element.side === 'sell') {
            addedKeyValue_TradeType_BasedOn_ClosingSide = 'BUY'
          }


          return {
            ...element,

            // updatedTime: formattedUpdatedTime,
            // closedPnl : parseFloat(element.closedPnl),
            createdTime: formattedCreatedTime,
            updatedTime: formatDate(element.updatedTime),
            TradeOpenType: addedKeyValue_TradeType_BasedOn_ClosingSide,
            influencer: ''
          };
        });

        // Sort the array based on execTime in descending order
        this.orderHistoryRealtime = orderHistoryRealtime_temp.sort((a: any, b: any) => {
          const timeA = new Date(a.createdTime).getTime();
          const timeB = new Date(b.createdTime).getTime();
          return timeB - timeA;
        });
        console.log(this.orderHistoryRealtime)
      }
    } catch (error) {
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
      const createdTime = order.createdTime;

      // Check if the trade is unique
      const isPresentInSheetData = this.sheetData.some(
        (sheetTrade) => sheetTrade.Date_Creation === createdTime
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
