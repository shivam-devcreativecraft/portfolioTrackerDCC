import { AfterViewInit, Component } from '@angular/core';
import { GoogleSheetApiService } from '../services/google-sheet-api.service';
declare const TradingView: any;

@Component({
  selector: 'app-tradingview',
  templateUrl: './tradingview.component.html',
  styleUrls: ['./tradingview.component.scss']
})
export class TradingviewComponent implements AfterViewInit {
  constructor() {

  }
  ngAfterViewInit(): void {
    this.showTickerTapeWidget()

    this.showChart()
    this.renderTechnicalAnalysis()
    this.renderMarketOverview()
    // Call this function when you want to show the symbol overview widget
    this.showSymbolOverview();
    this.showScreenerWidget();
    this.showHeatmapWidget();
    this.showMiniChartWidget();
    this.showTopStoriesWidget();
    this.showFundamentalDataWidget();
    this.renderEconomicCalender();


  }
  //#region Trading view chart
  renderTechnicalAnalysis() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: "1D",
      width: "100%",

      isTransparent: false,
      height: "500",

      symbol: "BINANCE:FUNUSDT",
      showIntervalTabs: true,
      locale: "in",
      colorTheme: "light"
    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';

    const div = document.getElementById('technicalAnalysis');
    if (div) {
      // div.innerHTML = '';
      div.appendChild(script);

    }
  }
  widgetFUN: any;

  showChart(): void {

    this.widgetFUN = new TradingView.widget({
      symbol: `BINANCE:FUNUSDT`,
      interval: 'D',
      timezone: 'Asia/Kolkata',
      theme: 'light',
      style: '1',
      locale: 'in',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_side_toolbar: false,
      withdateranges: true,
      allow_symbol_change: true,
      watchlist: [
        "BINANCE:BTCUSDT"
      ],
      hidevolume: true, // Hide the volume
      calendar: false,
      container_id: 'tv_chart_container_FUN',
      width: 'inherit',

      study: true,
      details: true,
      hotlist: true,
      show_popup_button: true,
      popup_width: "500",
      popup_height: "500",
      support_host: "https://www.tradingview.com"

    });

  }


  // symbolOverview: any;

  showSymbolOverview(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({

      symbols: [
        [
          "MEXC:LINKUSDT|ALL"
        ],
        [
          "MEXC:SOLUSDT|ALL"
        ],
        [
          "MEXC:AVAXUSDT|ALL"
        ],

        [
          "MEXC:ETHUSDT|ALL"
        ],
        [
          "MEXC:DOGEUSDT|ALL"
        ],
        [
          "MEXC:FUNUSDT|ALL"
        ],
        [
          "MEXC:DOTUSDT|ALL"
        ],
        [
          "MEXC:THETAUSDT|ALL"
        ],
        [
          "MEXC:OCEANUSDT|ALL"
        ],
        [
          "MEXC:CHRUSDT|ALL"
        ],
        [
          "MEXC:BNBUSDT|ALL"
        ],
        [
          "MEXC:SHIBUSDT|ALL"
        ],

        [
          "MEXC:RVNUSDT|ALL"
        ],

        [
          "MEXC:MANAUSDT|ALL"
        ],

        [
          "MEXC:MATICUSDT|ALL"
        ],
        [
          "MEXC:GALAUSDT|ALL"
        ],
      ],
      chartOnly: false,
      width: "100%",
      height: 500,
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
        "1d|1",
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M"
      ]
    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';

    const div = document.getElementById('tv_symbol_overview');
    if (div) {
      // div.innerHTML = '';
      div.appendChild(script);

    }





























  }
  showScreenerWidget(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 500,
      defaultColumn: "overview",
      defaultScreen: "general",
      market: "crypto",
      showToolbar: true,
      colorTheme: "light",
      locale: "in"
    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';

    const div = document.getElementById('tv_screener_widget');
    if (div) {
      // div.innerHTML = '';
      div.appendChild(script);

    }
  }
  showHeatmapWidget(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      dataSource: "Crypto",
      blockSize: "market_cap_calc",
      blockColor: "change",
      locale: "in",
      symbolUrl: "",
      colorTheme: "light",
      hasTopBar: true,
      isDataSetEnabled: true,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      width: "100%",
      height: "500"
    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js';

    const div = document.getElementById('tv_heatmap_widget');
    if (div) {
      // div.innerHTML = '';
      div.appendChild(script);

    }
  }
  showTickerTapeWidget(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          // "proName": "FOREXCOM:SPXUSD",
          // "title": "S&P 500",
          "description": "FUN/BTC",
          "proName": "BITFINEX:FUNBTC"
        },
        {
          "proName": "FOREXCOM:NSXUSD",
          "title": "US 100"
        },
        {
          "proName": "FX_IDC:EURUSD",
          "title": "EUR to USD"
        },
        {
          "proName": "BITSTAMP:BTCUSD",
          "title": "Bitcoin"
        },
        {
          "proName": "BITSTAMP:ETHUSD",
          "title": "Ethereum"
        }
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "compact",
      colorTheme: "light",
      locale: "in"
    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';

    const div = document.getElementById('tv_tickerTape_widget');
    if (div) {
      // div.innerHTML = '';
      div.appendChild(script);

    }
  }


  renderMarketOverview() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "light",
      dateRange: "1D",
      showChart: true,
      locale: "in",
      width: "100%",
      height: "500",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      plotLineColorGrowing: "rgba(41, 98, 255, 1)",
      plotLineColorFalling: "rgba(41, 98, 255, 1)",
      gridLineColor: "rgba(240, 243, 250, 0)",
      scaleFontColor: "rgba(106, 109, 120, 1)",
      belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
      tabs: [
        {
          "title": "Indices",
          "symbols": [
            {
              "s": "FOREXCOM:SPXUSD",
              "d": "S&P 500"
            },
            {
              "s": "FOREXCOM:NSXUSD",
              "d": "US 100"
            },
            {
              "s": "FOREXCOM:DJI",
              "d": "Dow 30"
            },
            {
              "s": "INDEX:NKY",
              "d": "Nikkei 225"
            },
            {
              "s": "INDEX:DEU40",
              "d": "DAX Index"
            },
            {
              "s": "FOREXCOM:UKXGBP",
              "d": "UK 100"
            }
          ],
          "originalTitle": "Indices"
        },
        {
          "title": "Futures",
          "symbols": [
            {
              "s": "CME_MINI:ES1!",
              "d": "S&P 500"
            },
            {
              "s": "CME:6E1!",
              "d": "Euro"
            },
            {
              "s": "COMEX:GC1!",
              "d": "Gold"
            },
            {
              "s": "NYMEX:CL1!",
              "d": "WTI Crude Oil"
            },
            {
              "s": "NYMEX:NG1!",
              "d": "Gas"
            },
            {
              "s": "CBOT:ZC1!",
              "d": "Corn"
            }
          ],
          "originalTitle": "Futures"
        },
        {
          "title": "Bonds",
          "symbols": [
            {
              "s": "CBOT:ZB1!",
              "d": "T-Bond"
            },
            {
              "s": "CBOT:UB1!",
              "d": "Ultra T-Bond"
            },
            {
              "s": "EUREX:FGBL1!",
              "d": "Euro Bund"
            },
            {
              "s": "EUREX:FBTP1!",
              "d": "Euro BTP"
            },
            {
              "s": "EUREX:FGBM1!",
              "d": "Euro BOBL"
            }
          ],
          "originalTitle": "Bonds"
        },
        {
          "title": "Forex",
          "symbols": [
            {
              "s": "FX:EURUSD",
              "d": "EUR to USD"
            },
            {
              "s": "FX:GBPUSD",
              "d": "GBP to USD"
            },
            {
              "s": "FX:USDJPY",
              "d": "USD to JPY"
            },
            {
              "s": "FX:USDCHF",
              "d": "USD to CHF"
            },
            {
              "s": "FX:AUDUSD",
              "d": "AUD to USD"
            },
            {
              "s": "FX:USDCAD",
              "d": "USD to CAD"
            }
          ],
          "originalTitle": "Forex"
        }
      ]

    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';

    const div = document.getElementById('marketOverview');
    if (div) {
      // div.innerHTML = '';
      div.appendChild(script);

    }
  }

  showMiniChartWidget(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "MEXC:BTCUSDT",
      width: "100%",
      height: "500",
      locale: "in",
      dateRange: "1D",
      colorTheme: "light",
      isTransparent: false,
      autosize: true,
      largeChartUrl: ""

    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';

    const div = document.getElementById('tv_minichart_widget');
    if (div) {
      // div.innerHTML = '';
      div.appendChild(script);

    }
  }

  showTopStoriesWidget(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: "all_symbols",
      isTransparent: false,
      displayMode: "regular",
      width: "100%",
      height: "500",
      colorTheme: "light",
      locale: "in"

    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';

    const div = document.getElementById('topStories');
    if (div) {
      // div.innerHTML = '';
      div.appendChild(script);

    }
  }

  showFundamentalDataWidget(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      isTransparent: false,
      largeChartUrl: "",
      displayMode: "regular",
      width: "100%",
      height: "500",
      colorTheme: "light",
      symbol: "MEXC:BTCUSDT",
      locale: "in"

    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js';

    const div = document.getElementById('fundamentalData');
    if (div) {
      // div.innerHTML = '';
      div.appendChild(script);

    }
  }
  renderEconomicCalender(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "500",
      colorTheme: "light",
      isTransparent: false,
      locale: "in",
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,it,nz,ch,au,fr,jp,za,tr,ca,de,mx,es,gb,in"

    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';

    const div = document.getElementById('economicCalender');
    if (div) {
      // div.innerHTML = '';
      div.appendChild(script);

    }
  }
  //#endregion



























}
