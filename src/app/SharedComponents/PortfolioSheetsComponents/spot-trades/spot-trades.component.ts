import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, Input, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { Subject, Subscription } from 'rxjs';
import { ChartAnalysisComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/chart-analysis/chart-analysis.component';
import { BinanceAPIService } from 'src/app/services/WorkingExchangeAPI/binanceAPI.service';
import { HistoryComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/history/history.component';
import { UpdateEntryComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/update-entry/update-entry.component';
import { TradeDetailsComponent } from 'src/app/SharedComponents/trade-details/trade-details.component';
import { OpenOrdersSheetComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/open-orders-sheet/open-orders-sheet.component';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { BybitAPIService } from 'src/app/services/WorkingExchangeAPI/bybitAPI.service';
import { MexcAPIService } from 'src/app/services/WorkingExchangeAPI/mexcAPI.service';
import { KucoinAPIService } from 'src/app/services/WorkingExchangeAPI/kucoinAPI.service';
import { GateioAPIService } from 'src/app/services/WorkingExchangeAPI/gateioAPI.service';
import { DataService } from 'src/app/services/data.service';
// import * as Highcharts from 'highcharts';
// import ChartModuleMore from 'highcharts/highcharts-more.js';
// import HCSoldGauge from 'highcharts/modules/solid-gauge';
// import HC_exporting from 'highcharts/modules/exporting'; // If not already imported
// import HC_exportData from 'highcharts/modules/export-data'; // If not already imported
// import HC_3D from 'highcharts/highcharts-3d'; // Updated import statement for 3D module

// // Initialize the modules
// ChartModuleMore(Highcharts);//required for radial only
// HCSoldGauge(Highcharts);//required for radial only
// HC_3D(Highcharts);
// HC_exporting(Highcharts);
// HC_exportData(Highcharts);



@Component({
  selector: 'app-spot-trades',
  templateUrl: './spot-trades.component.html',
  styleUrls: ['./spot-trades.component.scss']
})
export class SpotTradesComponent implements OnDestroy, OnInit {

  @Input() exchangeName: string = '';
  private sheetName: string = 'Spot_Trades' //for 1. MatTablle , 2. deleteEntry()


  IsMasterControlEnabled: boolean = false;

  //#region For open Orders in spot trades.ts
  sheetData_OpenOrders: any[] = [];
  // openOrdersFilteredData: { [key: string]: any[] } = {};
  openOrdersFilteredData: any[] = [];
  IsSheetDataLoaded_OpenOrders: boolean = false;





  // currentPage_OpenOrders = 1;
  // totalPages_OpenOrders = 1;
  // pagesLoaded_OpenOrders = 0;
  // pageSizeOptions_OpenOrders = 0;



  //#endregion


  // #region new to copy
  tradingPairData: any[] = [];
  calculateBuySellCountsExecuted: boolean = false;
  columnTotals: any = {
    TotalInvested: 0,
    TotalSeedMoney: 0,
    TotalRetrievedSeedMoney: 0
  };

  private searchTermSub: Subscription | undefined;

  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private _dialog: MatDialog,
    private binanceAPIService: BinanceAPIService,
    private bybitAPIService: BybitAPIService,
    private mexcAPIService: MexcAPIService,
    private kucoinAPIServiceRef: KucoinAPIService,
    private gateioAPIServiceRef: GateioAPIService,
    private functionsServiceRef: FunctionsService,
    private dataServiceRef:DataService
  ) // private bybitApiServiceRef : BybitApiService
  {
    // console.log('constructor : ',this.exchangeName)

  }
  ngOnInit(): void {
    //  this.googleSheetAPIServiceRef.setBybitSheetName('SIP')


    this.googleSheetAPIServiceRef.setSheetName(this.sheetName)


    // Subscribe to searchTerm$ observable
    this.searchTermSub = this.dataServiceRef.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });



    //#region For open Orders in spot trades.ts
    // console.log('onInit : ',this.exchangeName)


    this.functionsServiceRef.loadAllOpenOrders(this.exchangeName, 'SIP_Open_Orders', 500, this.componentDestroyed$)
      .then((sheetData_OpenOrders) => {
        // this.sheetData_OpenOrders = sheetData_OpenOrders;

        if (sheetData_OpenOrders) {
          this.groupByTradingPair(sheetData_OpenOrders);
          this.IsSheetDataLoaded_OpenOrders = true;

        }


      })
      .catch((error) => {
        console.error('Error loading open orders:', error);
      });






    //#endregion





    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })






    if (this.exchangeName?.toUpperCase() == 'BINANCE' || this.exchangeName?.toUpperCase() === 'OURBIT') {
      this.displayedColumns = this.functionsServiceRef.binance_DisplayColumns.Spot_Trades
    }

    if (this.exchangeName?.toUpperCase() == 'BYBIT') {
      this.displayedColumns = this.functionsServiceRef.bybit_DisplayColumns.Spot_Trades
    }

    if (this.exchangeName?.toUpperCase() == 'MEXC') {
      this.displayedColumns = this.functionsServiceRef.mexc_DisplayColumns.Spot_Trades
    }
    if (this.exchangeName?.toUpperCase() == 'KUCOIN') {
      this.displayedColumns = this.functionsServiceRef.kucoin_DisplayColumns.Spot_Trades
    }
    if (this.exchangeName?.toUpperCase() == 'GATEIO') {
      this.displayedColumns = this.functionsServiceRef.gateio_DisplayColumns.Spot_Trades
    }





    this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 500, 1, this, this.componentDestroyed$)
      .then((sheetData) => {
        if (sheetData) {
          this.calculateMarketData();
          this.calculateBuySellCounts()
          this.calculateTotalInvestedAllPairs();

        }
      })






  }


  //#region For open Orders in spot trades.ts

  groupByTradingPair(sheetData_OpenOrders: any): void {
    const groupedData = sheetData_OpenOrders.reduce((acc: any, order: any) => {
      const pair = order.Trading_Pair;
      if (!acc[pair]) {
        acc[pair] = { OpenOrders: [], OpenOrdersCount: 0 };
      }
      acc[pair].OpenOrders.push(order);
      acc[pair].OpenOrdersCount++;
      return acc;
    }, {});

    this.sheetData_OpenOrders = Object.keys(groupedData).map(pair => {
      return {
        TradingPair: pair,
        OpenOrders: groupedData[pair].OpenOrders,
        OpenOrdersCount: groupedData[pair].OpenOrdersCount
      };
    });
  }

  getOpenOrdersCount(tradingPair: string): number {
    // Check if the sheetData_OpenOrders is loaded and is an array
    if (this.sheetData_OpenOrders && Array.isArray(this.sheetData_OpenOrders)) {
      // Find the element with the matching trading pair
      const pairData = this.sheetData_OpenOrders.find(pair => pair.TradingPair === tradingPair);
      // Return the OpenOrdersCount if found, otherwise return 0
      return pairData ? pairData.OpenOrdersCount : 0;
    }
    return 0;
  }



  // nextPage_OpenOrders() {
  //   if (this.currentPage_OpenOrders < this.totalPages_OpenOrders) {
  //     this.functionsServiceRef.loadSheetData_OpenOrders(this.exchangeName, 'SIP_Open_Orders', 5, this.currentPage_OpenOrders + 1, this, this.componentDestroyed$);
  //   }
  // }

  // prevPage_OpenOrders() {
  //   if (this.currentPage_OpenOrders > 1) {
  //     this.functionsServiceRef.loadSheetData_OpenOrders(this.exchangeName, 'SIP_Open_Orders', 5, this.currentPage_OpenOrders - 1, this, this.componentDestroyed$);
  //   }
  // }


  //#endregion

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
    this.webSocketRefs.forEach((webSocketRef) => {
      webSocketRef.close();
    });
        // Clean up the subscription
        if (this.searchTermSub) {
          this.searchTermSub.unsubscribe();
        }
        // Reset searchTerm on component destroy
        
  }


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 500, this.currentPage + 1, this, this.componentDestroyed$);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 500, this.currentPage - 1, this, this.componentDestroyed$);
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

  marketData: any = {};
  calculateMarketData() {


    let tempSheetData = this.sheetData;
    for (let i = 0; i < tempSheetData.length; i++) {
      const trade = tempSheetData[i];

      // console.log(`Iteration ${i + 1}: Starting with trade:`, trade);

      if (!this.marketData[trade.Market]) {
        // Initialize market data if it doesn't exist
        this.marketData[trade.Market] = {
          buyTrades: [],
          sellTrades: [],
          FINAL_DATA: {
            AvgPrice: 0,
            TotalAmount: 0,
            TotalInvested: 0,
            RealizedPnl: 0,
            SeedMoney: 0,
            RetrievedSeedMoney: 0
          }
        };
      }

      if (trade.Direction === 'BUY') {
        this.calculateBuyTrade(trade);
      } else if (trade.Direction === 'SELL') {
        this.calculateSellTrade(trade);
      }
      // console.log(`Iteration ${i + 1}: After processing trade:`, trade);
      // console.log(`Iteration ${i + 1}: Market Data:`, this.marketData);
    }

    this.calculatePNL()

  }




  calculateBuyTrade(trade: any) {
    // Calculate Cost for Buy Trade
    trade.Cost = trade.Amount * trade.Price;

    // Update marketData for Buy Trade
    this.marketData[trade.Market].buyTrades.push(trade);
    this.marketData[trade.Market].FINAL_DATA.TotalAmount += trade.Amount;
    this.marketData[trade.Market].FINAL_DATA.TotalInvested += trade.Cost;
    this.marketData[trade.Market].FINAL_DATA.AvgPrice =
      this.marketData[trade.Market].FINAL_DATA.TotalInvested / this.marketData[trade.Market].FINAL_DATA.TotalAmount;
  }

  calculateSellTrade(trade: any) {
    // Calculate Cost for Sell Trade
    trade.Cost = this.marketData[trade.Market].FINAL_DATA.AvgPrice * trade.Amount;

    // Update marketData for Sell Trade
    this.marketData[trade.Market].sellTrades.push(trade);
    this.marketData[trade.Market].FINAL_DATA.TotalAmount -= trade.Amount;
    this.marketData[trade.Market].FINAL_DATA.TotalInvested -= trade.Cost;

    // Recalculate AvgPrice if totalAmount is still positive
    if (this.marketData[trade.Market].FINAL_DATA.TotalAmount > 0) {
      this.marketData[trade.Market].FINAL_DATA.AvgPrice =
        this.marketData[trade.Market].FINAL_DATA.TotalInvested / this.marketData[trade.Market].FINAL_DATA.TotalAmount;
    } else {
      this.marketData[trade.Market].FINAL_DATA.AvgPrice = 0;
    }
  }

  calculatePNL() {
    // Iterate through all markets and calculate PNL based on sell trades
    for (const market in this.marketData) {
      if (this.marketData.hasOwnProperty(market)) {
        // Calculate PNL only for sell trades
        this.marketData[market].FINAL_DATA.RealizedPnl =
          this.marketData[market].sellTrades.reduce((sum: any, sellTrade: any) => sum + (sellTrade.Total_USDT - sellTrade.Cost), 0);

        this.marketData[market].FINAL_DATA.RetrievedSeedMoney =
          this.marketData[market].sellTrades.reduce((sum: any, sellTrade: any) => sum + (sellTrade.Total_USDT), 0)

        this.marketData[market].FINAL_DATA.SeedMoney =
          this.marketData[market].buyTrades.reduce((sum: any, buyTrades: any) => sum + (buyTrades.Total_USDT), 0)


      }
    }
  }


  calculateBuySellCounts() {




    let tempSheetData: any = this.sheetData;

    const tradingPairs: any[] = [
      ...new Set(tempSheetData.map((item: any) => item.Market)),
    ];

    const tradingPairData: {
      TradingPair: string;
      TradeCount: number;
      Trades: any[];
      TotalInvestedAmount: number;
      AverageBuyPrice: number;
      TotalBuyQuantity: number;
      CurrentStaticPrice: any;
      RealizedPnl: number;

      SeedMoney: number;
      RetrievedSeedMoney: number;
    }[] = [];



    if (this.exchangeName.toUpperCase() === 'BINANCE' || this.exchangeName.toUpperCase() === 'OURBIT') {


      const priceRequests = tradingPairs.map((pair) => {
        return this.binanceAPIService.getPrice(pair).toPromise(); // Convert the Observable to a Promise
      });

      Promise.all(priceRequests)
        .then((responses: any) => {
          
          for (let i = 0; i < tradingPairs.length; i++) {
            const pair = tradingPairs[i];

            const dataForPair = tempSheetData.filter(
              (item: any) => item.Market === pair
            );

            // Use this.marketData to get relevant data
            const marketData = this.marketData[pair];

            tradingPairData.push({
              TradingPair: pair,
              TradeCount: dataForPair.length,
              Trades: dataForPair,
              TotalInvestedAmount: marketData?.FINAL_DATA?.TotalInvested || 0,
              AverageBuyPrice: marketData?.FINAL_DATA?.AvgPrice || 0,
              TotalBuyQuantity: marketData?.FINAL_DATA?.TotalAmount || 0,
              CurrentStaticPrice: parseFloat(responses[i].price) || 0,
              RealizedPnl: marketData?.FINAL_DATA?.RealizedPnl || 0,
              SeedMoney: marketData?.FINAL_DATA?.SeedMoney || 0,
              RetrievedSeedMoney: marketData?.FINAL_DATA?.RetrievedSeedMoney || 0

            });


          }

          this.tradingPairData = tradingPairData;
          this.getWsDataBasedOnUrl(this.tradingPairData);
          this.calculateBuySellCountsExecuted = true;
          // setTimeout(() => {
          //   this.tradingPairData.forEach((ele: any) => {
          //     // console.log("ele : ", ele.TradingPair)
          //     this.showMiniChartWidget(ele.TradingPair)

          //   })



          // }, 1000);

        })
        .catch((error) => {
          console.error('Error fetching prices:', error);
        });


    }

    if (this.exchangeName.toUpperCase() === 'BYBIT') {

      const priceRequests = tradingPairs.map((pair) => {
        return this.bybitAPIService.getPriceBybit(pair).toPromise(); // Convert the Observable to a Promise
      });




      Promise.all(priceRequests)
        .then((responses: any) => {
          for (let i = 0; i < tradingPairs.length; i++) {
            const pair = tradingPairs[i];

            const dataForPair = tempSheetData.filter(
              (item: any) => item.Market === pair
            );

            // Use this.marketData to get relevant data
            const marketData = this.marketData[pair];

            tradingPairData.push({
              TradingPair: pair,
              TradeCount: dataForPair.length,
              Trades: dataForPair,
              TotalInvestedAmount: marketData?.FINAL_DATA?.TotalInvested || 0,
              AverageBuyPrice: marketData?.FINAL_DATA?.AvgPrice || 0,
              TotalBuyQuantity: marketData?.FINAL_DATA?.TotalAmount || 0,
              CurrentStaticPrice: responses[i].result.list ?
                (parseFloat(responses[i].result.list[0].lastPrice) || 0) : 0,
              RealizedPnl: marketData?.FINAL_DATA?.RealizedPnl || 0,
              SeedMoney: marketData?.FINAL_DATA?.SeedMoney || 0,
              RetrievedSeedMoney: marketData?.FINAL_DATA?.RetrievedSeedMoney || 0

            });
          }

          this.tradingPairData = tradingPairData;
          this.getWsDataBasedOnUrl(this.tradingPairData);
          this.calculateBuySellCountsExecuted = true;

        })
        .catch((error) => {
          console.error('Error fetching prices:', error);
        });

    }
    if (this.exchangeName.toUpperCase() === 'MEXC') {

      this.mexcAPIService.getPriceMexc('').subscribe((res: any) => {
        let data = res.priceInfo;


        for (let i = 0; i < tradingPairs.length; i++) {
          const pair = tradingPairs[i];

          const dataForPair = tempSheetData.filter(
            (item: any) => item.Market === pair
          );

          // Use this.marketData to get relevant data
          const marketData = this.marketData[pair];

          // Find the corresponding price for the current trading pair in the API response
          const currentPrice = data.find(
            (priceInfo: any) => priceInfo.symbol === pair + 'USDT'
          )?.price || 0;



          tradingPairData.push({
            TradingPair: pair,
            TradeCount: dataForPair.length,
            Trades: dataForPair,
            TotalInvestedAmount: marketData?.FINAL_DATA?.TotalInvested || 0,
            AverageBuyPrice: marketData?.FINAL_DATA?.AvgPrice || 0,
            TotalBuyQuantity: marketData?.FINAL_DATA?.TotalAmount || 0,
            CurrentStaticPrice: parseFloat(currentPrice) || 0,
            RealizedPnl: marketData?.FINAL_DATA?.RealizedPnl || 0,
            SeedMoney: marketData?.FINAL_DATA?.SeedMoney || 0,
            RetrievedSeedMoney: marketData?.FINAL_DATA?.RetrievedSeedMoney || 0
          });
        }

        this.tradingPairData = tradingPairData;
        this.getWsDataBasedOnUrl(this.tradingPairData);
        this.calculateBuySellCountsExecuted = true;
      });

    }
    if (this.exchangeName.toUpperCase() === 'KUCOIN') {
      const priceRequests = tradingPairs.map((pair) => {
        return this.kucoinAPIServiceRef.getPriceKucoin(pair + '-USDT').toPromise(); // Adjust the symbol formatting if needed
      });

      Promise.all(priceRequests)
        .then((responses: any) => {
          for (let i = 0; i < tradingPairs.length; i++) {
            const pair = tradingPairs[i];

            const dataForPair = tempSheetData.filter(
              (item: any) => item.Market === pair
            );

            // Use this.marketData to get relevant data
            const marketData = this.marketData[pair];


            tradingPairData.push({
              TradingPair: pair,
              TradeCount: dataForPair.length,
              Trades: dataForPair,
              TotalInvestedAmount: marketData?.FINAL_DATA?.TotalInvested || 0,
              AverageBuyPrice: marketData?.FINAL_DATA?.AvgPrice || 0,
              TotalBuyQuantity: marketData?.FINAL_DATA?.TotalAmount || 0,
              CurrentStaticPrice: (responses[i].data != null) ? parseFloat(responses[i].data.price) : 0,
              RealizedPnl: marketData?.FINAL_DATA?.RealizedPnl || 0,
              SeedMoney: marketData?.FINAL_DATA?.SeedMoney || 0,
              RetrievedSeedMoney: marketData?.FINAL_DATA?.RetrievedSeedMoney || 0
            });
          }

          this.tradingPairData = tradingPairData;
          this.getWsDataBasedOnUrl(this.tradingPairData);
          this.calculateBuySellCountsExecuted = true;

        })
        .catch((error) => {
          console.error('Error fetching prices:', error);
        });
    }
    if (this.exchangeName.toUpperCase() === 'GATEIO') {
      const priceRequests = tradingPairs.map((pair) => {
        return this.gateioAPIServiceRef.getPriceGate(pair + '_USDT').toPromise(); // Adjust the symbol formatting if needed
      });

      Promise.all(priceRequests)
        .then((responses: any) => {
          for (let i = 0; i < tradingPairs.length; i++) {
            const pair = tradingPairs[i];

            const dataForPair = tempSheetData.filter(
              (item: any) => item.Market === pair
            );

            // Use this.marketData to get relevant data
            const marketData = this.marketData[pair];

            // console.log("RESpojnse[0] : ", responses[0][0].last)
            let currentPrice = (responses[i][0].last)
            tradingPairData.push({
              TradingPair: pair,
              TradeCount: dataForPair.length,
              Trades: dataForPair,
              TotalInvestedAmount: marketData?.FINAL_DATA?.TotalInvested || 0,
              AverageBuyPrice: marketData?.FINAL_DATA?.AvgPrice || 0,
              TotalBuyQuantity: marketData?.FINAL_DATA?.TotalAmount || 0,
              CurrentStaticPrice: currentPrice || 0,
              RealizedPnl: marketData?.FINAL_DATA?.RealizedPnl || 0,
              SeedMoney: marketData?.FINAL_DATA?.SeedMoney || 0,
              RetrievedSeedMoney: marketData?.FINAL_DATA?.RetrievedSeedMoney || 0
            });
          }

          this.tradingPairData = tradingPairData;
          // console.log("b4 get ws , tradingOairData : ", this.tradingPairData)
          this.getWsDataBasedOnUrl(this.tradingPairData);
          this.calculateBuySellCountsExecuted = true;
        })
        .catch((error) => {

          console.error('Error fetching prices:', error);
        });
    }


  }


  calculateTotalInvestedAllPairs() {
    // Iterate through all markets and sum up TotalInvested
    for (const market in this.marketData) {
      if (this.marketData.hasOwnProperty(market)) {
        this.columnTotals.TotalInvested += this.marketData[market].FINAL_DATA.TotalInvested;
        this.columnTotals.TotalSeedMoney += this.marketData[market].FINAL_DATA.SeedMoney;
        this.columnTotals.TotalRetrievedSeedMoney += this.marketData[market].FINAL_DATA.RetrievedSeedMoney;
      }
    }
  }
















  //#endregion




  private webSocketRefs: WebSocket[] = [];


  WSData: any[] = []; // Declare WSData as a global property

  prevPrice: number = 0;
  currentPrice: number = 0;

  // Define a map to store prices for each trading pair
  priceMap: Map<string, { currentPrice: number; prevPrice: number }> =
    new Map();

  getWsDataBasedOnUrl(tradingPairData: any) {
    this.webSocketRefs.forEach((webSocketRef) => {
      webSocketRef.close();
    });


    if (this.exchangeName.toUpperCase() === 'BINANCE' || this.exchangeName.toUpperCase() === 'OURBIT') {

      // console.log('getWs BAsed dat : ', tradingPairData)

      this.WSData = tradingPairData.map((element: any) => ({
        Pair: element.TradingPair,
        Url: `wss://stream.binance.com:9443/ws/${element.TradingPair.toLowerCase()}usdt@aggTrade`,
        Price: element.CurrentStaticPrice,
      }));

      // console.log("WsData: ", this.WSData);

      // Iterate through the WSData array to create WebSocket connections and update prices
      for (const wsItem of this.WSData) {
        const url = wsItem.Url;

        // Initialize priceMap with current and previous prices
        this.priceMap.set(wsItem.Pair, {
          currentPrice: wsItem.Price,
          prevPrice: wsItem.Price,
        });

        const webSocketRef = new WebSocket(url);

        webSocketRef.onmessage = (event) => {
          const currentPrice = JSON.parse(event.data).p;

          // Update the 'Price' field in WSData with the current price
          wsItem.Price = currentPrice;

          // Update the price map with the new current and previous prices
          const priceInfo = this.priceMap.get(wsItem.Pair);
          priceInfo!.prevPrice = priceInfo!.currentPrice;
          priceInfo!.currentPrice = currentPrice;

          this.cdr.detectChanges();
        };

        webSocketRef.onerror = (event) => {
        };
        // Store the WebSocket reference for cleanup when the component is destroyed
        this.webSocketRefs.push(webSocketRef);

      }



    }

    if (this.exchangeName.toUpperCase() === 'BYBIT') {

      this.WSData = tradingPairData.map((element: any) => ({
        Pair: element.TradingPair,
        Url: `wss://stream.bybit.com/v5/public/spot`,
        Params: {
          op: 'subscribe',
          args: [`tickers.${element.TradingPair}USDT`],
        },
        Price: element.CurrentStaticPrice,
      }));

      // Iterate through the WSData array to create WebSocket connections and update prices
      for (const wsItem of this.WSData) {
        const url = wsItem.Url;
        // Initialize priceMap with current and previous prices
        this.priceMap.set(wsItem.Pair, {
          currentPrice: wsItem.Price,
          prevPrice: wsItem.Price,
        });
        const webSocketRef = new WebSocket(url);

        webSocketRef.onmessage = (event) => {
          const message = JSON.parse(event.data);

          if (message.topic === `tickers.${wsItem.Pair}USDT`) {
            const currentPrice = message.data.lastPrice;

            // Update the price map with the new current and previous prices
            const priceInfo = this.priceMap.get(wsItem.Pair);
            priceInfo!.prevPrice = priceInfo!.currentPrice;
            priceInfo!.currentPrice = currentPrice;

            // Update the 'Price' field in WSData with the current price
            wsItem.Price = currentPrice;
            this.cdr.detectChanges();
          }
        };

        webSocketRef.onerror = (event) => {
          console.error(`WebSocket error for ${wsItem.Pair}:`, event);
        };

        // Subscribe to the current trading pair
        webSocketRef.addEventListener('open', () => {
          webSocketRef.send(JSON.stringify(wsItem.Params));
        });

        // Store the WebSocket reference for cleanup when the component is destroyed
        this.webSocketRefs.push(webSocketRef);
      }

    }

    if (this.exchangeName.toUpperCase() === 'MEXC') {

      this.WSData = tradingPairData.map((element: any) => ({
        Pair: element.TradingPair,
        Url: `wss://stream.binance.com:9443/ws/${element.TradingPair.toLowerCase()}usdt@aggTrade`,
        Price: element.CurrentStaticPrice,
      }));

      // console.log("WsData: ", this.WSData);

      // Iterate through the WSData array to create WebSocket connections and update prices
      for (const wsItem of this.WSData) {
        const url = wsItem.Url;

        // Initialize priceMap with current and previous prices using CurrentStaticPrice
        this.priceMap.set(wsItem.Pair, {
          currentPrice: wsItem.Price,
          prevPrice: wsItem.Price,
        });

        // const webSocketRef = new WebSocket(url);

        // webSocketRef.onmessage = (event) => {
        //   const currentPrice = JSON.parse(event.data).p;

        //   // Update the 'Price' field in WSData with the current price
        //   wsItem.Price = currentPrice;

        //   // Update the price map with the new current and previous prices
        //   const priceInfo = this.priceMap.get(wsItem.Pair);
        //   priceInfo!.prevPrice = priceInfo!.currentPrice;
        //   priceInfo!.currentPrice = wsItem.Price;

        //   this.cdr.detectChanges();
        // };

        // webSocketRef.onerror = (event) => {
        //   console.error(`WebSocket error for ${wsItem.Pair}:`, event);
        // };
      }

    }
    if (this.exchangeName.toUpperCase() === 'KUCOIN') {
      let websocketAccessToken: any;
      this.kucoinAPIServiceRef.getKucoinWSAccessToken().subscribe((res: any) => {
        if (res) {
          websocketAccessToken = res.accessToken;
          this.WSData = tradingPairData.map((element: any) => ({
            Pair: element.TradingPair,
            Url: `wss://ws-api-spot.kucoin.com/?token=${websocketAccessToken}`, // Add the access token as a query parameter
            Price: element.CurrentStaticPrice,
          }));

          for (const wsItem of this.WSData) {
            const url = wsItem.Url;

            this.priceMap.set(wsItem.Pair, {
              currentPrice: wsItem.Price,
              prevPrice: wsItem.Price,
            });

            const webSocketRef = new WebSocket(url);

            let pingIntervalId: any;

            webSocketRef.onopen = () => {
              // Subscription message
              const subscriptionMessage = {
                id: Date.now().toString(), // Use a unique ID for each subscription
                type: 'subscribe',
                topic: `/market/ticker:${wsItem.Pair}-USDT`, // Use the trading pair from your data
                response: true,
              };

              webSocketRef.send(JSON.stringify(subscriptionMessage));

              // Set up ping interval
              pingIntervalId = setInterval(() => {
                const pingMessage = {
                  id: Date.now().toString(),
                  type: 'ping',
                };
                webSocketRef.send(JSON.stringify(pingMessage));
              }, 30000); // Send ping every 30 seconds
            };

            webSocketRef.onmessage = (event) => {
              const messageData = JSON.parse(event.data);

              if (messageData.type === 'welcome' || messageData.type === 'ack') {
                return;
              }

              if (
                messageData.type === 'message' &&
                messageData.subject === 'trade.ticker'
              ) {
                const currentPrice = parseFloat(messageData.data.price);

                wsItem.Price = currentPrice;

                const priceInfo = this.priceMap.get(wsItem.Pair);
                priceInfo!.prevPrice = priceInfo!.currentPrice;
                priceInfo!.currentPrice = currentPrice;

                this.cdr.detectChanges();
              }

              if (messageData.type === 'pong') {
                // Received a pong message, do nothing special
              }
            };

            webSocketRef.onerror = (event) => {
              console.error('WebSocket error:', event);
            };

            webSocketRef.onclose = () => {
              clearInterval(pingIntervalId);
            };

            this.webSocketRefs.push(webSocketRef);
          }
        } else {
          return;
        }
      });
    }
    if (this.exchangeName.toUpperCase() === 'GATEIO') {

      this.WSData = tradingPairData.map((element: any) => ({
        Pair: element.TradingPair,
        Url: `wss://stream.binance.com:9443/ws/${element.TradingPair.toLowerCase()}usdt@aggTrade`,
        Price: element.CurrentStaticPrice,
      }));

      // console.log("WsData: ", this.WSData);

      // Iterate through the WSData array to create WebSocket connections and update prices
      for (const wsItem of this.WSData) {
        const url = wsItem.Url;

        // Initialize priceMap with current and previous prices using CurrentStaticPrice
        this.priceMap.set(wsItem.Pair, {
          currentPrice: wsItem.Price,
          prevPrice: wsItem.Price,
        });

        // const webSocketRef = new WebSocket(url);

        // webSocketRef.onmessage = (event) => {
        //   const currentPrice = JSON.parse(event.data).p;

        //   // Update the 'Price' field in WSData with the current price
        //   wsItem.Price = currentPrice;

        //   // Update the price map with the new current and previous prices
        //   const priceInfo = this.priceMap.get(wsItem.Pair);
        //   priceInfo!.prevPrice = priceInfo!.currentPrice;
        //   priceInfo!.currentPrice = wsItem.Price;

        //   this.cdr.detectChanges();
        // };

        // webSocketRef.onerror = (event) => {
        //   console.error(`WebSocket error for ${wsItem.Pair}:`, event);
        // };
      }

    }



  }

  getPriceColour(TradingPair: any): boolean {
    const priceInfo = this.priceMap.get(TradingPair);
    if (priceInfo!.currentPrice > priceInfo!.prevPrice) return true;
    else return false;
  }

  getPnl(tradingPair: string): number {
    let pnl = 0;
    // Find the trading pair data based on the provided trading pair
    const tradingPairData = this.tradingPairData.find(
      (item: any) => item.TradingPair === tradingPair
    );
    if (tradingPairData) {
      // Calculate PNL as (Current Price * Quantity) - (Buy Price * Quantity)
      const quantity = tradingPairData.TotalBuyQuantity;
      const averageBuyPrice = tradingPairData.AverageBuyPrice;
      const currentPrice = this.getPriceForTradingPair(tradingPair);

      // Check if currentPrice is not 0 (or another appropriate value) before calculating PNL
      if (currentPrice !== 0) {
        pnl = currentPrice * quantity - averageBuyPrice * quantity;
      }

      return pnl;
    }
    return 0; // Return 0 if trading pair data is not found
  }

  getCurrentValue(tradingPair: string): number {
    // Find the trading pair data based on the provided trading pair
    const tradingPairData = this.tradingPairData.find(
      (item: any) => item.TradingPair === tradingPair
    );
    if (tradingPairData) {
      // Calculate Current Value as (Current Price * Quantity)
      const quantity = tradingPairData.TotalBuyQuantity;
      const currentPrice = this.getPriceForTradingPair(tradingPair);
      const currentValue = currentPrice * quantity;
      return currentValue;
    }
    return 0; // Return 0 if trading pair data is not found
  }

  getPercentagePnl(tradingPair: string): number {
    // Find the trading pair data based on the provided trading pair
    const tradingPairData = this.tradingPairData.find(
      (item: any) => item.TradingPair === tradingPair
    );
    if (tradingPairData) {
      // Calculate PNL as (Current Price * Quantity) - (Buy Price * Quantity)
      const pnl = this.getPnl(tradingPair);
      if (tradingPairData.TotalInvestedAmount !== 0) {
        const percentagePnl = (pnl / tradingPairData.TotalInvestedAmount) * 100;
        return percentagePnl;
      }
    }
    return 0; // Return 0 if trading pair data is not found or if invested Quantity is 0
  }
  getPriceForTradingPair(tradingPair: string): number {
    this.cdr.markForCheck();
    const wsItem = this.WSData.find((item) => item.Pair === tradingPair);
    return wsItem ? wsItem.Price : 0;
  }

  // In your component
  // getPnl(tradingPair: string): number {
  //   // Find the trading pair data based on the provided trading pair
  //   const tradingPairData = this.tradingPairData.find((item:any) => item.TradingPair === tradingPair);
  //   if (tradingPairData) {
  //     // Calculate PNL as (Current Price - Average Buy Price)
  //     const currentPrice = this.getPriceForTradingPair(tradingPair);
  //     const averageBuyPrice = tradingPairData.AverageBuyPrice;
  //     return currentPrice - averageBuyPrice;
  //   }
  //   return 0; // Return 0 if trading pair data is not found
  // }
  // In your component
  // getPnl(tradingPair: string): number {
  //   // Find the trading pair data based on the provided trading pair
  //   const tradingPairData = this.tradingPairData.find((item:any) => item.TradingPair === tradingPair);
  //   if (tradingPairData) {
  //     // Calculate Invested value as (Quantity * Average Buy Price)
  //     const quantity = tradingPairData.TotalBuyQuantity;
  //     const averageBuyPrice = tradingPairData.AverageBuyPrice;
  //     const invested = quantity * averageBuyPrice;

  //     // Calculate PNL as (Current Price - Invested)
  //     const currentPrice = this.getPriceForTradingPair(tradingPair);
  //     return currentPrice - invested;
  //   }
  //   return 0; // Return 0 if trading pair data is not found
  // }
  // Inside your BinanceSipComponent class

  getTotalCurrentValue(): number {
    let totalCurrentValue = 0;

    for (const tradingPair of this.tradingPairData) {
      const currentValue = this.getCurrentValue(tradingPair.TradingPair);
      totalCurrentValue += currentValue;
    }

    return totalCurrentValue;
  }

  getTotalPercentageCurrentValue(): number {
    const totalInvestedAmount = this.tradingPairData.reduce(
      (total: any, item: any) => total + item.TotalInvestedAmount,
      0
    );
    const totalCurrentValue = this.getTotalCurrentValue();

    if (totalInvestedAmount !== 0) {
      return (
        ((totalCurrentValue - totalInvestedAmount) / totalInvestedAmount) * 100
      );
    }

    return 0;
  }

  getUniqueInfluencers(trades: any[]): string[] {
    const uniqueInfluencers: string[] = [];
    trades.forEach(trade => {
      if (trade.Influencer !== undefined && trade.Influencer !== 'undefined' && !uniqueInfluencers.includes(trade.Influencer)) {
        uniqueInfluencers.push(trade.Influencer);
      }
    });
    return uniqueInfluencers.length ? uniqueInfluencers : ['-'];
  }



  searchTerm: string = '';
  filterOption: String = 'Holding';
  filteredTradesCount: number = 0;
  get filteredTradingPairData() {
    let filteredTradingPairData: any;
    switch (this.filterOption) {
      case 'All': {
        filteredTradingPairData = this.tradingPairData.filter((item: any) =>
          item.TradingPair.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        // console.log(filteredTradingPairData, filteredTradingPairData.TotalBuyQuantity)
        break;
      }
      case 'Holding': {

        filteredTradingPairData = this.tradingPairData.filter((item: any) =>
          item.TradingPair.toLowerCase().includes(this.searchTerm.toLowerCase()) && (item.TotalBuyQuantity * item.CurrentStaticPrice) > 0.5
        );
        // console.log(filteredTradingPairData, filteredTradingPairData.TotalBuyQuantity)
        break;
      }
      case 'Sold': {

        filteredTradingPairData = this.tradingPairData.filter((item: any) =>
          item.TradingPair.toLowerCase().includes(this.searchTerm.toLowerCase()) && (item.TotalBuyQuantity * item.CurrentStaticPrice) <= 0.5
        );
        // console.log(filteredTradingPairData, this.filterOption,this.tradingPairData)
        break;
      }

      case 'Holding Losses': {

        filteredTradingPairData = this.tradingPairData.filter((item: any) =>
          item.TradingPair.toLowerCase().includes(this.searchTerm.toLowerCase()) && (this.getPnl(item.TradingPair) <= 0) && (item.TotalBuyQuantity * item.CurrentStaticPrice) > 0.5

        );
        // console.log(filteredTradingPairData, filteredTradingPairData.TotalBuyQuantity)
        break;
      }

      case 'Holding Profits': {

        filteredTradingPairData = this.tradingPairData.filter((item: any) =>
          item.TradingPair.toLowerCase().includes(this.searchTerm.toLowerCase()) && (this.getPnl(item.TradingPair) >= 0) && (item.TotalBuyQuantity * item.CurrentStaticPrice) > 0.5
        );
        // console.log(filteredTradingPairData, filteredTradingPairData.TotalBuyQuantity)
        break;
      }


      case 'Sold Profits': {

        filteredTradingPairData = this.tradingPairData.filter((item: any) =>
          item.TradingPair.toLowerCase().includes(this.searchTerm.toLowerCase()) && (item.RealizedPnl > 0) && (item.TotalBuyQuantity * item.CurrentStaticPrice) <= 0.5

        );
        // console.log(filteredTradingPairData, filteredTradingPairData.TotalBuyQuantity)
        break;
      }

      case 'Sold Losses': {

        filteredTradingPairData = this.tradingPairData.filter((item: any) =>
          item.TradingPair.toLowerCase().includes(this.searchTerm.toLowerCase()) && (item.RealizedPnl <= 0) && (item.TotalBuyQuantity * item.CurrentStaticPrice) <= 0.5
        );
        // console.log(filteredTradingPairData, filteredTradingPairData.TotalBuyQuantity)
        break;
      }


      case 'Invested less than 10': {
        filteredTradingPairData = this.tradingPairData.filter((item: any) =>
          item.TradingPair.toLowerCase().includes(this.searchTerm.toLowerCase()) && (item.TotalInvestedAmount < 10) && (item.TotalBuyQuantity * item.CurrentStaticPrice) > 0.5
        );
        break;
      }


      case 'Invested greater than 10': {

        filteredTradingPairData = this.tradingPairData.filter((item: any) =>
          item.TradingPair.toLowerCase().includes(this.searchTerm.toLowerCase()) && (item.TotalInvestedAmount >= 10) && (item.TotalBuyQuantity * item.CurrentStaticPrice) > 0.5
        );
        break;
      }




    }

    this.filteredTradesCount = filteredTradingPairData.length;
    return filteredTradingPairData

  }

  selectedSortDirection: string = 'winners'; // Default to 'winners'
  getPnlInUSDT(): number {
    const totalInvestedAmount = this.tradingPairData.reduce(
      (total: any, item: any) => total + item.TotalInvestedAmount,
      0
    );
    const totalCurrentValue = this.getTotalCurrentValue();

    // this.sortTradingPairsByPNL(); // Sort the data
    if (this.selectedSortDirection == 'winners') {
      this.sortCoinsWinners();
    } else if (this.selectedSortDirection == 'loosers') {
      this.sortCoinsLoosers();
    }

    if (totalInvestedAmount !== 0) {
      return totalCurrentValue - totalInvestedAmount;
    }
    return 0;
  }
  sortCoinsLoosers() {
    this.selectedSortDirection = 'loosers';
    this.tradingPairData.sort((a: any, b: any) => {
      const pnlA = this.getPercentagePnl(a.TradingPair);
      const pnlB = this.getPercentagePnl(b.TradingPair);
      return pnlA - pnlB;
    });
  }

  // Sort tradingPairData based on PNL in descending order
  sortCoinsWinners() {
    this.selectedSortDirection = 'winners';

    this.tradingPairData.sort((a: any, b: any) => {
      const pnlA = this.getPercentagePnl(a.TradingPair);
      const pnlB = this.getPercentagePnl(b.TradingPair);
      return pnlB - pnlA;
    });
  }
  sortCoinsRecent() {
    this.selectedSortDirection = 'recent';
    this.tradingPairData.forEach((coin: any) => {
      // Get the most recent date from the Trades array
      const mostRecentDate = new Date(Math.max(...coin.Trades.map((trade: any) => new Date(trade.Date))));

      // Format the most recent date in the desired format
      const formattedDate = mostRecentDate.toISOString().replace(/-/g, ':').replace('T', ' ').replace(/\.\d+Z/, '');

    });

    this.tradingPairData.sort((a: any, b: any) => {
      // Get the most recent date from the Trades array of each object
      const dateA = new Date(Math.max(...a.Trades.map((trade: any) => new Date(trade.Date))));
      const dateB = new Date(Math.max(...b.Trades.map((trade: any) => new Date(trade.Date))));

      // Compare the dates
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      return 0;
    });


    // console.log(this.tradingPairData)
  }

  showLessCoinsFlag: boolean = false;
  show_advance_options: boolean = false;
  OnShowAdvanceOptions() {
    this.show_advance_options = !this.show_advance_options
  }

  showAllCoins() {
    this.showLessCoinsFlag = false;
  }
  showLessCoins() {
    this.showLessCoinsFlag = true;
  }


  setFilter(event: any) {
    this.filterOption = event.target.innerText
  }

  setDefaultOptions() {
    // this.searchTerm = ''
    this.showAllCoins();
    this.sortCoinsWinners();
    this.filterOption = 'Holding'

  }
  isDefaultOption(): boolean {

    // if (this.filterOption != 'Holding' || this.searchTerm != '' || this.showLessCoinsFlag || this.selectedSortDirection != 'winners')
    if (this.filterOption != 'Holding' || !this.showLessCoinsFlag || this.selectedSortDirection != 'winners')


      return true;
    else return false;
  }
  onOpenOrdersDialog(item: any) {
    if (this.getOpenOrdersCount(item.TradingPair) != 0) {
      // Filter the open orders based on the trading pair
      // const filteredOpenOrders = this.sheetData_OpenOrders.filter(order => order.TradingPair === item.TradingPair);



      const dialogRef = this._dialog.open(OpenOrdersSheetComponent, {
        data: {
          exchangeName: this.exchangeName,
          tradingPair: item.TradingPair,
          TradingPairData: item,
          OpenOrders: this.sheetData_OpenOrders // Pass the filtered open orders
        },
        disableClose: false, // Prevent the dialog from closing on click outside
        hasBackdrop: false, // Allow interaction with the underlying page
        // minWidth: '90vw',
        // minHeight: '81vh',
        // maxHeight: '81vh'
      });

      dialogRef.afterClosed().subscribe((result) => {
        // Handle any data returned from the dialog if needed
        // console.log('Dialog was closed with result:', result);
      });
    } else {
      this.toastr.warning('No Open Orders');
    }
  }

  onOpenHistoryDialog(item: any) {


    const dialogRef = this._dialog.open(HistoryComponent, {
      data: item, // Pass the 'item' data to the dialog component
      disableClose: false, // Prevent the dialog from closing on click outside
      // minWidth: '95vw',
      // minHeight: '93vh',
      // maxHeight: '93vh'
      hasBackdrop: false, // Allow interaction with the underlying page
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle any data returned from the dialog if needed
      // console.log('Dialog was closed with result:', result);
    });



  }

  onOpenChartAnalysisDialog(item: any) {
    const dialogRef = this._dialog.open(ChartAnalysisComponent, {
      data: { exchangeName: (this.exchangeName != 'Ourbit' ? this.exchangeName :'Binance').toUpperCase(), tradingPair: item.TradingPair, tradingPairsAll: this.tradingPairData },
      disableClose: false,
      hasBackdrop: false,
      minWidth: '95vw',
      minHeight: '93vh',
      maxHeight: '93vh'

    })
    dialogRef.afterClosed().subscribe((result) => {
      // Handle any data returned from the dialog if needed
      // console.log('Dialog was closed with result:', result);
    });
  }
  onOpenTradeDetailsDialog(item: any) {
    const dialogRef = this._dialog.open(TradeDetailsComponent, {
      data: { exchangeName: (this.exchangeName).toUpperCase(), tradingPair: item.TradingPair, tradingPairsAll: this.tradingPairData },
      disableClose: false,
      hasBackdrop: false

    })
    dialogRef.afterClosed().subscribe((result) => {
      // Handle any data returned from the dialog if needed
      // console.log('Dialog was closed with result:', result);
    });
  }


  getPnl_Booked(trades: any[]) {
    const buys = trades.filter(trade => trade.Direction === 'BUY').reduce((sum, buy) => sum + buy.Total_USDT, 0);
    const sells = trades.filter(trade => trade.Direction === 'SELL').reduce((sum, sell) => sum + sell.Total_USDT, 0);
    return (sells - buys);
  }



  getPnlPercentage_Booked(trades: any[]) {
    const pnl = this.getPnl_Booked(trades);
    const buys = trades.filter(trade => trade.Direction === 'BUY').reduce((sum, buy) => sum + buy.Total_USDT, 0);
    return ((pnl / buys) * 100).toFixed(2);
  }


  getAvgBuyPrice_Booked(trades: any[]) {
    const buys = trades.filter(trade => trade.Direction === 'BUY');
    const totalCost = buys.reduce((sum, buy) => sum + buy.Total_USDT, 0);
    const totalAmount = buys.reduce((sum, buy) => sum + buy.Amount, 0);
    return totalCost / totalAmount;
  }

  getAvgSellPrice_Booked(trades: any[]) {
    const sells = trades.filter(trade => trade.Direction === 'SELL');
    const totalCost = sells.reduce((sum, sell) => sum + sell.Total_USDT, 0);
    const totalAmount = sells.reduce((sum, sell) => sum + sell.Amount, 0);
    return totalCost / totalAmount;
  }


}
