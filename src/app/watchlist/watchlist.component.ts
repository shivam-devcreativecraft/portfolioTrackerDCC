import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { FunctionsService } from '../SharedFunctions/functions.service';
import { MatDialog } from '@angular/material/dialog';
import { ChartAnalysisComponent } from '../SharedComponents/PortfolioSheetsComponents/chart-analysis/chart-analysis.component';
import { BinanceAPIService } from '../services/WorkingExchangeAPI/binanceAPI.service';
import { BybitAPIService } from '../services/WorkingExchangeAPI/bybitAPI.service';
import { MexcAPIService } from '../services/WorkingExchangeAPI/mexcAPI.service';
import { KucoinAPIService } from '../services/WorkingExchangeAPI/kucoinAPI.service';
import { GateioAPIService } from '../services/WorkingExchangeAPI/gateioAPI.service';
import { VideoDialogComponent } from '../SharedComponents/PortfolioSheetsComponents/video-dialog/video-dialog.component';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../SharedComponents/confirm-dialog/confirm-dialog.component';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<void> = new Subject<void>();
  // sheetData: any = {};
  sheetData: { [key: string]: any[] } = {};

  sheetDataKeys: string[] = [];
  symbols: { symbol: string, id: string }[] = [];
  IsSelectedSheetDataLoaded: boolean = false;

  constructor(public functionsServiceRef: FunctionsService, private cdr: ChangeDetectorRef,
    private _dialog: MatDialog,
    private binanceAPIService: BinanceAPIService,
    private bybitAPIService: BybitAPIService,
    private mexcAPIService: MexcAPIService,
    private kucoinAPIServiceRef: KucoinAPIService,
    private gateioAPIServiceRef: GateioAPIService,
    private http: HttpClient


  ) { }

  ngOnInit(): void {
    this.functionsServiceRef.loadSheetData_AllSheets('Watchlist', this, this.componentDestroyed$)
      .then((sheetData) => {
        if (sheetData) {
          // this.sheetData = sheetData;
          this.sheetDataKeys = Object.keys(this.sheetData);

          this.symbols = this.sheetDataKeys.flatMap(key => this.sheetData[key].map((data, index) => ({ symbol: data.Available_Exchanges[0] + ':' + data.Market + 'USDT', id: key + '-' + index })));
          // console.log(this.symbols)
          this.IsSelectedSheetDataLoaded = true;
          // console.log(this.sheetData)
          // this.initSymbols();
          this.cdr.detectChanges(); // Manually trigger change detection
          // this.renderCharts();
          this.setCurrentPrice();
        }
      })
  }



  renderCharts() {
    this.symbols.forEach((symbolData: any) => {
      this.renderSymbolOverview(symbolData.symbol, symbolData.id);
    });
  }

  renderSymbolOverview(symbol: string[], id: string) {
    // console.log(symbol)
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbols: [[symbol + '|1D']],
      chartOnly: false,
      width: '100%',
      height: '100%',
      locale: "in",
      colorTheme: "light",
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      maLineColor: "#2962FF",
      maLineWidth: 1,
      maLength: 9,
      lineWidth: 2,
      lineType: 0,
      dateRanges: [
        "1d|30",
        "1w|1D",
        "1m|1W",
        "3m|1M",
        "6m|1M",
        "12m|3M",
        "all|1M"
      ]
    });

    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';

    const divId = 'symbolOverview-' + id;
    const div = document.getElementById(divId);
    if (div) {
      div.appendChild(script);
    }
  }

  onOpenChartAnalysisDialog(TradingPair: any, ExchangeName: string) {
    const dialogRef = this._dialog.open(ChartAnalysisComponent, {
      data: { exchangeName: (ExchangeName).toUpperCase(), tradingPair: TradingPair, location: 'Watchlist' },
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


  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
    this.webSocketRefs.forEach((webSocketRef) => {
      webSocketRef.close();
    });
  }


  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isCollapsed: { [key: string]: boolean } = {};

  toggleHeight(key: string): void {
    this.isCollapsed[key] = !this.isCollapsed[key];
  }

  // ------------------------new price api,  websockets, estimation -----------------

  setCurrentPrice(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      let tempSheetData: any = this.sheetData;
      let tradingPairs: { Market: string, Exchange: string }[] = [];

      Object.keys(tempSheetData).forEach((key: string) => {
        tempSheetData[key].forEach((item: any) => {
          tradingPairs.push({ Market: item.Market, Exchange: item.Available_Exchanges[0] });
        });
      });

      tradingPairs = tradingPairs.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.Market === value.Market && t.Exchange === value.Exchange
        ))
      );


      // console.log(tradingPairs);



      const tradingPairData: {
        TradingPair: string;
        // AverageBuyPrice: number;
        CurrentStaticPrice: any;
      }[] = [];

      const priceRequests = tradingPairs.map((pair) => {
        switch (pair.Exchange.toUpperCase()) {
          case 'BINANCE':
            return this.binanceAPIService.getPrice(pair.Market).toPromise();
          case 'BYBIT':
            return this.bybitAPIService.getPriceBybit(pair.Market).toPromise();
          case 'MEXC':
            return this.mexcAPIService.getPriceMexc(pair.Market).toPromise();
          case 'KUCOIN':
            return this.kucoinAPIServiceRef.getPriceKucoin(pair.Market + '-USDT').toPromise();
          case 'GATEIO':
            return this.gateioAPIServiceRef.getPriceGate(pair.Market + '_USDT').toPromise();
          default:
            return Promise.reject('Unsupported exchange');
        }
      });
      Promise.all(priceRequests)
        .then((responses: any[]) => {
          for (let i = 0; i < tradingPairs.length; i++) {
            const pair = tradingPairs[i];
            const market = pair.Market;
            const exchange = pair.Exchange.toUpperCase();
            let currentPrice = 0;

            switch (exchange) {
              case 'BINANCE':
                currentPrice = parseFloat(responses[i].price) || 0;
                break;
              case 'BYBIT':
                currentPrice = parseFloat(responses[i].result.list[0].lastPrice) || 0;
                break;
              case 'MEXC':
                currentPrice = parseFloat(responses[i].priceInfo.find((p: any) => p.symbol === market + 'USDT')?.price) || 0;
                break;
              case 'KUCOIN':
                currentPrice = parseFloat(responses[i].data.price) || 0;
                break;
              case 'GATEIO':
                currentPrice = parseFloat(responses[i][0].last) || 0;
                break;
            }

            tradingPairData.push({
              TradingPair: market,

              // AverageBuyPrice: marketData?.FINAL_DATA?.AvgPrice || 0,

              CurrentStaticPrice: currentPrice,

            });
          }

          tradingPairData.forEach(pairData => {
            Object.keys(tempSheetData).forEach((key: string) => {
              tempSheetData[key].forEach((item: any) => {
                if (item.Market === pairData.TradingPair) {
                  item.CurrentStaticPrice = pairData.CurrentStaticPrice;
                }
              });
            });
          });


          resolve();
        })
        .catch((error) => {
          console.error('Error fetching prices:', error);
          reject(error);
        });
    }).finally(() => {
      // This will run regardless of resolve or reject
      this.getWsDataBasedOnUrl();
    });
  }


  get until_Target() {


    return (currentStaticPrice: number, targetPrice: number): number => {
      return ((targetPrice - currentStaticPrice) / currentStaticPrice) * -100;
    };
  }

  getPnlPortfolioPercentage(markPriceStr: any, currentStaticPriceStr: any, portfolioPercentageStr: any): number {
    // Convert strings to numbers


    const markPrice = parseFloat(markPriceStr);
    const currentStaticPrice = parseFloat(currentStaticPriceStr);
    const portfolioPercentage = parseFloat(portfolioPercentageStr);

    // Calculate total invested amount at Mark_Price
    const totalInvestedAmount = 100 / portfolioPercentage;

    // Calculate total invested amount at CurrentStaticPrice
    const currentInvestedAmount = totalInvestedAmount * (currentStaticPrice / markPrice);

    // Calculate pnl_Portfolio_Percentage
    const pnlPortfolioPercentage = ((currentInvestedAmount - totalInvestedAmount) / totalInvestedAmount) * 100;


    return pnlPortfolioPercentage;
  }
  getPercentageIncrease(markPriceStr: any, currentStaticPriceStr: any): number {
    // Convert strings to numbers
    const markPrice = parseFloat(markPriceStr);
    const currentStaticPrice = parseFloat(currentStaticPriceStr);

    // Calculate percentage increase
    const percentageIncrease = ((currentStaticPrice - markPrice) / markPrice) * 100;

    return percentageIncrease;
  }

  // ---------------------------------web socket code ---------------



  private webSocketRefs: WebSocket[] = [];

  // WSData: any[] = []; // Declare WSData as a global property

  // prevPrice: number = 0;
  // currentPrice: number = 0;

  // // Define a map to store prices for each trading pair
  // priceMap: Map<string, { currentPrice: number; prevPrice: number }> = new Map();

  getWsDataBasedOnUrl() {
    // Close any existing WebSocket connections
    this.webSocketRefs.forEach((webSocketRef) => {
      webSocketRef.close();
    });
    this.webSocketRefs = [];

    // Iterate through the sheetData to get trading pairs and set up WebSocket connections
    Object.keys(this.sheetData).forEach((key: string) => {
      this.sheetData[key].forEach((item: any) => {
        const exchange = item.Available_Exchanges[0].toUpperCase();
        const market = item.Market;
        let url: string = '';
        let wsParams: any = null;

        switch (exchange) {
          case 'BINANCE':
            url = `wss://stream.binance.com:9443/ws/${market.toLowerCase()}usdt@aggTrade`;
            break;
          case 'BYBIT':
            url = `wss://stream.bybit.com/v5/public/spot`;
            wsParams = {
              op: 'subscribe',
              args: [`tickers.${market}USDT`],
            };
            break;
          case 'MEXC':
            url = `wss://wbs.mexc.com/ws?topic=spot@public@trade@${market}USDT`;
            break;
          case 'KUCOIN':
            this.kucoinAPIServiceRef.getKucoinWSAccessToken().subscribe((res: any) => {
              if (res) {
                url = `wss://ws-api-spot.kucoin.com/?token=${res.accessToken}`;
              }
            });
            break;
          case 'GATEIO':
            break;
          default:
            console.error(`Unsupported exchange: ${exchange}`);
            return;
        }

        if (url) {
          const webSocketRef = new WebSocket(url);

          webSocketRef.onopen = () => {
            if (wsParams && exchange === 'BYBIT') {
              webSocketRef.send(JSON.stringify(wsParams));
            }
          };

          webSocketRef.onmessage = (event) => {
            let currentPrice = 0;
            const message = JSON.parse(event.data);


            switch (exchange) {
              case 'BINANCE':
                currentPrice = parseFloat(message.p);
                break;
              case 'BYBIT':
                if (message.topic === `tickers.${market}USDT`) {
                  currentPrice = parseFloat(message.data.lastPrice);
                }
                break;
              case 'MEXC':
                currentPrice = parseFloat(message.data.price);
                break;
              case 'KUCOIN':

                if (message.topic === `/market/ticker:${market}-USDT`) {
                  currentPrice = parseFloat(message.data.price);
                }
                break;
            }

            // Update CurrentStaticPrice in the sheetData
            this.sheetData[key].forEach((sheetItem: any) => {
              if (sheetItem.Market === market) {
                sheetItem.CurrentStaticPrice = currentPrice;
              }
            });

            this.cdr.detectChanges();
          };

          webSocketRef.onerror = (event) => {
            console.error(`WebSocket error for ${market}:`, event);
          };

          this.webSocketRefs.push(webSocketRef);
        }
      });
    });
  }



  //#region search, sorting and filter
  // ------------------search and sorting  -----------


  show_advance_options: boolean = false;



  OnShowAdvanceOptions() {
    this.show_advance_options = !this.show_advance_options
  }



  searchTermMarket: string = '';
  searchTermInfluencer: string = '';

  toggleSort(key: string) {
    if (this.sortingKey === key) {
      this.sortingOrder = this.sortingOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortingKey = key;
      this.sortingOrder = 'asc'; // Default to ascending order when changing keys
    }
    this.cdr.detectChanges();
  }


  setDefaultOptions() {
    // this.searchTermMarket = ''
    this.sortingKey = 'until_target'
    this.sortingOrder = 'desc'
  }

  isDefaultOption(): boolean {

    // if (this.filterOption != 'Holding' || this.searchTermMarket != '' || this.showLessCoinsFlag || this.selectedSortDirection != 'winners')
    if (this.sortingKey != 'until_target' || this.sortingOrder != 'desc')


      return true;
    else return false;
  }



  sortingKey: string = 'until_target';
  sortingOrder: string = 'desc'; // Default sorting order is descending

  get filterData() {
    let filteredData: { [key: string]: any[] } = {};

    if (!this.searchTermMarket.trim() && !this.searchTermInfluencer.trim()) {
      // If search terms are empty, use all data
      filteredData = this.sheetData;
    } else {
      // Filter data based on the 'Market' and 'Influencer' keys
      Object.keys(this.sheetData).forEach((key: string) => {
        filteredData[key] = this.sheetData[key].filter((item) =>
          item.Market.toLowerCase().includes(this.searchTermMarket.trim().toLowerCase()) &&
          item.Influencer?.toLowerCase().includes(this.searchTermInfluencer.trim().toLowerCase())
        );
      });
    }

    // Sort the data based on the sortingKey and sortingOrder
    if (this.sortingKey) {
      Object.keys(filteredData).forEach((key: string) => {
        filteredData[key].sort((a, b) => {
          switch (this.sortingKey) {
            case 'Date':
              return (this.sortingOrder === 'asc' ? 1 : -1) * (new Date(a.Date).getTime() - new Date(b.Date).getTime());
            case 'Market':
              return (this.sortingOrder === 'asc' ? 1 : -1) * a.Market.localeCompare(b.Market);
            case 'until_target':
              return (this.sortingOrder === 'asc' ? 1 : -1) * (this.until_Target(a.CurrentStaticPrice, a.Target_Price) - this.until_Target(b.CurrentStaticPrice, b.Target_Price));
            default:
              return 0;
          }
        });
      });
    }

    return filteredData;
  }

  //#endregion
  openVideoDialog(videoUrl: string): void {
    const isShort = videoUrl.includes('/shorts');
    if (isShort) {


      const message = `Video is shorts video,\nopen in youtube ?`;

      const dialogData = new ConfirmDialogModel('Confirm Leaving Drkdr', message);

      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: dialogData,
      });

      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult === true) {
          window.open(videoUrl, '_blank');
        }
      })

    } else {
      const videoId = this.extractVideoId(videoUrl);
      this.getVideoDetails(videoId).subscribe((details: any) => {
        this._dialog.open(VideoDialogComponent, {
          data: {
            videoUrl: this.sanitizeUrl(videoUrl),
            videoTitle: details.title,
            videoDescription: details.description,
            channelTitle: details.channelTitle
          },
          disableClose: false,
        });
      });
    }
  }

  private sanitizeUrl(url: string): string {
    return `https://www.youtube.com/embed/${this.extractVideoId(url)}`;
  }

  private extractVideoId(url: string): string {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? videoIdMatch[1] : '';
  }

  private apiKey= environment.GOOGLE_CLOUD_API_KEY_YOUTUBE_VIDEO_INFO;

  private getVideoDetails(videoId: string): Observable<any> {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${this.apiKey}&part=snippet`;
    return this.http.get(apiUrl).pipe(
      map((response: any) => {
        const snippet = response.items[0].snippet;
        return {
          title: snippet.title,
          description: snippet.description,
          channelTitle: snippet.channelTitle
        };
      })
    );
  }



}
