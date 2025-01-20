import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ExchangeDetailsModalComponent } from './exchange-details-modal/exchange-details-modal.component';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsExporting from 'highcharts/modules/exporting';
import { BinanceAPIService } from 'src/app/services/WorkingExchangeAPI/binanceAPI.service';
import { BybitAPIService } from 'src/app/services/WorkingExchangeAPI/bybitAPI.service';
import { MexcAPIService } from 'src/app/services/WorkingExchangeAPI/mexcAPI.service';
import { KucoinAPIService } from 'src/app/services/WorkingExchangeAPI/kucoinAPI.service';
import { GateioAPIService } from 'src/app/services/WorkingExchangeAPI/gateioAPI.service';

// Initialize Highcharts modules
HighchartsMore(Highcharts);
Highcharts3D(Highcharts);
HighchartsExporting(Highcharts);

interface OpenOrderData {
  exchange: string;
  pair: string;
  invested: number;
  openOrders: number;
  filledOrders: number;
  unfilledOrders: number;
  expectedReturn: number;
  expectedPnL: number;
}

interface OpenOrderPairData {
  TotalOpenOrders: number;
  TotalFilledOrders: number;
  TotalUnFilledOrders: number;
  TotalExpectedReturn: number;
  TotalExpectedPnl: number;
  TotalInvested: number;
}

@Component({
  selector: 'app-open-orders-aio-dashboard',
  templateUrl: './open-orders-aio-dashboard.component.html',
  styleUrls: ['./open-orders-aio-dashboard.component.scss']
})
export class OpenOrdersAioDashboardComponent implements OnInit, OnDestroy {

  IsMasterControlEnabled: boolean = false;
  exchangesNames: string[] = ['Binance', 'Bybit', 'Mexc', 'Kucoin', 'Gateio', 'Ourbit'];
  sheetData: { [key: string]: any[] } = {};
  openOrders: { [key: string]: any[] } = {};
  marketData: { [key: string]: any } = {};
  columnTotal_OpenOrders_PNL_ForEachPair: { [key: string]: any } = {}; // This will store the result of the calculation
  columnTotals_AllPairs: { [key: string]: any } = {};

  IsProcessedTradingPairData: boolean = false;
  IsColumnTotals_ForALL_Processed: boolean = false;
  private componentDestroyed$: Subject<void> = new Subject<void>();


  isLive = false; // Track live status

  IsShowMoreDetails = false;
  expandedExchange: string | null = null;
  selectedExchanges_OpenOrders_combined_Data: Set<string> = new Set(); // Set of selected exchanges

  combinedOpenOrdersData: OpenOrderData[] = [];

  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private functionsServiceRef: FunctionsService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private binanceAPIService: BinanceAPIService,
    private bybitAPIService: BybitAPIService,
    private mexcAPIService: MexcAPIService,
    private kucoinAPIServiceRef: KucoinAPIService,
    private gateioAPIServiceRef: GateioAPIService
  ) { }

  ngOnInit(): void {


    this.IsProcessedTradingPairData = false;
    this.googleSheetAPIServiceRef.checkMasterControlSubject$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((IsEnabled: boolean) => {
        this.IsMasterControlEnabled = IsEnabled;
      });

    const dataFetchPromises = this.exchangesNames.map((exchange: string) => {
      return Promise.all([
        this.functionsServiceRef.loadAllSheetData_WithoutMatTable(exchange, 'Spot_Trades', 500, this.componentDestroyed$)
          .then(data => {
            this.sheetData[exchange] = data;
          }),
        this.functionsServiceRef.loadAllSheetData_WithoutMatTable(exchange, 'SIP_Open_Orders', 500, this.componentDestroyed$)
          .then(data => {
            this.openOrders[exchange] = data;
          })
      ]);
    });

    Promise.all(dataFetchPromises).then(() => {
      // console.log("All promises resolved for all exchanges");
      // console.log("Fetched sheetData: ", this.sheetData);
      // console.log("Fetched openOrders: ", this.openOrders);

      // Calculate market data after all promises are resolved
      this.calculateMarketData().then(() => {
        // console.log("Market data calculated: ", this.marketData);
        this.calculateOpenOrder_Pnl_For_EachPair().then(() => {
          // console.log('columnTotal_OpenOrders_PNL_ForEachPair : ', this.columnTotal_OpenOrders_PNL_ForEachPair)
          this.selectedExchanges_OpenOrders_combined_Data = new Set(Object.keys(this.columnTotal_OpenOrders_PNL_ForEachPair));

          this.render_CombinedOpenOrdersPairChart();

          this.render_TradingOpenOrderPairCharts();
          this.IsProcessedTradingPairData = true;


          // this.getWsDataBasedOnUrl();
          this.calculateTotalInvestedAllPairs().then(() => {
            this.render_combinedDataChart();
            this.render_columnTotals_AllPairs();
            this.render_SpotTradesTotalCurrentValue_1();
            // this.render_SpotTradesTotalCurrentValue_2();
            this.render_OpenOrdersTotalExpectedReturn_1();
            // this.render_OpenOrdersTotalExpectedReturn_2();
            
            // Update all chart data at once
            this.updatePerformanceCharts();
            
            // Portfolio Distribution
            this.portfolioDistributionPieChart.series = [{
              type: 'pie',
              name: 'Investment Share',
              colorByPoint: true,
              data: this.getPortfolioDistributionData()
            } as Highcharts.SeriesPieOptions];

            // Seed Money Return
            this.seedMoneyReturnChart.xAxis = {
              categories: this.exchangeNames
            };
            this.seedMoneyReturnChart.series = [{
              type: 'column',
              name: 'Seed Money',
              color: '#3498DB',
              data: this.getSeedMoneyData()
            }, {
              type: 'column',
              name: 'Retrieved',
              data: this.getRetrievedMoneyData()
            }] as Array<Highcharts.SeriesColumnOptions>;

            // Risk Reward Ratio
            this.riskRewardRatioChart.series = [{
              type: 'scatter',
              name: 'Exchanges',
              data: this.getRiskRewardData(),
              tooltip: {
                pointFormat: '{point.name}: Risk: {point.x}, Reward: {point.y}'
              }
            }] as Array<Highcharts.SeriesScatterOptions>;

            // Profitability Trend
            this.profitabilityTrendChart.xAxis = {
              categories: this.exchangeNames
            };
            this.profitabilityTrendChart.series = [{
              type: 'line',
              name: 'Current P/L %',
              data: this.getProfitabilityData()
            }] as Array<Highcharts.SeriesLineOptions>;

            this.IsColumnTotals_ForALL_Processed = true;

            // console.log("Column totals (All Pairs) calculated: ", this.columnTotals_AllPairs);



          });

          // Set up WebSocket connections based on the initial state

        });
        if (this.isLive) {
          this.getWsDataBasedOnUrl();
        }
      });
    }).catch(error => {
      console.error("Error fetching data for exchanges:", error);
    });
  }

  toggleLiveData(): void {
    this.isLive = !this.isLive;
    if (this.isLive) {
      this.getWsDataBasedOnUrl(); // Setup WebSocket connections
    } else {
      this.webSocketRefs.forEach((webSocketRef) => {
        webSocketRef.close(); // Close WebSocket connections
      });
    }
  }


  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
    this.webSocketRefs.forEach((webSocketRef) => {
      webSocketRef.close();
    });
  }

  // #region price api  (used to get total current value only , commented because taking very much time  ) 
  // #region price API used
  // calculateMarketData(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     // Process each exchange
  //     const exchanges = Object.keys(this.sheetData);
  //     const apiPriceRequests: Promise<void>[] = [];

  //     exchanges.forEach(exchange => {
  //       this.marketData[exchange] = {};
  //       let tempSheetData = this.sheetData[exchange];

  //       // Process each trade
  //       tempSheetData.forEach(trade => {
  //         if (!this.marketData[exchange][trade.Market]) {
  //           // Initialize market data if it doesn't exist
  //           this.marketData[exchange][trade.Market] = {
  //             buyTrades: [],
  //             sellTrades: [],
  //             FINAL_DATA: {
  //               AvgPrice: 0,
  //               TotalAmount: 0,
  //               TotalInvested: 0,
  //               RealizedPnl: 0,
  //               SeedMoney: 0,
  //               RetrievedSeedMoney: 0,
  //               CurrentPrice: 0
  //             }
  //           };
  //         }

  //         // Use the combined method to handle both BUY and SELL trades
  //         this.calculateBuySellTrades(exchange, trade);
  //       });

  //       // Fetch API prices for the current exchange
  //       apiPriceRequests.push(this.getAPIPrice(exchange));
  //     });

  //     // Wait for all API price requests to complete
  //     Promise.all(apiPriceRequests)
  //       .then(() => {
  //         // Calculate PNL after fetching prices
  //         this.calculatePNL();
  //         resolve();
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching API prices:', error);
  //         reject(error);
  //       });
  //   });
  // }
  //#endregion
  // #region price API commented

  calculateMarketData(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Process each exchange
      const exchanges = Object.keys(this.sheetData);
      const calculatedMarketDataPromiseResponse: Promise<void>[] = [];

      exchanges.forEach(exchange => {
        this.marketData[exchange] = {};
        let tempSheetData = this.sheetData[exchange];

        // Process each trade
        tempSheetData.forEach(trade => {
          if (!this.marketData[exchange][trade.Market]) {
            // Initialize market data if it doesn't exist
            this.marketData[exchange][trade.Market] = {
              buyTrades: [],
              sellTrades: [],
              FINAL_DATA: {
                AvgPrice: 0,
                TotalAmount: 0,
                TotalInvested: 0,
                RealizedPnl: 0,
                SeedMoney: 0,
                RetrievedSeedMoney: 0,
                // CurrentPrice: 0
              }
            };
          }

          // Use the  method to handle both BUY and SELL trades
          this.calculateBuySellTrades(exchange, trade);

        });

        // Fetch API prices for the current exchange
        // apiPriceRequests.push(this.getAPIPrice(exchange));

      });

      // Wait for all API price requests to complete
      Promise.all(calculatedMarketDataPromiseResponse)
        .then(() => {
          // Calculate PNL after fetching prices
          this.calculatePNL();
          resolve();
        })
        .catch((error) => {
          console.error('Error fetching API prices:', error);
          reject(error);
        });
    });
  }
  //#endregion
  //#endregion

  calculateBuySellTrades(exchange: string, trade: any) {
    if (trade.Direction === 'BUY') {
      // Calculate Cost for Buy Trade
      trade.Cost = trade.Amount * trade.Price;

      // Update marketData for Buy Trade
      this.marketData[exchange][trade.Market].buyTrades.push(trade);
      this.marketData[exchange][trade.Market].FINAL_DATA.TotalAmount += trade.Amount;
      this.marketData[exchange][trade.Market].FINAL_DATA.TotalInvested += trade.Cost;
      this.marketData[exchange][trade.Market].FINAL_DATA.AvgPrice =
        this.marketData[exchange][trade.Market].FINAL_DATA.TotalInvested / this.marketData[exchange][trade.Market].FINAL_DATA.TotalAmount;
    } else if (trade.Direction === 'SELL') {
      // Calculate Cost for Sell Trade
      trade.Cost = this.marketData[exchange][trade.Market].FINAL_DATA.AvgPrice * trade.Amount;

      // Update marketData for Sell Trade
      this.marketData[exchange][trade.Market].sellTrades.push(trade);
      this.marketData[exchange][trade.Market].FINAL_DATA.TotalAmount -= trade.Amount;
      this.marketData[exchange][trade.Market].FINAL_DATA.TotalInvested -= trade.Cost;

      // Recalculate AvgPrice if totalAmount is still positive
      if (this.marketData[exchange][trade.Market].FINAL_DATA.TotalAmount > 0) {
        this.marketData[exchange][trade.Market].FINAL_DATA.AvgPrice =
          this.marketData[exchange][trade.Market].FINAL_DATA.TotalInvested / this.marketData[exchange][trade.Market].FINAL_DATA.TotalAmount;
      } else {
        this.marketData[exchange][trade.Market].FINAL_DATA.AvgPrice = 0;
      }



    }
  }



  calculatePNL() {
    // Iterate through all exchanges and markets to calculate PNL based on sell trades
    for (const exchange in this.marketData) {
      if (this.marketData.hasOwnProperty(exchange)) {
        for (const market in this.marketData[exchange]) {
          if (this.marketData[exchange].hasOwnProperty(market)) {
            // Calculate PNL only for sell trades
            this.marketData[exchange][market].FINAL_DATA.RealizedPnl =
              this.marketData[exchange][market].sellTrades.reduce((sum: any, sellTrade: any) => sum + (sellTrade.Total_USDT - sellTrade.Cost), 0);

            this.marketData[exchange][market].FINAL_DATA.RetrievedSeedMoney =
              this.marketData[exchange][market].sellTrades.reduce((sum: any, sellTrade: any) => sum + (sellTrade.Total_USDT), 0);

            this.marketData[exchange][market].FINAL_DATA.SeedMoney =
              this.marketData[exchange][market].buyTrades.reduce((sum: any, buyTrades: any) => sum + (buyTrades.Total_USDT), 0);
          }
        }
      }
    }
  }



  calculateOpenOrder_Pnl_For_EachPair(): Promise<void> {
    return new Promise((resolve) => {
      // Initialize the columnTotal_OpenOrders_PNL_ForEachPair object
      this.columnTotal_OpenOrders_PNL_ForEachPair = {};

      // Iterate through all exchanges
      for (const exchange in this.marketData) {
        if (this.marketData.hasOwnProperty(exchange)) {
          // Initialize the exchange key in columnTotal_OpenOrders_PNL_ForEachPair if not already present
          if (!this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) {
            this.columnTotal_OpenOrders_PNL_ForEachPair[exchange] = {};
          }

          // Iterate through each market in marketData for the current exchange
          for (const market in this.marketData[exchange]) {
            if (this.marketData[exchange].hasOwnProperty(market)) {
              // Initialize the market key in columnTotal_OpenOrders_PNL_ForEachPair if not already present
              // if (!this.columnTotal_OpenOrders_PNL_ForEachPair[exchange][market]) {
              //   this.columnTotal_OpenOrders_PNL_ForEachPair[exchange][market] = {
              //     FINAL_DATA: this.marketData[exchange][market].FINAL_DATA,
              //     OpenOrders: []
              //   };
              // }

              // Check if there are corresponding open orders for this market
              if (this.openOrders[exchange]) {
                // Find all open orders that match the market
                const openOrdersForMarket = this.openOrders[exchange].filter(order => order.Trading_Pair === market);

                // If there are matching open orders, add them to columnTotal_OpenOrders_PNL_ForEachPair
                if (openOrdersForMarket.length > 0) {
                  // Calculate totals
                  const totalOpenOrders = openOrdersForMarket.length;
                  const totalQtyOpenOrder = openOrdersForMarket.reduce((sum, order) => sum + (order.Qty_Open_Order || 0), 0);
                  const totalFilledOrders = openOrdersForMarket.filter(order => order.Filled === 'YES').length;
                  const totalUnFilledOrders = openOrdersForMarket.filter(order => order.Filled === 'NO').length;
                  const totalPlacedOrders = openOrdersForMarket.filter(order => order.Is_Placed === 'YES').length;
                  const totalUnPlacedOrders = openOrdersForMarket.filter(order => order.Is_Placed === 'NO').length;
                  const totalReturn = openOrdersForMarket.reduce((sum, order) => sum + (order.Amount || 0), 0);

                  // Combine FINAL_DATA and OpenOrders into one object
                  this.columnTotal_OpenOrders_PNL_ForEachPair[exchange][market] = {
                    // Directly include FINAL_DATA fields
                    AvgPrice: this.marketData[exchange][market].FINAL_DATA.AvgPrice,
                    TotalAmount: this.marketData[exchange][market].FINAL_DATA.TotalAmount,
                    TotalInvested: this.marketData[exchange][market].FINAL_DATA.TotalInvested,
                    RealizedPnl: this.marketData[exchange][market].FINAL_DATA.RealizedPnl,
                    SeedMoney: this.marketData[exchange][market].FINAL_DATA.SeedMoney,
                    RetrievedSeedMoney: this.marketData[exchange][market].FINAL_DATA.RetrievedSeedMoney,
                    // TotalCalculated object with required metrics
                    // TotalCalculated: {
                    TotalOpenOrders: totalOpenOrders,
                    TotalQty_Open_Order: totalQtyOpenOrder,
                    TotalFilledOrders: totalFilledOrders,
                    TotalUnFilledOrders: totalUnFilledOrders,
                    TotalPlacedOrders: totalPlacedOrders,
                    TotalUnPlacedOrders: totalUnPlacedOrders,
                    TotalExpectedReturn: totalReturn,
                    TotalExpectedPnl: (totalReturn) - (this.marketData[exchange][market].FINAL_DATA.TotalInvested),
                    // CurrentPrice: this.marketData[exchange][market].FINAL_DATA.CurrentPrice
                    // }
                  };
                }
              }
            }
          }
        }
      }

      // Resolve the promise once the calculation is done
      resolve();
    });
  }


  calculateTotalInvestedAllPairs(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.columnTotals_AllPairs = {};

      // Fetch all prices in parallel
      this.getAPIPrices()
        .then(() => {
          // Process each exchange's data
          for (const exchange in this.marketData) {
            if (this.marketData.hasOwnProperty(exchange)) {
              if (!this.columnTotals_AllPairs[exchange]) {
                this.columnTotals_AllPairs[exchange] = {
                  TotalInvested: 0,
                  TotalSeedMoney: 0,
                  TotalRetrievedSeedMoney: 0,
                  TotalExpectedReturn: 0,
                  TotalExpectedPnl: 0,
                  TotalCurrentValue: 0
                };
              }

              // Sum values from marketData
              for (const market in this.marketData[exchange]) {
                if (this.marketData[exchange].hasOwnProperty(market)) {
                  const marketData = this.marketData[exchange][market].FINAL_DATA;
                  this.columnTotals_AllPairs[exchange].TotalInvested += marketData.TotalInvested || 0;
                  this.columnTotals_AllPairs[exchange].TotalSeedMoney += marketData.SeedMoney || 0;
                  this.columnTotals_AllPairs[exchange].TotalRetrievedSeedMoney += marketData.RetrievedSeedMoney || 0;

                  // Ensure current price is available
                  const currentPrice = this.marketData[exchange][market].FINAL_DATA.CurrentPrice || 0;
                  const totalAmount = this.marketData[exchange][market].FINAL_DATA.TotalAmount || 0;
                  this.columnTotals_AllPairs[exchange].TotalCurrentValue += (totalAmount * currentPrice) || 0;
                }
              }

              // Sum TotalReturnPnl from columnTotal_OpenOrders_PNL_ForEachPair
              if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) {
                for (const market in this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) {
                  if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange].hasOwnProperty(market)) {
                    const TotalExpectedReturn = this.columnTotal_OpenOrders_PNL_ForEachPair[exchange][market].TotalExpectedReturn || 0;
                    this.columnTotals_AllPairs[exchange].TotalExpectedReturn += TotalExpectedReturn;
                  }
                }
              }
              this.columnTotals_AllPairs[exchange].TotalExpectedPnl = this.columnTotals_AllPairs[exchange].TotalExpectedReturn - this.columnTotals_AllPairs[exchange].TotalInvested;
            }
          }

          // Convert object to array for sorting
          const sortedEntries = Object.entries(this.columnTotals_AllPairs)
            .map(([exchange, data]) => ({
              exchange,
              ...data,
            }))
            .sort((a, b) => b.TotalCurrentValue - a.TotalCurrentValue); // Sort in descending order

          // Convert sorted array back to object if needed
          this.columnTotals_AllPairs = sortedEntries.reduce((acc, { exchange, ...data }) => {
            acc[exchange] = data;
            return acc;
          }, {});
          resolve();
        })
        .catch(reject);
    });
  }

  getAPIPrices(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create an array of promises for all exchanges and their trading pairs
      const allPromises: Promise<{ exchange: string, pair: string, response: any }>[] = [];

      for (const exchange in this.marketData) {
        if (this.marketData.hasOwnProperty(exchange)) {
          const tradingPairs: string[] = [
            ...new Set(this.sheetData[exchange].map((item: any) => item.Market))
          ];



          tradingPairs.forEach((pair) => {
            let priceRequest: Promise<any>;

            switch (exchange.toUpperCase()) {
              case 'BINANCE':
                priceRequest = this.binanceAPIService.getPrice(pair).toPromise();
                break;
              case 'OURBIT':
                priceRequest = this.binanceAPIService.getPrice(pair).toPromise();
                break;
              case 'BYBIT':
                priceRequest = this.bybitAPIService.getPriceBybit(pair).toPromise();
                break;
              case 'MEXC':
                priceRequest = this.mexcAPIService.getPriceMexc(pair).toPromise();
                break;
              case 'KUCOIN':
                priceRequest = this.kucoinAPIServiceRef.getPriceKucoin(pair + '-USDT').toPromise();
                break;
              case 'GATEIO':
                priceRequest = this.gateioAPIServiceRef.getPriceGate(pair + '_USDT').toPromise();
                break;
              default:
                priceRequest = Promise.reject('Unsupported exchange');
            }

            // Handle errors for individual requests
            allPromises.push(
              priceRequest
                .then(response => ({ exchange, pair, response }))
                .catch(() => ({ exchange, pair, response: { price: '0' } })) // Default to 0 on error
            );
          });
        }
      }

      Promise.all(allPromises)
        .then((responses) => {
          // Process responses
          responses.forEach(({ exchange, pair, response }) => {
            let currentPrice = 0;

            switch (exchange.toUpperCase()) {
              case 'BINANCE':
                currentPrice = parseFloat(response.price) || 0;
                break;
              case 'OURBIT':
                currentPrice = parseFloat(response.price) || 0;
                break;
              case 'BYBIT':
                currentPrice = response.result.list ? (parseFloat(response.result.list[0].lastPrice) || 0) : 0;
                break;
              case 'MEXC':
                currentPrice = parseFloat(response.priceInfo.find((p: any) => p.symbol === pair + 'USDT')?.price) || 0;
                break;
              case 'KUCOIN':
                // (response.data != null) ? parseFloat(responses[i].data.price) : 0,
                currentPrice = (response.data != null) ?  parseFloat(response.data.price) : 0;
                break;
              case 'GATEIO':
                currentPrice = parseFloat(response[0].last) || 0;
                break;
            }

            // Update marketData with the current price
            if (this.marketData[exchange] && this.marketData[exchange][pair]) {
              this.marketData[exchange][pair].FINAL_DATA.CurrentPrice = currentPrice;
            }
          });

          resolve();
        })
        .catch((error) => {
          console.error('Error processing prices:', error);
          reject(error);
        });
    });
  }


  // #region WebSocket code 
  private webSocketRefs: WebSocket[] = [];
  WSData: any[] = []; // Declare WSData as a global property
  priceMap: Map<string, { currentPrice: number; prevPrice: number }> =
    new Map();

  getWsDataBasedOnUrl() {


    // Close existing WebSocket connections
    this.webSocketRefs.forEach((webSocketRef) => {
      webSocketRef.close();
    });
    this.webSocketRefs = []; // Clear references

    // Loop through each exchange in columnTotal_OpenOrders_PNL_ForEachPair
    Object.keys(this.columnTotal_OpenOrders_PNL_ForEachPair).forEach((exchangeName) => {
      const exchangeData = this.columnTotal_OpenOrders_PNL_ForEachPair[exchangeName];

      if (exchangeName.toUpperCase() === 'BINANCE' || exchangeName.toUpperCase() === 'OURBIT') {
        this.setupBinanceWebSockets(exchangeData);
      } else if (exchangeName.toUpperCase() === 'BYBIT') {
        this.setupBybitWebSockets(exchangeData);
      } else if (exchangeName.toUpperCase() === 'KUCOIN') {
        this.setupKucoinWebSockets(exchangeData);
      } else if (exchangeName.toUpperCase() === 'GATEIO') {
        this.setupGateioWebSockets(exchangeData);
      }

    });
  }

  private setupBinanceWebSockets(exchangeData: any) {
    this.WSData = Object.keys(exchangeData).map((pair: string) => ({
      Pair: pair,
      Url: `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}usdt@aggTrade`,
      Price: exchangeData[pair].CurrentPrice,
    }));

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

        // Find the corresponding element in columnTotal_OpenOrders_PNL_ForEachPair and update AvgPrice
        const pairInfo = exchangeData[wsItem.Pair];
        if (pairInfo) {
          pairInfo.CurrentPrice = currentPrice;
        }
        this.calculateOpenOrder_Pnl_For_EachPair()

        this.cdr.detectChanges();
      };

      webSocketRef.onerror = (event) => {
        console.error(`WebSocket error for ${wsItem.Pair}:`, event);
      };

      this.webSocketRefs.push(webSocketRef);
    }
  }

  private setupBybitWebSockets(exchangeData: any) {
    this.WSData = Object.keys(exchangeData).map((pair: string) => ({
      Pair: pair,
      Url: `wss://stream.bybit.com/v5/public/spot`,
      Params: {
        op: 'subscribe',
        args: [`tickers.${pair}USDT`],
      },
      Price: exchangeData[pair].CurrentPrice,
    }));

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

          const pairInfo = exchangeData[wsItem.Pair];
          if (pairInfo) {
            pairInfo.CurrentPrice = currentPrice;
          }
          this.calculateOpenOrder_Pnl_For_EachPair()

          this.cdr.detectChanges();
        }
      };

      webSocketRef.onerror = (event) => {
        console.error(`WebSocket error for ${wsItem.Pair}:`, event);
      };

      webSocketRef.addEventListener('open', () => {
        webSocketRef.send(JSON.stringify(wsItem.Params));
      });

      this.webSocketRefs.push(webSocketRef);
    }
  }

  private setupKucoinWebSockets(exchangeData: any) {
    let websocketAccessToken: any;
    this.kucoinAPIServiceRef.getKucoinWSAccessToken().subscribe((res: any) => {
      if (res) {
        websocketAccessToken = res.accessToken;
        this.WSData = Object.keys(exchangeData).map((pair: string) => ({
          Pair: pair,
          Url: `wss://ws-api-spot.kucoin.com/?token=${websocketAccessToken}`,
          Price: exchangeData[pair].CurrentPrice,
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
              id: Date.now().toString(),
              type: 'subscribe',
              topic: `/market/ticker:${wsItem.Pair}-USDT`,
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
            }, 30000);
          };

          webSocketRef.onmessage = (event) => {
            const messageData = JSON.parse(event.data);

            if (messageData.type === 'welcome' || messageData.type === 'ack') {
              return;
            }

            if (messageData.type === 'message' && messageData.subject === 'trade.ticker') {
              const currentPrice = parseFloat(messageData.data.price);

              wsItem.Price = currentPrice;

              const priceInfo = this.priceMap.get(wsItem.Pair);
              priceInfo!.prevPrice = priceInfo!.currentPrice;
              priceInfo!.currentPrice = currentPrice;

              const pairInfo = exchangeData[wsItem.Pair];
              if (pairInfo) {
                pairInfo.CurrentPrice = currentPrice;
              }
              this.calculateOpenOrder_Pnl_For_EachPair()

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
      }
    });
  }

  private setupGateioWebSockets(exchangeData: any) {
    this.WSData = Object.keys(exchangeData).map((pair: string) => ({
      Pair: pair,
      Url: `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}usdt@aggTrade`,
      Price: exchangeData[pair].CurrentPrice,
    }));

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

        // Find the corresponding element in columnTotal_OpenOrders_PNL_ForEachPair and update AvgPrice
        const pairInfo = exchangeData[wsItem.Pair];
        if (pairInfo) {
          pairInfo.CurrentPrice = currentPrice;
        }
        this.calculateOpenOrder_Pnl_For_EachPair()

        this.cdr.detectChanges();
      };

      webSocketRef.onerror = (event) => {
        console.error(`WebSocket error for ${wsItem.Pair}:`, event);
      };

      this.webSocketRefs.push(webSocketRef);
    }
  }

  // #endregion



  //#region testing the ws updates the price 
  getExchangeNames(): string[] {
    return Object.keys(this.columnTotal_OpenOrders_PNL_ForEachPair);
  }

  // Method to get the number of pairs for a specific exchange
  getNumberOfPairsForExchange(exchange: string): number {
    // Check if the exchange exists in the columnTotal_OpenOrders_PNL_ForEachPair object
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) {
      // Return the number of keys in the exchange object, which represents the number of trading pairs
      return Object.keys(this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]).length;
    }
    // Return 0 if the exchange does not exist or has no pairs
    return 0;
  }


  getPairsForExchange(exchange: string): string[] {
    // First try the new data structure
    if (this.combinedOpenOrdersData.length > 0) {
      return this.combinedOpenOrdersData
        .filter((item: OpenOrderData) => item.exchange === exchange)
        .map((item: OpenOrderData) => item.pair);
    }
    
    // Fall back to the old data structure if needed
    if (this.columnTotal_OpenOrders_PNL_ForEachPair && 
        this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) {
      return Object.keys(this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]);
    }
    
    return [];
  }



  get getColumnTotals_AIO() {

    const totalMetrics: { [key: string]: number } = {
      TotalInvested: 0, //done
      TotalSeedMoney: 0,
      TotalRetrievedSeedMoney: 0,
      TotalExpectedReturn: 0, //done
      TotalExpectedPnl: 0, //done
      TotalCurrentValue: 0 //done
    };

    Object.values(this.columnTotals_AllPairs).forEach((metrics: { [metric: string]: number }) => {
      for (const [key, value] of Object.entries(metrics)) {
        if (typeof value === 'number' && totalMetrics.hasOwnProperty(key)) {
          totalMetrics[key] += value;
        }
      }
    });

    return totalMetrics;
  }




  get percentageIncreaseInvestedOverReturn(): number {
    const totalInvested = this.getColumnTotals_AIO['TotalInvested'];
    const totalExpectedReturn = this.getColumnTotals_AIO['TotalExpectedReturn'];

    if (totalInvested === 0) return 0; // Avoid division by zero

    const percentageIncrease = ((totalExpectedReturn - totalInvested) / totalInvested) * 100;
    return percentageIncrease;
  }

  get percentageIncreasePnlOverInvested(): number {
    const totalInvested = this.getColumnTotals_AIO['TotalInvested'];
    const totalExpectedPnl = this.getColumnTotals_AIO['TotalExpectedPnl'];

    if (totalInvested === 0) return 0; // Avoid division by zero

    const percentageIncrease = ((totalExpectedPnl - totalInvested) / totalInvested) * 100;
    return percentageIncrease;
  }

  get percentageIncreaseDecreaseOverCurrentValue(): number {
    const totalInvested = this.getColumnTotals_AIO['TotalInvested'];
    const totalCurrentValue = this.getColumnTotals_AIO['TotalCurrentValue'];

    if (totalInvested === 0) return 0; // Avoid division by zero

    const percentageIncrease = ((totalCurrentValue - totalInvested) / totalInvested) * 100;
    return percentageIncrease;
  }
  getPercentage(value1: any, value2: any): number {

    // Ensure values are numbers
    const numValue1 = Number(value1);
    const numValue2 = Number(value2);

    if (numValue1 === 0) return 0; // Avoid division by zero

    const percentageChange = (numValue2 / numValue1) * 100;
    return parseFloat(percentageChange.toFixed(2));
  }



  showMoreDetails() {
    this.IsShowMoreDetails = !this.IsShowMoreDetails;
  }


  get exchangeNames(): string[] {
    return Object.keys(this.columnTotals_AllPairs).sort((a, b) => a.localeCompare(b));
  }

  toggleDetails(exchange: string): void {
    this.expandedExchange = this.expandedExchange === exchange ? null : exchange;
  }


  isLast(index: number): boolean {
    return index === (this.getExchangeNames().length - 1);
  }


  isLargeScreen(): boolean {
    return window.innerWidth >= 992; // Example breakpoint for large screens
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // This method will run when the window is resized
  }


  IsShowMoreDetails_OpenOrdersTable = true;
  showMoreDetails_OpenOrdersTable() {
    this.IsShowMoreDetails_OpenOrdersTable = !this.IsShowMoreDetails_OpenOrdersTable;
  }




  // Combine data for all exchanges


  // Toggle selection of an exchange
  toggleExchange(exchange: string) {
    if (this.selectedExchanges_OpenOrders_combined_Data.has(exchange)) {
      this.selectedExchanges_OpenOrders_combined_Data.delete(exchange);
    } else {
      this.selectedExchanges_OpenOrders_combined_Data.add(exchange);
    }
    this.render_CombinedOpenOrdersPairChart();
  }
  isSelected(exchange: string): boolean {
    // Always return true to show all exchanges
    return true;
  }

  // Method to check if all exchanges are currently selected
  allExchangesSelected(): boolean {
    const allExchanges = new Set(this.getExchangeNames());
    return this.selectedExchanges_OpenOrders_combined_Data.size === allExchanges.size &&
      Array.from(allExchanges).every(exchange => this.selectedExchanges_OpenOrders_combined_Data.has(exchange));
  }

  // Method to check if no exchanges are selected
  noExchangesSelected(): boolean {
    return this.selectedExchanges_OpenOrders_combined_Data.size === 0;
  }

  // showAll_CombinedOpenOrdersPairChart_allExchanges() {
  //   this.selectedExchanges_OpenOrders_combined_Data = new Set(this.getExchangeNames());
  //   this.render_CombinedOpenOrdersPairChart();
  // }

  // // Method to deselect all exchanges
  // hideAll_CombinedOpenOrdersPairChart_allExchanges() {
  //   this.selectedExchanges_OpenOrders_combined_Data.clear();
  //   this.render_CombinedOpenOrdersPairChart();
  // }




  
  // Aggregate data for selected exchanges
  aggregateOpenOrdersDataForSelectedExchanges(): any {
    const allPairs: any = {};

    this.selectedExchanges_OpenOrders_combined_Data.forEach(exchange => {
      const pairs = this.columnTotal_OpenOrders_PNL_ForEachPair[exchange];

      for (const pair in pairs) {
        if (!allPairs[pair]) {
          allPairs[pair] = {
            TotalInvested: 0,
            TotalOpenOrders: 0,
            TotalFilledOrders: 0,
            TotalUnFilledOrders: 0,
            TotalPlacedOrders: 0,
            TotalUnPlacedOrders: 0,
            TotalExpectedReturn: 0,
            TotalExpectedPnl: 0,
            Exchanges: []  // Keep track of which exchanges the pair is in
          };
        }

        const data = pairs[pair];
        allPairs[pair].TotalInvested += data.TotalInvested;
        allPairs[pair].TotalOpenOrders += data.TotalOpenOrders;
        allPairs[pair].TotalFilledOrders += data.TotalFilledOrders;
        allPairs[pair].TotalUnFilledOrders += data.TotalUnFilledOrders;
        allPairs[pair].TotalPlacedOrders += data.TotalPlacedOrders;
        allPairs[pair].TotalUnPlacedOrders += data.TotalUnPlacedOrders;
        allPairs[pair].TotalExpectedReturn += data.TotalExpectedReturn;
        allPairs[pair].TotalExpectedPnl += data.TotalExpectedPnl;
        allPairs[pair].Exchanges.push(exchange); // Add exchange to list
      }
    });

    return allPairs;
  }








  //#endregion


  //#region  Charts
  Highcharts: typeof Highcharts = Highcharts;
  chatOptions_SpotTotalCurrentValue_1!: Highcharts.Options;//ColumnChart
  chatOptions_SpotTotalCurrentValue_2!: Highcharts.Options;//ColumnChart
  OpenOrdersTotalExpectedReturn_1!: Highcharts.Options;
  OpenOrdersTotalExpectedReturn_2!: Highcharts.Options;
  columnTotals_AllPairs_ChartOptions!: Highcharts.Options;
  columnTotals_AllPairs_AIO_ChartOptions!: Highcharts.Options;


  //for open orders data
  chartOptions_CombinedOpenOrders!: Highcharts.Options;
  chartOptions: { [exchange: string]: Highcharts.Options } = {};




  render_combinedDataChart() {
    // Define your data structure
    const aggregatedData: any = {
      Invested: 0,
      Current: 0,
      Return: 0,
      ReturnPnl: 0,
      UntilTargetValue: 0,
      UntilTargetPnl: 0,
      Seed: 0,
      RetrievedSeedMoney: 0,
    };

    // Aggregate data
    for (const exchange in this.columnTotals_AllPairs) {
      if (this.columnTotals_AllPairs.hasOwnProperty(exchange)) {
        const data = this.columnTotals_AllPairs[exchange];
        aggregatedData.Invested += parseFloat(data.TotalInvested.toFixed(2));
        aggregatedData.Seed += parseFloat(data.TotalSeedMoney.toFixed(2));
        aggregatedData.RetrievedSeedMoney += parseFloat(data.TotalRetrievedSeedMoney.toFixed(2));
        aggregatedData.Return += parseFloat(data.TotalExpectedReturn.toFixed(2));
        aggregatedData.ReturnPnl += parseFloat(data.TotalExpectedPnl.toFixed(2));
        aggregatedData.Current += parseFloat(((data.TotalCurrentValue)).toFixed(2))
        aggregatedData.UntilTargetValue += parseFloat((data.TotalCurrentValue - data.TotalExpectedReturn).toFixed(2))
        aggregatedData.UntilTargetPnl += parseFloat((data.TotalCurrentValue - data.TotalExpectedPnl).toFixed(2))

      }
    }


    const seedColor = aggregatedData.RetrievedSeedMoney > aggregatedData.Seed ? 'green' : 'red';

    // Define default colors
    const defaultColor = '#3498DB'; // Default color for bars

    // Prepare seriesData for aggregated data
    let seriesData = Object.keys(aggregatedData).map((key) => {
      const value = aggregatedData[key];
      let color;

      // Set color based on conditions
      if (key === 'Current') {
        const pnl = value - aggregatedData.Invested;
        color = pnl > 0 ? 'green' : 'red'; // Green for positive PNL, red for negative PNL
      } else if (key === 'Return') {
        const pnl = aggregatedData.Return - aggregatedData.Invested;
        color = pnl > 0 ? 'green' : 'red'; // Green for positive Return PNL, red for negative
      }
      else if (key === 'UntilTargetValue') { color = aggregatedData.UntilTargetValue < 0 ? 'red' : 'green' }

      else if (key === 'Seed') { color = aggregatedData.Seed > aggregatedData.RetrievedSeedMoney ? 'red' : 'green' }

      else {
        color = defaultColor; // Default color for other bars
      }

      return {
        name: key,
        y: value,
        color: color,
        fullName: key, // Store full name for use in tooltip
        Return: aggregatedData.Return,
        Invested: aggregatedData.Invested,
        Current: aggregatedData.Current,
        ReturnPnl: aggregatedData.ReturnPnl,
        Seed: aggregatedData.Seed,
        RetrievedSeedMoney: aggregatedData.RetrievedSeedMoney,
        UntilTargetValue: aggregatedData.UntilTargetValue,
        UntilTargetValuePercentage: ((aggregatedData.Current - aggregatedData.Return) / aggregatedData.Current) * 100,
        UntilTargetPnl: aggregatedData.UntilTargetPnl,
        UntilTargetPnlPercentage: ((aggregatedData.Current - (aggregatedData.Return - aggregatedData.Invested)) / aggregatedData.Current) * 100

      };
    });

    // Define which bars to display (for example, only 'Invested' and 'CurrentValue')
    const barsToShow = ['Invested', 'Current', 'Return', 'Seed']; // Specify the keys you want to show

    // Filter seriesData based on barsToShow
    seriesData = seriesData.filter(data => barsToShow.includes(data.name));

    // Calculate min and max values with additional space
    const minY = Math.min(...seriesData.map(d => d.y)) - 0;
    const maxY = Math.max(...seriesData.map(d => d.y)) + 1000;

    this.columnTotals_AllPairs_AIO_ChartOptions = {
      chart: {
        type: 'bar',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          depth: 35,
          viewDistance: 25
        }
      },
      plotOptions: {
        bar: {
          depth: 25,
          stacking: 'normal',
          dataLabels: {
            enabled: false  // Hide data labels inside bars
          }
        }
      },
      title: {
        text: '' // Title removed as per your code
      },
      xAxis: {
        categories: seriesData.map(data => data.name),
        title: {
          text: 'Account Info '
        },
        labels: {
          formatter: function () {
            const color = seriesData.find(d => d.name === this.value)?.color || '#000000'; // Default to black if no color found
            return `<span style="color: ${color}">${this.value}</span>`;
          },
          style: {
            fontSize: '12px' // Adjust font size
          }
        },
        tickWidth: 0, // Remove xAxis ticks
        gridLineWidth: 0 // Remove xAxis grid lines
      },
      yAxis: {
        min: minY,
        max: maxY,
        title: {
          text: 'Value (USDT)',
          margin: 20
        },
        stackLabels: {
          enabled: true,  // Enable stack labels
          style: {
            fontWeight: 'bold',
            color: 'black',
            textOutline: 'none'
          }
        },
        labels: {
          formatter: function() {
            return (this as any).value !== null ?  (this as any).value.toString() : '';
          }
        }
      },
      legend: {
        enabled: false // Disable legend
      },
      tooltip: {
        headerFormat: '',
        pointFormatter: function () {
          const point = this as any; // Use type assertion
          const { name } = point;

          let tooltipText = `<span style="color: ${point.color}">${point.fullName}</span>:`;

          // Conditional display of tooltip content based on 'name'


          if (name === 'Current') {
            // console.log("dsadas : ", point.Invested, point.Current)
            const pnl = point.Current - point.Invested;
            const pnl_percentage =
              ((point.Current - point.Invested) / point.Invested) * 100
            // -1 * (point.Current / point.Invested) * 100;
            // tooltipText += `<br>Current: ${point.y}`
            tooltipText += `<br>PNL: <span style="color:${pnl < 0 ? 'red' : 'green'}">${pnl.toFixed(2)} ( ${pnl_percentage.toFixed(2)}%)</span>`;
          }


          else if (name === 'Seed') {
            tooltipText += `<br>Seed: ${point.Seed.toFixed(2)}`;
            tooltipText += `<br>Retrieved: <span style="color : ${seedColor}">${point.RetrievedSeedMoney.toFixed(2)}</span>`;
            tooltipText += `<br>Remaining Seed: <span style="color : ${seedColor}">${(point.RetrievedSeedMoney < point.Seed) ? -(point.Seed - point.RetrievedSeedMoney).toFixed(2) : '0'}</span>`

            if (point.RetrievedSeedMoney > point.Seed) {
              tooltipText += `<br><span style="color:red">*[ All Seed Money Retrieved ]</span>`;
            }
          }

          else if (name === 'Return') {
            tooltipText += `<br>Value: ${point.Return.toFixed(2)} ( ${((((point.Return)) / (point.Invested)) * 100).toFixed(2)}%) `;
            // tooltipText += `<br>Value: ${point.Return.toFixed(2)}`;
            tooltipText += `<br>Until TP Value: <span style="color : ${point.UntilTargetValue > 0 ? 'green' : 'red'}">${point.UntilTargetValue.toFixed(2)} ( ${point.UntilTargetValuePercentage.toFixed(0)}% )</span><br>`;
            tooltipText += `<br>PNL: <span style="color:green">${(point.Return - point.Invested).toFixed(2)} ( ${((((point.Return - point.Invested)) / (point.Invested)) * 100).toFixed(2)}%)</span>`;



            tooltipText += `<br>Until TP PNL: <span style="color : ${point.UntilTargetPnl > 0 ? 'green' : 'red'}">${point.UntilTargetPnl.toFixed(2)} ( ${point.UntilTargetPnlPercentage.toFixed(0)}% )</span>`;


          }


          else if (name === 'Invested') {
            tooltipText += `<br>Invested: ${point.Invested.toFixed(2)}`;
          }


          else if (name === 'ReturnPnl') {
            tooltipText += `<br>Return PNL: ${point.ReturnPnl.toFixed(2)}`;
          }
          // else if (name === 'UntilTargetValue') {
          //   tooltipText += `<br>Value: <span style="color : ${point.y > 0 ? 'green' : 'red'}">${point.y.toFixed(2)} ( ${point.UntilTargetValuePercentage.toFixed(0)}% )</span>`;
          //   tooltipText += `<br>PNL: <span style="color : ${point.y > 0 ? 'green' : 'red'}">${point.UntilTargetPnl.toFixed(2)} ( ${point.UntilTargetPnlPercentage.toFixed(0)}% )</span>`;


          // }
          return tooltipText;
        }
      },
      series: [{
        type: 'bar',
        name: 'Total Value',
        data: seriesData
      }]
    };
  }









  render_columnTotals_AllPairs() {
    // Prepare the data for each influencer
    const allStats = Object.keys(this.columnTotals_AllPairs);

    // Define an array of colors for each data point
    const seriesColors = ['#3498DB', '#9B59B6', '#1ABC9C', '#f39c12', '#5dade2', '#1e8449'];

    let seriesData = allStats.map((data, index) => {
      const totalExpecteReturndPnl = parseFloat(this.columnTotals_AllPairs[data].TotalExpectedPnl.toFixed(2));
      const totalExpectedReturn = parseFloat(this.columnTotals_AllPairs[data].TotalExpectedReturn.toFixed(2));
      const totalCurrentValue = parseFloat((this.columnTotals_AllPairs[data].TotalCurrentValue).toFixed(2));
      const totalInvested = parseFloat((this.columnTotals_AllPairs[data].TotalInvested).toFixed(2));
      const color = seriesColors[index % seriesColors.length]; // Assign a color from the array

      return {
        name: data,
        y: totalExpecteReturndPnl,
        color: color,
        fullName: data, // Store full name for use in tooltip
        totalExpectedReturn: totalExpectedReturn,
        totalInvested: totalInvested,
        totalCurrentValue: totalCurrentValue,
        totalExpectedReturnPnl: totalExpecteReturndPnl
      };
    });

    // Sort seriesData by y value (totalPnl) in descending order
    seriesData = seriesData.sort((a, b) => a.y - b.y);

    // Update the categories to match the sorted order
    const sortedColumnData_AllPairs = seriesData.map(data => data.name);

    // Map each category to its corresponding color
    const categoryColors = seriesData.reduce((acc, point) => {
      const truncatedName = point.name.length > 10 ? point.name.substring(0, 9) + '...' : point.name;
      acc[truncatedName] = point.color;
      return acc;
    }, {} as { [key: string]: string });

    // Calculate min and max values with additional space
    const minY = Math.min(...seriesData.map(d => d.y)) - 0;
    const maxY = Math.max(...seriesData.map(d => d.y)) + 500; // Increased from 150 to 500 to add more space

    this.columnTotals_AllPairs_ChartOptions = {
      chart: {
        type: 'bar',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          depth: 35,
          viewDistance: 25
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: sortedColumnData_AllPairs.map(name => name.length > 10 ? name.substring(0, 9) + '...' : name),
        title: {
          text: 'Exchanges'
        },
        labels: {
          formatter: function() {
            const color = categoryColors[(this as any).value] || '#000000';
            return `<span style="color: ${color}">${(this as any).value}</span>`;
          },
          style: {
            fontSize: '12px'
          }
        },
        tickWidth: 0,
        gridLineWidth: 0
      },
      yAxis: {
        min: minY,
        max: maxY,
        title: {
          text: 'Total Return Value USDT',
          margin: 20
        },
        labels: {
          formatter: function() {
            return (this as any).value !== null ? (this as any).value.toString() : '';
          }
        }
      },
      plotOptions: {
        bar: {
          depth: 25,
          dataLabels: {
            enabled: true,
            formatter: function() {
              return '₮ ' + (this.y as number).toFixed(2);
            },
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'bold'
            }
          }
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormatter: function() {
          const point = this as any;
          const currentValueColor = point.totalCurrentValue < point.totalInvested ? '#fa4b42' : '#00e272';
          const currentProfitOrLoss = point.totalCurrentValue - point.totalInvested;
          const returnProfitLoss = point.totalExpectedReturn - point.totalInvested;
          const currentProfitLossPercentage = (((point.totalCurrentValue - point.totalInvested) / point.totalInvested) * 100).toFixed(2);
          const returnProfitLossPercentage = ((returnProfitLoss / point.totalInvested) * 100).toFixed(2);
          const untilTargetValue = (point.totalCurrentValue - point.totalInvested) - (point.totalExpectedReturnPnl);
          const percentageAchieved = ((((point.totalCurrentValue - point.totalInvested) - point.totalExpectedReturnPnl) / (point.totalInvested)) * 100).toFixed(2);

          return `<span style="color: ${point.color}">${point.fullName}</span>: <br>Invested: ${point.totalInvested.toFixed(2)}<br>CurrentValue: <span style="color: ${currentValueColor}">${point.totalCurrentValue.toFixed(3)} (${currentProfitOrLoss.toFixed(2)} | ${currentProfitLossPercentage}% )</span><br>Until Target: <span style="color: ${currentValueColor}">${untilTargetValue.toFixed(2)} (${percentageAchieved}%)</span><br>Return Value: <span style="color:#00e272">${point.totalExpectedReturn.toFixed(2)} (${returnProfitLoss.toFixed(2)} | ${returnProfitLossPercentage}%)</span>`;
        }
      },
      series: [{
        type: 'bar',
        name: 'Exchange Return Value (USDT)',
        data: seriesData.map(data => ({
          ...data,
          y: data.totalExpectedReturn // Use return value instead of PNL
        }))
      }]
    };
  }



  render_SpotTradesTotalCurrentValue_1() {
    // Extract column names and limit to first three
    const columns = Object.keys(this.columnTotals_AllPairs).slice(0, 3);

    // Define colors
    const seriesColors = ['#3498DB', '#9B59B6', '#1ABC9C']; // Add more colors as needed

    const tooltipColor = '#2980B9'; // Color for tooltip
    const dataLabelColor = 'black'; // Changed from white to black for data labels

    // Create a series for each key in columnTotals_AllPairs
    const series: Highcharts.SeriesColumnOptions[] = columns.map((key, index) => ({
      name: `${key}`, // Fixed name for the series
      type: 'column', // Type of series
      color: seriesColors[index % seriesColors.length], // Color for the series, cycling through defined colors
      data: [
        {
          name: `<span style="color:${seriesColors[index % seriesColors.length]}">${key}</span>`,
          y: parseFloat((this.columnTotals_AllPairs[key].TotalCurrentValue || 0).toFixed(3)), // Format value to 3 decimal points
          drilldown: 'TotalCurrentValue', // Drilldown id if needed
          color: seriesColors[index] // Color for the data point
        }
      ]
    }));

    // Render the chart
    this.chatOptions_SpotTotalCurrentValue_1 = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,   // Reduced from 10
          beta: -5,   // Reduced from -10
          depth: 35,  // Reduced from 70
          viewDistance: 25
        },
        spacingRight: 2, // Reduce right spacing
        spacingLeft: 2 // Reduce left spacing
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: columns, // Categories for xAxis
        title: {
          text: ''
        },
        labels: {
          formatter: function (): string {
            // Hide the label for the zero index
            return ''
          },
          style: {
            fontSize: '12px' // Adjust label font size if needed
          }
        },
        tickWidth: 0, // Remove xAxis ticks
        gridLineWidth: 0 // Remove xAxis grid lines
      },
      yAxis: {
        title: {
          margin: 20,
          text: 'Exchanges Current USDT Value'
        },
        plotLines: [{
          color: 'grey', // Line color
          value: 0, // Position of the line
          width: 2, // Width of the line
          dashStyle: 'ShortDash', // Style of the line
          label: {
            text: '', // Label text
            align: 'right',
            x: -10,
            style: {
              color: 'red'
            }
          }
        }]
      },
      legend: {
        enabled: true // Enable legend
      },
      plotOptions: {
        column: {
          depth: 25,  // Reduced from 50
          pointWidth: 50, // Adjust the width of the columns
          pointPadding: 0.1, // Reduce padding between columns
          groupPadding: 0.1, // Reduce padding between groups of columns
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              textOutline: 'none', // Remove shadow/outline
              color: dataLabelColor // Static white color for data labels
            }
          }
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormat: `<span style="color: ${tooltipColor}">{point.name}</span>: <b>{point.y:.3f}</b><br/>`, // Format tooltip with color and 3 decimal points
        backgroundColor: '#f0f0f0', // Optional: background color for the tooltip
        borderColor: tooltipColor // Optional: border color for the tooltip
      },
      series: series // Array of series
    };
  }



  render_SpotTradesTotalCurrentValue_2() {
    // Extract column names and limit to the remaining three
    const columns = Object.keys(this.columnTotals_AllPairs).slice(3, 6);

    // Define colors
    const seriesColors = ['#f39c12', '#5dade2', '#1e8449']; // Add more colors as needed


    const tooltipColor = '#2980B9'; // Color for tooltip
    const dataLabelColor = 'black'; // Changed from white to black for data labels

    // Create a series for each key in columnTotals_AllPairs
    const series: Highcharts.SeriesColumnOptions[] = columns.map((key, index) => ({
      name: `${key}`, // Fixed name for the series
      type: 'column', // Type of series
      color: seriesColors[(index + 3) % seriesColors.length], // Color for the series, cycling through defined colors
      data: [
        {
          name: `<span style="color:${seriesColors[(index + 3) % seriesColors.length]}">${key}</span>`,
          y: parseFloat((this.columnTotals_AllPairs[key].TotalCurrentValue || 0).toFixed(3)), // Format value to 3 decimal points
          drilldown: 'TotalCurrentValue', // Drilldown id if needed
          color: seriesColors[(index)] // Color for the data point
        }
      ]
    }));

    // Render the chart
    this.chatOptions_SpotTotalCurrentValue_2 = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,   // Reduced from 10
          beta: -5,   // Reduced from -10
          depth: 35,  // Reduced from 70
          viewDistance: 25
        },
        spacingRight: 2, // Reduce right spacing
        spacingLeft: 2 // Reduce left spacing
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: columns, // Categories for xAxis
        title: {
          text: ''
        },
        labels: {
          formatter: function (): string {
            // Hide the label for the zero index
            return ''
          },
          style: {
            fontSize: '12px' // Adjust label font size if needed
          }
        },
        tickWidth: 0, // Remove xAxis ticks
        gridLineWidth: 0 // Remove xAxis grid lines
      },
      yAxis: {
        title: {
          margin: 20,
          text: 'Exchanges Current USDT Value'
        },
        plotLines: [{
          color: 'grey', // Line color
          value: 0, // Position of the line
          width: 2, // Width of the line
          dashStyle: 'ShortDash', // Style of the line
          label: {
            text: '', // Label text
            align: 'right',
            x: -10,
            style: {
              color: 'red'
            }
          }
        }]
      },
      legend: {
        enabled: true // Enable legend
      },
      plotOptions: {
        column: {
          depth: 25,  // Reduced from 50
          pointWidth: 50, // Adjust the width of the columns
          pointPadding: 0.1, // Reduce padding between columns
          groupPadding: 0.1, // Reduce padding between groups of columns
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              textOutline: 'none', // Remove shadow/outline
              color: dataLabelColor // Static white color for data labels
            }
          }
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormat: `<span style="color: ${tooltipColor}">{point.name}</span>: <b>{point.y:.3f}</b><br/>`, // Format tooltip with color and 3 decimal points
        backgroundColor: '#f0f0f0', // Optional: background color for the tooltip
        borderColor: tooltipColor // Optional: border color for the tooltip
      },
      series: series // Array of series
    };
  }


  render_OpenOrdersTotalExpectedReturn_1() {
    // Extract column names and limit to first three
    const columns = Object.keys(this.columnTotals_AllPairs).slice(0, 3);

    // Define colors
    const seriesColors = ['#3498DB', '#9B59B6', '#1ABC9C']; // Add more colors as needed

    const tooltipColor = '#2980B9'; // Color for tooltip
    const dataLabelColor = 'black'; // Changed from white to black for data labels

    // Create a series for each key in columnTotals_AllPairs
    const series: Highcharts.SeriesColumnOptions[] = columns.map((key, index) => ({
      name: `${key}`, // Fixed name for the series
      type: 'column', // Type of series
      color: seriesColors[index % seriesColors.length], // Color for the series, cycling through defined colors
      data: [
        {
          name: `<span style="color:${seriesColors[index % seriesColors.length]}">${key}</span>`,
          y: parseFloat((this.columnTotals_AllPairs[key].TotalExpectedReturn || 0).toFixed(3)), // Format value to 3 decimal points
          drilldown: 'TotalExpectedReturn', // Drilldown id if needed
          color: seriesColors[index] // Color for the data point
        }
      ]
    }));

    // Render the chart
    this.OpenOrdersTotalExpectedReturn_1 = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,   // Reduced from 10
          beta: -5,   // Reduced from -10
          depth: 35,  // Reduced from 70
          viewDistance: 25
        },
        spacingRight: 2, // Reduce right spacing
        spacingLeft: 2 // Reduce left spacing
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: columns, // Categories for xAxis
        title: {
          text: ''
        },
        labels: {
          formatter: function (): string {
            // Hide the label for the zero index
            return ''
          },
          style: {
            fontSize: '12px' // Adjust label font size if needed
          }
        },
        tickWidth: 0, // Remove xAxis ticks
        gridLineWidth: 0 // Remove xAxis grid lines
      },
      yAxis: {
        title: {
          margin: 20,
          text: 'Exchanges Return USDT Value'
        },
        plotLines: [{
          color: 'grey', // Line color
          value: 0, // Position of the line
          width: 2, // Width of the line
          dashStyle: 'ShortDash', // Style of the line
          label: {
            text: '', // Label text
            align: 'right',
            x: -10,
            style: {
              color: 'red'
            }
          }
        }]
      },
      legend: {
        enabled: true // Enable legend
      },
      plotOptions: {
        column: {
          depth: 25,  // Reduced from 50
          pointWidth: 50, // Adjust the width of the columns
          pointPadding: 0.1, // Reduce padding between columns
          groupPadding: 0.1, // Reduce padding between groups of columns
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              textOutline: 'none', // Remove shadow/outline
              color: dataLabelColor // Static white color for data labels
            }
          }
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormat: `<span style="color: ${tooltipColor}">{point.name}</span>: <b>{point.y:.3f}</b><br/>`, // Format tooltip with color and 3 decimal points
        backgroundColor: '#f0f0f0', // Optional: background color for the tooltip
        borderColor: tooltipColor // Optional: border color for the tooltip
      },
      series: series // Array of series
    };
  }


  render_OpenOrdersTotalExpectedReturn_2() {
    // Extract column names and limit to the remaining three
    const columns = Object.keys(this.columnTotals_AllPairs).slice(3, 6);

    // Define colors
    const seriesColors = ['#f39c12', '#5dade2', '#1e8449']; // Add more colors as needed

    const tooltipColor = '#2980B9'; // Color for tooltip
    const dataLabelColor = 'black'; // Changed from white to black for data labels

    // Create a series for each key in columnTotals_AllPairs
    const series: Highcharts.SeriesColumnOptions[] = columns.map((key, index) => ({
      name: `${key}`, // Fixed name for the series
      type: 'column', // Type of series
      color: seriesColors[(index + 3) % seriesColors.length], // Color for the series, cycling through defined colors
      data: [
        {
          name: `<span style="color:${seriesColors[(index + 3) % seriesColors.length]}">${key}</span>`,
          y: parseFloat((this.columnTotals_AllPairs[key].TotalExpectedReturn || 0).toFixed(3)), // Format value to 3 decimal points
          drilldown: 'TotalExpectedReturn', // Drilldown id if needed
          color: seriesColors[(index)] // Color for the data point
        }
      ]
    }));

    // Render the chart
    this.OpenOrdersTotalExpectedReturn_2 = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,   // Reduced from 10
          beta: -5,   // Reduced from -10
          depth: 35,  // Reduced from 70
          viewDistance: 25
        },
        spacingRight: 2, // Reduce right spacing
        spacingLeft: 2 // Reduce left spacing
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: columns, // Categories for xAxis
        title: {
          text: ''
        },
        labels: {
          formatter: function (): string {
            // Hide the label for the zero index
            return ''
          },
          style: {
            fontSize: '12px' // Adjust label font size if needed
          }
        },
        tickWidth: 0, // Remove xAxis ticks
        gridLineWidth: 0 // Remove xAxis grid lines
      },
      yAxis: {
        title: {
          margin: 20,
          text: 'Exchanges Return USDT Value'
        },
        plotLines: [{
          color: 'grey', // Line color
          value: 0, // Position of the line
          width: 2, // Width of the line
          dashStyle: 'ShortDash', // Style of the line
          label: {
            text: '', // Label text
            align: 'right',
            x: -10,
            style: {
              color: 'red'
            }
          }
        }]
      },
      legend: {
        enabled: true // Enable legend
      },
      plotOptions: {
        column: {
          depth: 25,  // Reduced from 50
          pointWidth: 50, // Adjust the width of the columns
          pointPadding: 0.1, // Reduce padding between columns
          groupPadding: 0.1, // Reduce padding between groups of columns
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              textOutline: 'none', // Remove shadow/outline
              color: dataLabelColor // Static white color for data labels
            }
          }
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormat: `<span style="color: ${tooltipColor}">{point.name}</span>: <b>{point.y:.3f}</b><br/>`, // Format tooltip with color and 3 decimal points
        backgroundColor: '#f0f0f0', // Optional: background color for the tooltip
        borderColor: tooltipColor // Optional: border color for the tooltip
      },
      series: series // Array of series
    };
  }

  //#endregion


  //#region chart for combine OpenOrders details

  // Render pie chart for selected exchanges
  render_CombinedOpenOrdersPairChart() {
    const combinedData = this.aggregateOpenOrdersDataForSelectedExchanges();


    // Prepare the pie data
    const pieData = Object.keys(combinedData).map(pair => {
      return [
        pair,
        combinedData[pair].TotalOpenOrders // Pie slice value
      ];
    });

    // Count unique pairs
    const selectedPairsCount = Object.keys(combinedData).length;


    // Construct the title


    const title = `
Unique Pairs: ${selectedPairsCount} 
 
  `;

    // Update chart options
    this.chartOptions_CombinedOpenOrders = {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 25,  // Reduced from 35
          beta: 0,
          depth: 20,  // Reduced from 25
          viewDistance: 25
        }
      },
      title: {
        text: title,
        align: 'center'
      },
      tooltip: {
        formatter: function () {
          const pairData = combinedData[this.point.name];
          return `
          <b>${this.point.name}</b><br/>
          Invested: ${pairData.TotalInvested}<br/>
          Open Orders: ${pairData.TotalOpenOrders}<br/>
          Filled Orders: ${pairData.TotalFilledOrders}<br/>
          UnFilled Orders: ${pairData.TotalUnFilledOrders}<br/>
          Placed Orders: ${pairData.TotalPlacedOrders}<br/>
          UnPlaced Orders: ${pairData.TotalUnPlacedOrders}<br/>
          Expected Return: ${pairData.TotalExpectedReturn}<br/>
          Expected PnL: ${pairData.TotalExpectedPnl}<br/><br/>
          Exchanges: ${pairData.Exchanges.join(', ')}
        `;
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          innerSize: '50%', // This makes it a donut chart
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}'
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Expected PnL',
          data: pieData
        }
      ]
    };
  }



  //#endregion

  //#region  chart for OpenOrders detais
  render_TradingOpenOrderPairCharts() {
    Object.keys(this.columnTotal_OpenOrders_PNL_ForEachPair).forEach(exchange => {
      const pairs = this.columnTotal_OpenOrders_PNL_ForEachPair[exchange];

      const exchangePairsCount = Object.keys(this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]).length;


      const pieData = Object.keys(pairs).map(pair => {
        const data = pairs[pair];
        return [
          pair,
          data.TotalOpenOrders // Pie slice value
        ];
      });

      this.chartOptions[exchange] = {
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0,
            depth: 35,
            viewDistance: 25
          }
        },
        plotOptions: {
          pie: {
            depth: 35,
            allowPointSelect: true,
            cursor: 'pointer',
            innerSize: '50%',
            dataLabels: {
              enabled: true,
              formatter: function () {
                const pairData = pairs[this.point.name];
                return `${this.point.name}: ${pairData.TotalOpenOrders}`;
              }
            }
          }
        },
        title: {
          // text: `${exchange} : ${exchangePairsCount}`,
          text:'Open Orders',
          align: 'center',
          
        },
        tooltip: {
          formatter: function () {
            const pairData = pairs[this.point.name];
            return `
              <b>${this.point.name}</b><br/>
              Invested: ${pairData.TotalInvested}<br/>
              Open Orders: ${pairData.TotalOpenOrders}<br/>
              Filled Orders: ${pairData.TotalFilledOrders}<br/>
              UnFilled Orders: ${pairData.TotalUnFilledOrders}<br/>
              Placed Orders: ${pairData.TotalPlacedOrders}<br/>
              UnPlaced Orders: ${pairData.TotalUnPlacedOrders}<br/>
              Expected Return: ${pairData.TotalExpectedReturn}<br/>
              Expected PnL: ${pairData.TotalExpectedPnl}<br/>
            `;
          }
        },
        series: [
          {
            type: 'pie',
            name: 'Expected PnL',
            data: pieData
          }
        ]
      };
    });
  }
  //#endregion









  showExchangeDetails(exchange: string, event: MouseEvent): void {
    event.stopPropagation();
    
    this.dialog.open(ExchangeDetailsModalComponent, {
      data: {
        exchange: exchange,
        exchangeData: this.columnTotals_AllPairs[exchange]
      },
      panelClass: 'exchange-details-modal'
    });
  }

  // Portfolio Distribution Pie Chart
  portfolioDistributionPieChart: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 25,
        beta: 0,
        depth: 20,
        viewDistance: 25
      }
    },
    title: {
      text: 'Expected Return PNL by Exchange'
    },
    tooltip: {
      pointFormatter: function() {
        const point = this as any;
        const returnProfitLoss = point.totalReturn - point.totalInvested;
        const returnProfitLossPercentage = ((returnProfitLoss / point.totalInvested) * 100).toFixed(2);
        return `<span style="color:${point.color}">${point.name}</span><br/>` +
               `Expected PNL: <b>₮ ${point.y.toFixed(2)}</b><br/>` +
               `Invested: ₮ ${point.totalInvested.toFixed(2)}<br/>` +
               `Return Value: ₮ ${point.totalReturn.toFixed(2)} (${returnProfitLossPercentage}%)`;
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
        depth: 20,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: ₮{point.y:,.2f}'
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Expected PNL',
      colorByPoint: true,
      data: []
    } as Highcharts.SeriesPieOptions]
  };

  // Seed Money Return Chart
  seedMoneyReturnChart: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 5,
        beta: 5,
            depth: 35,
        viewDistance: 25
      }
    },
    title: {
      text: 'Seed Money vs Retrieved'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'Amount (USDT)'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'black',
          textOutline: 'none'
        }
      }
    },
    plotOptions: {
      column: {
        depth: 25,
        stacking: undefined,
            dataLabels: {
              enabled: true,
          inside: false,
          style: {
            fontWeight: 'bold',
            color: 'black',
            textOutline: 'none'
          },
          formatter: function() {
            const point = this.point as any;
            return point.y.toFixed(2);
              }
            }
          }
        },
    tooltip: {
      pointFormatter: function() {
        return `${this.series.name}: <b>${(this.y as number).toFixed(2)}</b>`;
      }
    },
    series: [{
      type: 'column',
      name: 'Seed Money',
      color: '#3498DB',
      data: []
    }, {
      type: 'column',
      name: 'Retrieved',
      data: []
    }] as Array<Highcharts.SeriesColumnOptions>
  };

  // Risk-Reward Ratio Chart
  riskRewardRatioChart: Highcharts.Options = {
    chart: {
      type: 'scatter',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 8,  // Reduced from 15
        beta: 8,   // Reduced from 15
        depth: 50, // Reduced from 70
        viewDistance: 25,
        frame: {
          bottom: { size: 1, color: 'rgba(0,0,0,0.05)' },
          back: { size: 1, color: 'rgba(0,0,0,0.05)' }
        }
      }
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 5
        }
      }
    },
    title: {
      text: 'Risk vs Reward Analysis'
    },
    xAxis: {
      title: {
        text: 'Risk (Invested Amount)'
      }
    },
    yAxis: {
      title: {
        text: 'Reward (Expected Return)'
      }
    },
    series: [{
      type: 'scatter',
      name: 'Exchanges',
      data: [],  // Initialize empty, will be updated in ngOnInit
      tooltip: {
        pointFormat: '{point.name}: Risk: {point.x}, Reward: {point.y}'
      }
    }] as Array<Highcharts.SeriesScatterOptions>
  };

  // Profitability Trend Chart
  profitabilityTrendChart: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Profitability Trend'
    },
    xAxis: {
      categories: []  // Initialize empty, will be updated in ngOnInit
    },
    yAxis: {
      title: {
        text: 'Profitability (%)'
      }
    },
    series: [{
      type: 'line',
      name: 'Current P/L %',
      data: []  // Initialize empty, will be updated in ngOnInit
    }] as Array<Highcharts.SeriesLineOptions>
  };

  // Helper methods for chart data
  private getPortfolioDistributionData(): Array<{ name: string; y: number }> {
    return this.exchangeNames.map(exchange => ({
      name: exchange,
      y: this.columnTotals_AllPairs[exchange]?.TotalExpectedPnl || 0,
      totalInvested: this.columnTotals_AllPairs[exchange]?.TotalInvested || 0,
      totalReturn: this.columnTotals_AllPairs[exchange]?.TotalExpectedReturn || 0
    }));
  }

  private getSeedMoneyData(): number[] {
    return this.exchangeNames.map(exchange => 
      this.columnTotals_AllPairs[exchange]?.TotalSeedMoney || 0
    );
  }

  private getRetrievedMoneyData(): Array<{ y: number; color: string }> {
    return this.exchangeNames.map(exchange => {
      const seedMoney = this.columnTotals_AllPairs[exchange]?.TotalSeedMoney || 0;
      const retrievedMoney = this.columnTotals_AllPairs[exchange]?.TotalRetrievedSeedMoney || 0;
      return {
        y: retrievedMoney,
        color: retrievedMoney < seedMoney ? '#fa4b42' : '#00e272' // red if less than seed, green if more
      };
    });
  }

  private getRiskRewardData(): Array<{ name: string; x: number; y: number }> {
    return this.exchangeNames.map(exchange => ({
      name: exchange,
      x: this.columnTotals_AllPairs[exchange]?.TotalInvested || 0,
      y: this.columnTotals_AllPairs[exchange]?.TotalExpectedReturn || 0
    }));
  }

  private getProfitabilityData(): number[] {
    return this.exchangeNames.map(exchange => {
      const invested = this.columnTotals_AllPairs[exchange]?.TotalInvested || 0;
      const current = this.columnTotals_AllPairs[exchange]?.TotalCurrentValue || 0;
      return invested ? ((current - invested) / invested) * 100 : 0;
    });
  }

  // Add new method to update chart data
  private updateChartData(): void {
    // Update Portfolio Distribution Chart
    (this.portfolioDistributionPieChart.series![0] as any).data = this.getPortfolioDistributionData();

    // Update Seed Money Return Chart
    ((this.seedMoneyReturnChart.xAxis as Highcharts.XAxisOptions).categories) = this.exchangeNames;
    (this.seedMoneyReturnChart.series![0] as any).data = this.getSeedMoneyData();
    (this.seedMoneyReturnChart.series![1] as any).data = this.getRetrievedMoneyData();

    // Update Risk-Reward Ratio Chart
    (this.riskRewardRatioChart.series![0] as any).data = this.getRiskRewardData();

    // Update Profitability Trend Chart
    ((this.profitabilityTrendChart.xAxis as Highcharts.XAxisOptions).categories) = this.exchangeNames;
    (this.profitabilityTrendChart.series![0] as any).data = this.getProfitabilityData();
  }

  // Trading Volume Distribution Chart
  tradingVolumeChart: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 25,  // Reduced from 45
        beta: 0,
        depth: 20,  // Reduced from 35
        viewDistance: 25
      }
    },
    plotOptions: {
      pie: {
        depth: 20,  // Reduced from 35
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    title: {
      text: 'Trading Volume Distribution'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    series: [{
      type: 'pie',
      name: 'Volume Share',
      colorByPoint: true,
      data: []
    } as Highcharts.SeriesPieOptions]
  };

  // Returns Comparison Chart
  returnsComparisonChart: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 5,
        beta: 5,
        depth: 35,
        viewDistance: 25
      }
    },
    plotOptions: {
      column: {
        depth: 25,
        stacking: undefined,
        dataLabels: {
          enabled: true,
          inside: false,
          style: {
            fontWeight: 'bold',
            color: 'black',
            textOutline: 'none'
          },
          formatter: function() {
            const point = this.point as any;
            return point.y.toFixed(2);
          }
        }
      }
    },
    title: {
      text: 'Expected vs Current Returns'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'Returns (USDT)'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'black',
          textOutline: 'none'
        }
      }
    },
    tooltip: {
      pointFormatter: function() {
        return `${this.series.name}: <b>${(this.y as number).toFixed(2)}</b>`;
      }
    },
    series: [{
      type: 'column',
      name: 'Expected Returns',
      data: []
    }, {
      type: 'column',
      name: 'Current Returns',
      data: []
    }] as Array<Highcharts.SeriesColumnOptions>
  };

  // Helper methods for new charts
  private getTradingVolumeData(): Array<{ name: string; y: number }> {
    return this.exchangeNames.map(exchange => ({
      name: exchange,
      y: this.columnTotals_AllPairs[exchange].TotalInvested || 0
    }));
  }

  private getReturnsComparisonData(): { expected: number[]; current: number[] } {
    const expected = this.exchangeNames.map(exchange => 
        this.columnTotals_AllPairs[exchange].TotalExpectedReturn || 0
    );
    const current = this.exchangeNames.map(exchange => 
        this.columnTotals_AllPairs[exchange].TotalCurrentValue || 0
    );

    // Calculate max value and add padding
    const maxValue = Math.max(...expected, ...current);
    const padding = maxValue * 0.2; // Add 20% padding

    // Update chart yAxis max
    if (this.returnsComparisonChart.yAxis) {
      (this.returnsComparisonChart.yAxis as Highcharts.YAxisOptions).max = maxValue + padding;
    }

    return { expected, current };
  }

  // Update method for new charts
  private updatePerformanceCharts(): void {
    // Update Trading Volume Chart
    this.tradingVolumeChart.series = [{
      type: 'pie',
      name: 'Volume Share',
      colorByPoint: true,
      data: this.getTradingVolumeData()
    } as Highcharts.SeriesPieOptions];

    // Update Returns Comparison Chart
    const returnsData = this.getReturnsComparisonData();
    this.returnsComparisonChart.xAxis = {
      categories: this.exchangeNames
    };
    this.returnsComparisonChart.series = [{
      type: 'column',
      name: 'Expected Returns',
      data: returnsData.expected
    }, {
      type: 'column',
      name: 'Current Returns',
      data: returnsData.current
    }] as Array<Highcharts.SeriesColumnOptions>;
  }

  // Exchange statistics methods
  getTotalOpenOrders(exchange: string): number {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) {
      return (Object.values(this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) as OpenOrderPairData[])
        .reduce((sum: number, item: OpenOrderPairData) => sum + (item.TotalOpenOrders || 0), 0);
    }
    return 0;
  }

  getTotalFilledOrders(exchange: string): number {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) {
      return (Object.values(this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) as OpenOrderPairData[])
        .reduce((sum: number, item: OpenOrderPairData) => sum + (item.TotalFilledOrders || 0), 0);
    }
    return 0;
  }

  getTotalUnfilledOrders(exchange: string): number {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) {
      return (Object.values(this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) as OpenOrderPairData[])
        .reduce((sum: number, item: OpenOrderPairData) => sum + (item.TotalUnFilledOrders || 0), 0);
    }
    return 0;
  }

  getTotalExpectedReturn(exchange: string): number {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) {
      return (Object.values(this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) as OpenOrderPairData[])
        .reduce((sum: number, item: OpenOrderPairData) => sum + (item.TotalExpectedReturn || 0), 0);
    }
    return 0;
  }

  getTotalExpectedPNL(exchange: string): number {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) {
      return (Object.values(this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) as OpenOrderPairData[])
        .reduce((sum: number, item: OpenOrderPairData) => sum + (item.TotalExpectedPnl || 0), 0);
    }
    return 0;
  }

  // Pair-specific methods
  getPairInvested(exchange: string, pair: string): number {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]?.[pair]) {
      return this.columnTotal_OpenOrders_PNL_ForEachPair[exchange][pair].TotalInvested || 0;
    }
    return 0;
  }

  getPairOpenOrders(exchange: string, pair: string): number {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]?.[pair]) {
      return this.columnTotal_OpenOrders_PNL_ForEachPair[exchange][pair].TotalOpenOrders || 0;
    }
    return 0;
  }

  getPairFilledOrders(exchange: string, pair: string): number {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]?.[pair]) {
      return this.columnTotal_OpenOrders_PNL_ForEachPair[exchange][pair].TotalFilledOrders || 0;
    }
    return 0;
  }

  getPairUnfilledOrders(exchange: string, pair: string): number {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]?.[pair]) {
      return this.columnTotal_OpenOrders_PNL_ForEachPair[exchange][pair].TotalUnFilledOrders || 0;
    }
    return 0;
  }

  getPairExpectedReturn(exchange: string, pair: string): number {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]?.[pair]) {
      return this.columnTotal_OpenOrders_PNL_ForEachPair[exchange][pair].TotalExpectedReturn || 0;
    }
    return 0;
  }

  getPairExpectedPNL(exchange: string, pair: string): number {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]?.[pair]) {
      return this.columnTotal_OpenOrders_PNL_ForEachPair[exchange][pair].TotalExpectedPnl || 0;
    }
    return 0;
  }

  getExchangePairs(exchange: string): string[] {
    if (this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]) {
      return Object.keys(this.columnTotal_OpenOrders_PNL_ForEachPair[exchange]);
    }
    return [];
  }
}