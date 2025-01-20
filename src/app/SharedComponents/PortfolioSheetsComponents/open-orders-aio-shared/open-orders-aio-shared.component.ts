import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { BinanceAPIService } from 'src/app/services/WorkingExchangeAPI/binanceAPI.service';
import { BybitAPIService } from 'src/app/services/WorkingExchangeAPI/bybitAPI.service';
import { GateioAPIService } from 'src/app/services/WorkingExchangeAPI/gateioAPI.service';
import { KucoinAPIService } from 'src/app/services/WorkingExchangeAPI/kucoinAPI.service';
import { MexcAPIService } from 'src/app/services/WorkingExchangeAPI/mexcAPI.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { TradeDetailsComponent } from '../../trade-details/trade-details.component';
import { ChartAnalysisComponent } from '../chart-analysis/chart-analysis.component';
import { OpenOrdersSheetComponent } from '../open-orders-sheet/open-orders-sheet.component';
import { HistoryComponent } from '../history/history.component';
import { UpdateEntryComponent } from '../update-entry/update-entry.component';
import { MasterControlComponent } from '../../master-control/master-control.component';

@Component({
  selector: 'app-open-orders-aio-shared',
  templateUrl: './open-orders-aio-shared.component.html',
  styleUrls: ['./open-orders-aio-shared.component.scss']
})
export class OpenOrdersAioSharedComponent implements OnInit, OnDestroy {

  @Input() exchangeName: string = '';
  private sheetName: string = 'Spot_Trades' //for 1. MatTablle , 2. deleteEntry()
  IsMasterControlEnabled: boolean = false;

  //#region For open Orders in spot trades.ts
  openOrdersGroupedData: any[] = [];
  IsSheetDataLoaded_OpenOrders: boolean = false;

  IsProcessedTradingPairData: boolean = false;

  openTradesFilteredData: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;
  IsSelectedSheetDataLoaded: boolean = false;
  sheetData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pagesLoaded = 0;
  pageSizeOptions = 0;

  private componentDestroyed$: Subject<void> = new Subject<void>();


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
    private functionsServiceRef: FunctionsService
  ) {
    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })

  }
  // loadSheetData()
  // ngOnInit(): void {

  //   this.loadSheetData()
  //     .then(() => this.loadAllOpenOrders())
  //     .then(() => {
  //       this.allMethodsDataRetrieved();
  //     })
  //     .then(()=>{
  //       this.IsProcessedTradingPairData = true;
  //       console.log(this.openTradesFilteredData)

  //     })
  //     .catch((error) => {
  //       console.error('Error during initialization:', error);
  //     });
  // }
  ngOnInit(): void {

    this.googleSheetAPIServiceRef.setSheetName(this.exchangeName)


    Promise.all([this.loadSheetData(), this.loadAllOpenOrders()])
      .then(() => {
        return this.allMethodsDataRetrieved();
      })
      .then(() => {
        this.combineAndSortOpenOrders('desc_untilTarget')
        this.IsProcessedTradingPairData = true;
        // console.log(this.openTradesFilteredData);
        // this.openTradesFilteredData.forEach(tradeData => {
        this.getWsDataBasedOnUrl();
        // });
      })
      .catch((error) => {
        console.error('Error during initialization:', error);
      });
  }


  allMethodsDataRetrieved(): void {
    // console.log(this.openOrdersGroupedData);
    // console.log(this.tradingPairData);
    // console.log(this.columnTotals);

    this.processTradingPairData(this.tradingPairData, this.openOrdersGroupedData, this.exchangeName)
      .then((data: any) => {
        this.openTradesFilteredData = data


      });
  }

  // processTradingPairData(
  //   tradingPairData: any[],
  //   openOrdersGroupedData: any[],
  //   exchangeName: string
  // ): Promise<any[]> {
  //   return new Promise((resolve) => {

  //     console.log('openOrdersGroupedData : ', this.openOrdersGroupedData)
  //     console.log('tradingPairData : ', tradingPairData)

  //     const processedData = tradingPairData.map((pairData) => {
  //       const openOrders = openOrdersGroupedData.find((order) => order.TradingPair === pairData.TradingPair);
  //       console.log('openOrders : ', openOrders)
  //       return {
  //         ...pairData,
  //         OpenOrders: openOrders ? openOrders.OpenOrders : [],
  //         exchangeName: exchangeName,
  //       };
  //     });

  //     resolve(processedData);
  //   });
  // }
  processTradingPairData(
    tradingPairData: any[],
    openOrdersGroupedData: any[],
    exchangeName: string
  ): Promise<any[]> {
    return new Promise((resolve) => {
      const processedData = tradingPairData.map((pairData) => {

        const tradingPair = pairData.TradingPair.trim().toUpperCase();

        const openOrdersGroup = openOrdersGroupedData.find((order) =>
          order.TradingPair.trim().toUpperCase() === tradingPair
        );



        return {
          ...pairData,
          OpenOrders: openOrdersGroup ? openOrdersGroup.OpenOrders : [],
          exchangeName: exchangeName,
        };
      });

      resolve(processedData);
    });
  }



  editItem(item: any) {
    
  
    // Create a copy of the item to avoid modifying the original object
    let itemCopy = { ...item };
  
    // Check if singleFilteredTradeData exists and delete it if it does
    if ('singleFilteredTradeData' in itemCopy) {
      delete itemCopy.singleFilteredTradeData;
    }
  
    if (!this.IsMasterControlEnabled) {
      const dialogRef = this._dialog.open(MasterControlComponent, {
        disableClose: false,
        hasBackdrop: true
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const dialogRef = this._dialog.open(UpdateEntryComponent, {
            data: {
              tradeData: itemCopy,
              sheetName: 'SIP_Open_Orders',
              exchangeName: this.exchangeName
            },
            disableClose: false,
            hasBackdrop: false
          });
  
          dialogRef.afterClosed().subscribe((result) => {
            // Handle any data returned from the dialog if needed
            // console.log('Dialog was closed with result:', result);
          });
        }
      });
    } else {
      const dialogRef = this._dialog.open(UpdateEntryComponent, {
        data: {
          tradeData: itemCopy,
          sheetName: 'SIP_Open_Orders',
          exchangeName: this.exchangeName,
          location: 'dialog'
        },
        disableClose: false,
        hasBackdrop: false
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        // Handle any data returned from the dialog if needed
        // console.log('Dialog was closed with result:', result);
      });
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
            this.functionsServiceRef.deleteEntry(this.exchangeName, 'SIP_Open_Orders', ID)
          }
        })

      }
    }

    else {
      this.functionsServiceRef.deleteEntry(this.exchangeName, 'SIP_Open_Orders', ID)
    }

  }


  onOpenChartAnalysisDialog(TradingPair: any) {
    const dialogRef = this._dialog.open(ChartAnalysisComponent, {
      data: { exchangeName: (this.exchangeName).toUpperCase(), tradingPair: TradingPair , location : 'Open_Orders'},
      disableClose: false,
      hasBackdrop: false,
      // height: '90vh', // Set your desired height
      minWidth: '95vw',
      minHeight: '93vh',
      maxHeight: '93vh'



    })
    dialogRef.afterClosed().subscribe((result) => {
      // Handle any data returned from the dialog if needed
      // console.log('Dialog was closed with result:', result);
    });
  }


  //#region Open_Orders



  loadAllOpenOrders(): Promise<void> {
    return new Promise((resolve) => {
      this.functionsServiceRef.loadAllOpenOrders(this.exchangeName, 'SIP_Open_Orders', 150, this.componentDestroyed$)
        .then((sheetData_OpenOrders) => {
          if (sheetData_OpenOrders) {
            this.groupByTradingPair(sheetData_OpenOrders)

          }
        })
        .catch((error) => {
          console.error('Error loading open orders:', error);
        })
        .finally(() => {
          resolve()
        })
    });
  }

  groupByTradingPair(sheetData_OpenOrders: any): Promise<void> {
    return new Promise((resolve) => {
      const groupedData = sheetData_OpenOrders.reduce((acc: any, order: any) => {
        const pair = order.Trading_Pair;
        if (!acc[pair]) {
          acc[pair] = { OpenOrders: [], OpenOrdersCount: 0 };
        }
        acc[pair].OpenOrders.push(order);
        acc[pair].OpenOrdersCount++;
        return acc;
      }, {});

      this.openOrdersGroupedData = Object.keys(groupedData).map(pair => {
        return {
          TradingPair: pair,
          OpenOrders: groupedData[pair].OpenOrders,
          OpenOrdersCount: groupedData[pair].OpenOrdersCount
        };
      });

      resolve();
    });
  }

  // -------------------------------------------Cards methods ------------------------------------STARTS

  getEstPnl(singleFilteredTradeData: any, trade: any) {
    let totalPnl = trade.Price * trade.Qty_Open_Order;
    let estPnl =
      totalPnl -
      singleFilteredTradeData.AverageBuyPrice * trade.Qty_Open_Order;

    // Calculate estPnl as a percentage

    // Return the estPnl as a string with 3 decimal places
    return estPnl;
  }
  getEstPnlPercentage(singleFilteredTradeData: any, trade: any) {
    let totalPnl = trade.Price * trade.Qty_Open_Order;
    let estPnl =
      totalPnl -
      singleFilteredTradeData.AverageBuyPrice * trade.Qty_Open_Order;

    // Calculate estPnl as a percentage
    let estPnlPercentage =
      (estPnl /
        (singleFilteredTradeData.AverageBuyPrice * trade.Qty_Open_Order)) *
      100;

    // Return the estPnl as a string with 3 decimal places
    return estPnlPercentage;
  }

  getCurrentPnl(singleFilteredTradeData: any, trade: any) {
    return (
      trade.Qty_Open_Order * singleFilteredTradeData.CurrentStaticPrice -
      trade.Qty_Open_Order * singleFilteredTradeData.AverageBuyPrice
    );
  }


  getCurrentPnlPercentage(singleFilteredTradeData: any, trade: any) {
    // Calculate the current profit and loss
    const currentPnl =
      trade.Qty_Open_Order * singleFilteredTradeData.CurrentStaticPrice -
      trade.Qty_Open_Order * singleFilteredTradeData.AverageBuyPrice;

    // Calculate the percentage
    const currentPnlPercentage =
      (currentPnl /
        (trade.Qty_Open_Order * singleFilteredTradeData.AverageBuyPrice)) *
      100;

    // Return the current profit and loss percentage
    return currentPnlPercentage.toFixed(2);
  }
  getUntilTarget(singleFilteredTradeData: any, trade: any): number {
    const pnlPercentage =
      ((singleFilteredTradeData.CurrentStaticPrice - trade.Price) /
        singleFilteredTradeData.CurrentStaticPrice) *
      100;

    return pnlPercentage;
  }


  getQtyOpen_Percentage(singleFilteredTradeData: any, trade: any): number {

    const TotalBuyQuantity = singleFilteredTradeData.TotalBuyQuantity;
    const Qty_Open_Order = trade.Qty_Open_Order;

    if (TotalBuyQuantity === 0) {
      return 0; // To avoid division by zero
    }

    const percentage = (Qty_Open_Order / TotalBuyQuantity) * 100;
    return parseFloat(percentage.toFixed(2));
  }
  // -------------------------------------------Cards methods ------------------------------------ENDS


  //#endregion


  //#region spot_Trades

  loadSheetData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 1000, 1, this, this.componentDestroyed$)
        .then((sheetData) => {
          if (sheetData) {
            this.calculateMarketData();
            return this.calculateBuySellCounts();
          } else {
            return Promise.reject('No sheet data available');
          }
        })
        .then(() => {
          this.calculateTotalInvestedAllPairs();
          // console.log(this.tradingPairData);
          resolve();
        })
        .catch((error) => {
          console.error('Error in loadSheetData:', error);
          reject(error);
        });
    });
  }


  marketData: any = {};
  calculateMarketData(): Promise<void> {
    return new Promise((resolve) => {

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
      resolve();
    });
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


  tradingPairData: any[] = [];
  calculateBuySellCountsExecuted: boolean = false;
  columnTotals: any = {
    TotalInvested: 0,
    TotalSeedMoney: 0,
    TotalRetrievedSeedMoney: 0
  };


  calculateBuySellCounts(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
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

      const priceRequests = tradingPairs.map((pair) => {
        switch (this.exchangeName.toUpperCase()) {
          case 'BINANCE':
            return this.binanceAPIService.getPrice(pair).toPromise();
          case 'BYBIT':
            return this.bybitAPIService.getPriceBybit(pair).toPromise();
          case 'MEXC':
            return this.mexcAPIService.getPriceMexc(pair).toPromise();
          case 'KUCOIN':
            return this.kucoinAPIServiceRef.getPriceKucoin(pair + '-USDT').toPromise();
          case 'GATEIO':
            return this.gateioAPIServiceRef.getPriceGate(pair + '_USDT').toPromise();
          default:
            return Promise.reject('Unsupported exchange');
        }
      });

      Promise.all(priceRequests)
        .then((responses: any[]) => {
          for (let i = 0; i < tradingPairs.length; i++) {
            const pair = tradingPairs[i];
            const dataForPair = tempSheetData.filter((item: any) => item.Market === pair);
            const marketData = this.marketData[pair];

            let currentPrice = 0;
            switch (this.exchangeName.toUpperCase()) {
              case 'BINANCE':
                currentPrice = parseFloat(responses[i].price) || 0;
                break;
              case 'BYBIT':
                currentPrice = parseFloat(responses[i].result.list[0].lastPrice) || 0;
                break;
              case 'MEXC':
                currentPrice = parseFloat(responses[i].priceInfo.find((p: any) => p.symbol === pair + 'USDT')?.price) || 0;
                break;
              case 'KUCOIN':
                currentPrice = parseFloat(responses[i].data.price) || 0;
                break;
              case 'GATEIO':
                currentPrice = parseFloat(responses[i][0].last) || 0;
                break;
            }

            tradingPairData.push({
              TradingPair: pair,
              TradeCount: dataForPair.length,
              Trades: dataForPair,
              TotalInvestedAmount: marketData?.FINAL_DATA?.TotalInvested || 0,
              AverageBuyPrice: marketData?.FINAL_DATA?.AvgPrice || 0,
              TotalBuyQuantity: marketData?.FINAL_DATA?.TotalAmount || 0,
              CurrentStaticPrice: currentPrice,
              RealizedPnl: marketData?.FINAL_DATA?.RealizedPnl || 0,
              SeedMoney: marketData?.FINAL_DATA?.SeedMoney || 0,
              RetrievedSeedMoney: marketData?.FINAL_DATA?.RetrievedSeedMoney || 0
            });
          }

          this.tradingPairData = tradingPairData;
          resolve();
        })
        .catch((error) => {
          console.error('Error fetching prices:', error);
          reject(error);
        });
    }).finally(() => {
      // This will run regardless of resolve or reject
      // this.getWsDataBasedOnUrl(this.tradingPairData);
    });
  }

  private webSocketRefs: WebSocket[] = [];


  WSData: any[] = []; // Declare WSData as a global property

  prevPrice: number = 0;
  currentPrice: number = 0;

  // Define a map to store prices for each trading pair
  priceMap: Map<string, { currentPrice: number; prevPrice: number }> =
    new Map();

  getWsDataBasedOnUrl() {

    // console.log(this.openTradesFilteredData)

    this.webSocketRefs.forEach((webSocketRef) => {
      webSocketRef.close();
    });

    if (this.exchangeName.toUpperCase() === 'BINANCE') {
      this.WSData = this.openTradesFilteredData.map((element: any) => ({
        Pair: element.TradingPair,
        Url: `wss://stream.binance.com:9443/ws/${element.TradingPair.toLowerCase()}usdt@aggTrade`,
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
          const currentPrice = parseFloat(JSON.parse(event.data).p);

          // Update the 'Price' field in WSData with the current price
          wsItem.Price = currentPrice;

          // Update the price map with the new current and previous prices
          const priceInfo = this.priceMap.get(wsItem.Pair);
          priceInfo!.prevPrice = priceInfo!.currentPrice;
          priceInfo!.currentPrice = currentPrice;

          // Find the corresponding element in openTradesFilteredData and update CurrentPrice
          const tradeElement = this.openTradesFilteredData.find((el: any) => el.TradingPair === wsItem.Pair);
          if (tradeElement) {
            tradeElement.CurrentStaticPrice = currentPrice;
          }

          this.cdr.detectChanges();
        };

        webSocketRef.onerror = (event) => {
          console.error(`WebSocket error for ${wsItem.Pair}:`, event);
        };

        // Store the WebSocket reference for cleanup when the component is destroyed
        this.webSocketRefs.push(webSocketRef);
      }
    }
    if (this.exchangeName.toUpperCase() === 'BYBIT') {

      this.WSData = this.openTradesFilteredData.map((element: any) => ({
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

            const tradeElement = this.openTradesFilteredData.find((el: any) => el.TradingPair === wsItem.Pair);
            if (tradeElement) {
              tradeElement.CurrentStaticPrice = currentPrice;
            }


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

      this.WSData = this.openTradesFilteredData.map((element: any) => ({
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

      }

    }
    if (this.exchangeName.toUpperCase() === 'KUCOIN') {
      let websocketAccessToken: any;
      this.kucoinAPIServiceRef.getKucoinWSAccessToken().subscribe((res: any) => {
        if (res) {
          websocketAccessToken = res.accessToken;
          this.WSData = this.openTradesFilteredData.map((element: any) => ({
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

                // Find the corresponding element in openTradesFilteredData and update CurrentPrice
                const tradeElement = this.openTradesFilteredData.find((el: any) => el.TradingPair === wsItem.Pair);
                if (tradeElement) {
                  tradeElement.CurrentStaticPrice = currentPrice;
                }

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

      this.WSData = this.openTradesFilteredData.map((element: any) => ({
        Pair: element.TradingPair,
        Url: `wss://stream.binance.com:9443/ws/${element.TradingPair.toLowerCase()}usdt@aggTrade`,
        Price: element.CurrentStaticPrice,
      }));



      // Iterate through the WSData array to create WebSocket connections and update prices
      for (const wsItem of this.WSData) {
        const url = wsItem.Url;

        // Initialize priceMap with current and previous prices using CurrentStaticPrice
        this.priceMap.set(wsItem.Pair, {
          currentPrice: wsItem.Price,
          prevPrice: wsItem.Price,
        });

      }

    }



  }

  calculateTotalInvestedAllPairs(): Promise<void> {
    return new Promise((resolve) => {
      // Iterate through all markets and sum up TotalInvested
      for (const market in this.marketData) {
        if (this.marketData.hasOwnProperty(market)) {
          this.columnTotals.TotalInvested += this.marketData[market].FINAL_DATA.TotalInvested;
          this.columnTotals.TotalSeedMoney += this.marketData[market].FINAL_DATA.SeedMoney;
          this.columnTotals.TotalRetrievedSeedMoney += this.marketData[market].FINAL_DATA.RetrievedSeedMoney;
        }
      }
      // console.log("columns total : ", this.columnTotals)
      resolve();
    });
  }

  //#endregion

  onClose(): void {

  }
  ngOnDestroy(): void {

    this.webSocketRefs.forEach((webSocketRef) => {
      webSocketRef.close();
    });
  }
  //#region Sorting && Filtering
  show_advance_options: boolean = false;
  OnShowAdvanceOptions() {
    this.show_advance_options = !this.show_advance_options
  }


  sortingActive = false;
  sortingOrder: any = 'default'; // Default sorting order is descending
  combinedOpenOrders: any[] = [];

  combineAndSortOpenOrders(type: any): void {
    const combined = [];
    for (const singleFilteredTradeData of this.openTradesFilteredData) {
      for (const openOrder of singleFilteredTradeData.OpenOrders) {
        combined.push({
          ...openOrder,
          singleFilteredTradeData
        });
      }
    }




    switch (type) {
      case 'asc_untilTarget':

        this.sortingActive = true;
        this.sortingOrder = 'asc';

        this.combinedOpenOrders = combined.sort((a, b) => {
          const pnlA = this.getUntilTarget(a.singleFilteredTradeData, a);
          const pnlB = this.getUntilTarget(b.singleFilteredTradeData, b);
          return pnlA - pnlB  // Sort based on order
        });
        break;


      case 'desc_untilTarget':

        this.sortingActive = true;
        this.sortingOrder = 'desc';

        this.combinedOpenOrders = combined.sort((a, b) => {
          const pnlA = this.getUntilTarget(a.singleFilteredTradeData, a);
          const pnlB = this.getUntilTarget(b.singleFilteredTradeData, b);
          return pnlB - pnlA  // Sort based on order
        });
        break;

      case 'pair_A-Z':
        this.sortingActive = true;
        this.sortingOrder = 'pair';
        this.combinedOpenOrders = combined.sort((a, b) => {
          const pairA = a.Trading_Pair.toLowerCase();
          const pairB = b.Trading_Pair.toLowerCase();
          return pairA.localeCompare(pairB); // Sort alphabetically
        });
        break;

      case 'date_A-Z':
        this.sortingActive = true;
        this.sortingOrder = 'date';
        this.combinedOpenOrders = combined.sort((a, b) => {
          const dateA = new Date(a.Date);
          const dateB = new Date(b.Date);
          return dateA.getTime() - dateB.getTime(); // Sort by date in ascending order
        });
        break;

      case 'date_Z-A':
        this.sortingActive = true;
        this.sortingOrder = 'date_Z-A';
        this.combinedOpenOrders = combined.sort((a, b) => {
          const dateA = new Date(a.Date);
          const dateB = new Date(b.Date);
          return dateB.getTime() - dateA.getTime(); // Sort by date in descending order
        });
        break;

      case 'default':
        this.sortingActive = false;
        this.sortingOrder = ''
        break;
    }

  }



  sortOrders(type: any) {

    this.combineAndSortOpenOrders(type)


  }

  searchTerm: string = ''
  get filterData() {
    let filteredData: any;

    if (this.sortingActive) {
      filteredData = this.searchTerm
        ? this.combinedOpenOrders.filter((trade: any) =>
          trade.Trading_Pair.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
        : this.combinedOpenOrders;

    
      }
      else 

      {
        filteredData = this.searchTerm
        ? this.openTradesFilteredData.filter((trade: any) =>
          trade.TradingPair.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
        : this.openTradesFilteredData;

    
      }

    return filteredData
  }

  //#endregion

}
