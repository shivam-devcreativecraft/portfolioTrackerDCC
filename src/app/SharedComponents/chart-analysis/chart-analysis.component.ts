import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare const TradingView: any;



@Component({
  selector: 'app-chart-analysis',
  templateUrl: './chart-analysis.component.html',
  styleUrls: ['./chart-analysis.component.scss']
})
export class ChartAnalysisComponent implements AfterViewInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public chartData: any,

    public dialogRef: MatDialogRef<ChartAnalysisComponent>

  ) {}

  formatedSymbol: any;

  ngAfterViewInit(): void {

    if (this.chartData.exchangeName != 'FREEBITCO') {
      this.formatedSymbol = ((this.chartData.exchangeName).toUpperCase()) + ':' + (this.chartData.tradingPair.toUpperCase()) + 'USDT';
    }
    if (this.chartData.exchangeName == 'FREEBITCO') {
      this.formatedSymbol = 'BINANCE:' + (this.chartData.tradingPair.toUpperCase()) + 'USDT';

    }

    // this.formatedSymbolStories = ('BITSTAMP') + ':' + (this.chartData.tradingPair.toUpperCase()) + 'USD'

    // "BITSTAMP:BTCUSD"
    this.renderTechnicalAnalysis();
    this.renderSymbolOverview();
    this.renderAdvanceChart();
  }



  onClose(): void {
    this.dialogRef.close();
  }



  // ----------------------------------------------------------
  widget: any;

  renderAdvanceChart(): void {
    let watchlistArray: any[] = []
    if (this.chartData.exchangeName != 'FREEBITCO' && !this.chartData.location) {

      this.chartData.tradingPairsAll.forEach((data: any) => {
        watchlistArray.push((this.chartData.exchangeName).toUpperCase() + ':' + (data.TradingPair).toUpperCase() + 'USDT')
      })
    }

    // else if 

    this.widget = new TradingView.widget({
      symbol: this.formatedSymbol,
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
      watchlist: watchlistArray ? watchlistArray : ['BINANCE:FUNUSDT', 'BINANCE:BTCUSDT'],
      hidevolume: true, // Hide the volume
      calendar: false,
      container_id: 'tv_chart_container',
      width: "100%",
      height: "inherit",
      autosize: true,
      hide_volume: true,
      study: true,
      details: true,
      hotlist: true,
      show_popup_button: true,
      popup_width: "500",
      popup_height: "500",
      support_host: "https://www.tradingview.com"

    });
  }

  renderTechnicalAnalysis() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: "1D",
      // width: "300",
      width: "100%",
      displayMode: "multiple",

      isTransparent: false,
      height: "100%",
      autosize: true,
      symbol: this.formatedSymbol,
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

  renderSymbolOverview(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({

      symbols: [
        [
          this.formatedSymbol + '|1D'
        ]

      ],
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

    const div = document.getElementById('tv_symbol_overview');
    if (div) {

      // div.innerHTML = '';
      div.appendChild(script);

    }


  }


  // ---------------------------------------------------------







}
