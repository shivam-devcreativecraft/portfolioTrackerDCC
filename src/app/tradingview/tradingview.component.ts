import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseDataService } from '../services/firebase-data.service';
import { NotificationService } from '../services/notification.service';
import { AnalysisSettings, DEFAULT_ANALYSIS_SETTINGS, formatSymbolPair } from '../models/analysis-settings.model';
import { MatDialog } from '@angular/material/dialog';
import { ChartSettingsModalComponent } from '../SharedComponents/chart-settings-modal/chart-settings-modal.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../SharedComponents/confirm-dialog/confirm-dialog.component';
declare const TradingView: any;

@Component({
  selector: 'app-tradingview',
  templateUrl: './tradingview.component.html',
  styleUrls: ['./tradingview.component.scss']
})
export class TradingviewComponent implements AfterViewInit, OnInit, OnDestroy {
  analysisForm: FormGroup;
  currentSettings: AnalysisSettings = DEFAULT_ANALYSIS_SETTINGS;
  isLoading = false;
  private widgets: { [key: string]: any } = {};

  // Available exchanges
  exchanges = [
    { value: 'BINANCE', name: 'Binance' },
    { value: 'MEXC', name: 'MEXC' },
    { value: 'KUCOIN', name: 'KuCoin' },
    { value: 'BYBIT', name: 'Bybit' }
  ];

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseDataService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.analysisForm = this.fb.group({
      exchange: [DEFAULT_ANALYSIS_SETTINGS.chart_analysis.exchange, Validators.required],
      symbol: [DEFAULT_ANALYSIS_SETTINGS.chart_analysis.symbol, [
        Validators.required,
        Validators.pattern('^[A-Za-z]+(?:\.p)?$|^[A-Za-z]+(?:\.P)?$')
      ]]
    });
  }

  ngOnInit() {
    this.loadAnalysisSettings();
  }

  ngAfterViewInit(): void {
    this.initializeCharts();
  }

  ngOnDestroy(): void {
    // Clean up widgets
    Object.values(this.widgets).forEach(widget => {
      if (widget && typeof widget.remove === 'function') {
        widget.remove();
      }
    });
    this.widgets = {};
  }

  // Load saved analysis settings from Firebase
  private loadAnalysisSettings() {
    this.firebaseService.getAnalysisSettings().subscribe({
      next: (settings: AnalysisSettings | null) => {
        if (settings) {
          this.currentSettings = settings;
          this.analysisForm.patchValue({
            exchange: settings.chart_analysis.exchange,
            symbol: settings.chart_analysis.symbol
          }, { emitEvent: false });
          
          // Render charts immediately after loading settings
          this.renderCharts();
        }
      },
      error: (error: Error) => {
        console.error('Error loading analysis settings:', error);
        this.notificationService.error('Failed to load analysis settings');
      }
    });
  }

  // Open settings modal
  openSettings(): void {
    const dialogRef = this.dialog.open(ChartSettingsModalComponent, {
      data: this.currentSettings,
      disableClose: true,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: AnalysisSettings) => {
      if (result) {
        this.currentSettings = result;
        this.analysisForm.patchValue({
          exchange: result.chart_analysis.exchange,
          symbol: result.chart_analysis.symbol
        });
        this.renderCharts();
      }
    });
  }

  // Render charts with current settings
  renderCharts(): void {
    if (this.analysisForm.valid) {
      this.isLoading = true;
      const values = this.analysisForm.value;
      
      // Update current settings
      this.currentSettings.chart_analysis.exchange = values.exchange;
      this.currentSettings.chart_analysis.symbol = values.symbol;
      
      // Small delay to ensure loading state is shown
      setTimeout(() => {
        this.updateCharts();
        this.isLoading = false;
      }, 100);
    }
  }

  // Save current settings to Firebase
  saveAnalysisSettings() {
    if (this.analysisForm.valid) {
      this.firebaseService.saveAnalysisSettings(this.currentSettings).subscribe({
        next: () => {
          this.notificationService.success('Analysis settings saved successfully');
        },
        error: (error: Error) => {
          console.error('Error saving analysis settings:', error);
          this.notificationService.error('Failed to save analysis settings');
        }
      });
    }
  }

  // Initialize all charts
  private initializeCharts() {
    this.showTickerTapeWidget();
    this.showChart();
    this.renderTechnicalAnalysis();
    this.showSymbolOverview();
    this.showHeatmapWidget();
    this.showMiniChartWidget();
    this.showTopStoriesWidget();
    this.showFundamentalDataWidget();
    this.renderEconomicCalender();
  }

  // Update all charts with new symbol
  private updateCharts() {
    // Remove existing widgets
    Object.values(this.widgets).forEach(widget => {
      if (widget && typeof widget.remove === 'function') {
        widget.remove();
      }
    });
    this.widgets = {};

    // Clear containers
    const containers = [
      'tv_chart_container_FUN',
      'technicalAnalysis',
      'tv_symbol_overview',
      'fundamentalData',
      'marketOverview',
      'tv_screener_widget',
      'tv_heatmap_widget',
      'tv_minichart_widget',
      'topStories',
      'economicCalender'
    ];
    
    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = '';
      }
    });

    // Reinitialize charts with new symbol
    this.initializeCharts();
  }

  private createWidget(containerId: string, script: HTMLScriptElement) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
      this.widgets[containerId] = script;
    }
  }

  private getCurrentSymbol(): string {
    return formatSymbolPair(
      this.currentSettings.chart_analysis.exchange,
      this.currentSettings.chart_analysis.symbol
    );
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
      symbol: this.getCurrentSymbol(),
      showIntervalTabs: true,
      locale: "in",
      colorTheme: "light"
    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    this.createWidget('technicalAnalysis', script);
  }

  showChart(): void {
    if (this.widgets['mainChart']) {
      this.widgets['mainChart'].remove();
    }
    
    this.widgets['mainChart'] = new TradingView.widget({
      symbol: this.getCurrentSymbol(),
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
      container_id: 'tv_chart_container_FUN',
      width: 'inherit',
      height: 500,
      watchlist: this.currentSettings.chart_analysis.watchlist
    });
  }

  showSymbolOverview(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: this.currentSettings.symbol_overview_symbols.map(symbol => [symbol + '|ALL']),
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
    this.createWidget('tv_symbol_overview', script);
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
    this.createWidget('tv_screener_widget', script);
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
    this.createWidget('tv_heatmap_widget', script);
  }

  showTickerTapeWidget(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
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
    this.createWidget('tv_tickerTape_widget', script);
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
    this.createWidget('marketOverview', script);
  }

  showMiniChartWidget(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: this.getCurrentSymbol(),
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
    this.createWidget('tv_minichart_widget', script);
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
    this.createWidget('topStories', script);
  }

  showFundamentalDataWidget(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: this.getCurrentSymbol(),
      colorTheme: "light",
      isTransparent: false,
      largeChartUrl: "",
      displayMode: "regular",
      width: "100%",
      height: "500",
      locale: "in"
    });
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js';
    this.createWidget('fundamentalData', script);
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
    this.createWidget('economicCalender', script);
  }
  //#endregion

  deleteSettings(): void {
    const dialogData = new ConfirmDialogModel(
      "Delete Settings",
      "Are you sure you want to delete all chart settings? This action cannot be undone."
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isLoading = true;
        this.firebaseService.deleteAnalysisSettings().subscribe({
          next: () => {
            this.notificationService.success('Settings deleted successfully');
            this.currentSettings = DEFAULT_ANALYSIS_SETTINGS;
            this.analysisForm.patchValue({
              exchange: DEFAULT_ANALYSIS_SETTINGS.chart_analysis.exchange,
              symbol: DEFAULT_ANALYSIS_SETTINGS.chart_analysis.symbol
            });
            this.updateCharts();
          },
          error: (error: Error) => {
            console.error('Error deleting settings:', error);
            this.notificationService.error('Failed to delete settings');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }
}
