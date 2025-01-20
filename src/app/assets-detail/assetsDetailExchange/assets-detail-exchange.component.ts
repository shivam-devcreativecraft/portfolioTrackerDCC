import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { BinanceAPIService } from 'src/app/services/WorkingExchangeAPI/binanceAPI.service';
import { BybitAPIService } from 'src/app/services/WorkingExchangeAPI/bybitAPI.service';
import { GateioAPIService } from 'src/app/services/WorkingExchangeAPI/gateioAPI.service';
import { KucoinAPIService } from 'src/app/services/WorkingExchangeAPI/kucoinAPI.service';
import { MexcAPIService } from 'src/app/services/WorkingExchangeAPI/mexcAPI.service';
import { ComponentInstanceService } from 'src/app/services/component-instance.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import * as Highcharts from 'highcharts';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

interface ExchangeColors {
  [key: string]: string;
}

interface CoinAnalytics {
  symbol: string;
  totalValue: number;
  exchanges: Array<{
    name: string;
    value: number;
    freeValue: number;
    lockedValue: number;
  }>;
}

interface CoinTableData {
  coin: string;
  exchange: string;
  price: number;
  totalValue: number;
  available: number;
  locked: number;
  totalQuantity: number;
  availableQuantity: number;
  lockedQuantity: number;
}

@Component({
  selector: 'app-assets-detail-exchange',
  templateUrl: './assets-detail-exchange.component.html',
  styleUrls: ['./assets-detail-exchange.component.scss']
})
export class AssetsDetailExchangeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  selectedExchangeFilter: string = 'all';
  displayedColumns: string[] = [
    'coin', 
    'exchange',
    'Current Price',
    'totalValue', 
    'totalQuantity',
    'available', 
    'availableQuantity',
    'locked', 
    'lockedQuantity'
  ];
  dataSource = new MatTableDataSource<CoinTableData>();
  searchTerm: string = '';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie' as const,
      backgroundColor: 'transparent',
      height: 350,
      reflow: true,
      animation: false,
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: 'Exchange Distribution',
      style: {
        color: '#666',
        fontSize: '16px',
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: '#666'
          }
        },
        showInLegend: true,
        size: undefined,
        center: ['50%', '50%']
      }
    },
    series: [{
      type: 'pie' as const,
      name: 'Exchange Share',
      data: []
    } as Highcharts.SeriesPieOptions],
    credits: {
      enabled: false
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        color: '#666',
        fontWeight: 'normal'
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: false
              }
            }
          },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
          }
        }
      }]
    }
  };

  private readonly exchangeColors: ExchangeColors = {
    Binance: '#F3BA2F',
    Bybit: '#1DA1F2',
    Mexc: '#2EBD85',
    Kucoin: '#24AE8F',
    Gateio: '#E6007A'
  };

  public openMenu: boolean = false;
  isOver = false;

  clickMenu() {
    this.openMenu = !this.openMenu;
  }

  private componentDestroyed$: Subject<void> = new Subject<void>();

  BybitAssetPriceList: any[] = []
  assets: any = {
    Bybit: {},
    Mexc: {},
    Gateio: {},
    Kucoin: {},
    Binance: {},
  };

  IsExchangeDataLoaded: boolean = false;

  analyticsSearchTerm: string = '';
  selectedCoin: string | null = null;
  availableCoins: string[] = [];
  filteredCoins: string[] = [];
  filteredExchangeValues: Array<{name: string, value: number, freeValue: number, lockedValue: number}> = [];

  constructor(
    private bybitAPIServiceRef: BybitAPIService,
    private mexcAPIServiceRef: MexcAPIService,
    private functionsServiceRef: FunctionsService,
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private gateioAPIServiceRef: GateioAPIService,
    private kucoinAPIServiceRef: KucoinAPIService,
    private binanceAPIServiceRef: BinanceAPIService,
    private componentInstanceServiceRef: ComponentInstanceService,
    private viewContainerRef: ViewContainerRef,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.componentInstanceServiceRef.setComponentInstance('AssetsDetailExchangeComponent', this);
    
    // Configure default sorting
    this.dataSource.sortingDataAccessor = (item: CoinTableData, property: string) => {
      switch(property) {
        case 'coin': return item.coin;
        case 'exchange': return item.exchange;
        case 'Current Price': return item.price;
        case 'totalValue': return item.totalValue;
        case 'available': return item.available;
        case 'locked': return item.locked;
        case 'totalQuantity': return item.totalQuantity;
        case 'availableQuantity': return item.availableQuantity;
        case 'lockedQuantity': return item.lockedQuantity;
        default: return (item as any)[property];
      }
    };

    if (this.searchTerm === '') {
      this.initialize();
    }
  }

  scrollToElement(elementId: string) {
    const element = this.viewContainerRef.element.nativeElement.querySelector(`#${elementId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

      this.openMenu = false;

    }
  }
  ngOnInit(): void {
    this.initializeAvailableCoins();
    this.filterAnalyticsData();
    
    // Initialize filters
    this.selectedExchangeFilter = 'all';
    this.searchTerm = '';
  }
  clearSearchFilter() {
    this.searchTerm = ''
  }

  async initialize() {
    await this.getAssetsFromAPI().then(async () => {
      // Get all prices first
      await Promise.all([
        this.getPrice_Binance(),
        this.getPrice_Bybit(),
        this.getPrice_Mexc(),
        this.getPrice_Kucoin(),
        this.getPrice_Gateio()
      ]);

      // Map prices to assets
      this.mapPricesToAssets_Binance();
      this.mapPricesToAssets_Bybit();
      this.mapPricesToAssets_Mexc();
      this.mapPricesToAssets_Kucoin();
      this.mapPricesToAssets_Gateio();

      // Set flags
      this.isCurrentPrice_Binance = true;
      this.isCurrentPrice_Bybit = true;
      this.isCurrentPrice_Mexc = true;
      this.isCurrentPrice_Kucoin = true;
      this.isCurrentPrice_Gateio = true;

      // Update UI
      this.IsExchangeDataLoaded = true;
      this.initializeAvailableCoins();
      this.filterData();
      this.updateChartData();
      
      // Update table data and reinitialize controls
      await this.updateTableData();
      
      // Ensure table controls are setup after data is loaded
      setTimeout(() => {
        this.setupTableControls();
        // Apply initial filtering
        this.filterTableByExchange();
        // Force sort by total value descending
        if (this.sort) {
          this.sort.sort({ id: 'totalValue', start: 'desc', disableClear: false });
        }
      });

      this.toastr.info("All Exchange Data Loaded", "Successfull !");
    });
  }

  async getAssetsFromAPI() {
    const promises = [
      this.bybitAPIServiceRef.getAllCoinBalance('unified'),
      this.mexcAPIServiceRef.getAccountMexc().toPromise(),
      this.gateioAPIServiceRef.getListSpotAccounts().toPromise(),
      this.kucoinAPIServiceRef.getAssetDetailsKucoin().toPromise(),
      this.binanceAPIServiceRef.getAssettDetails().toPromise()
    ];

    const [bybitResponse, mexcResponse, gateResponse, kucoinResponse, binanceResponse] = await Promise.all(promises);

    this.assets.Bybit = bybitResponse.result.list[0].coin;
    this.assets.Mexc = mexcResponse.accountInfo.balances;
    this.assets.Gateio = gateResponse;
    this.assets.Kucoin = kucoinResponse;
    this.assets.Binance = binanceResponse;
  }

  stringToFloat(value: string): number {
    return parseFloat(value);
  }

  refresh() {
    localStorage.removeItem('AssetsDetail');
    this.initialize()
  }

  assetPriceList_Binance: any[] = []
  isCurrentPrice_Binance: boolean = false;
  async getPrice_Binance() {
    let tempSheetData: any[] = Object.values(this.assets.Binance);

    const tradingPairs: any[] = [
      ...new Set(tempSheetData.map((item: any) => item.asset)),
    ];

    const tradingPairData: {
      pair: string;
      CurrentStaticPrice: any;
    }[] = [];

    // Filter out 'USDT', 'EASY', and 'WRX' assets from tradingPairs
    const filteredTradingPairs = tradingPairs.filter(pair => !['USDT', 'EASY', 'WRX'].includes(pair));

    const priceRequests = filteredTradingPairs.map((pair) => {
      // For Binance, if pair starts with 'LD', strip it for price API call
      const apiPair = pair.startsWith('LD') ? pair.substring(2) : pair;
      return this.binanceAPIServiceRef.getPrice(apiPair).toPromise(); // Convert the Observable to a Promise
    });

    await Promise.all(priceRequests)
      .then((responses: any) => {
        let responseIndex = 0; // Track the index of the responses array
        for (let i = 0; i < tradingPairs.length; i++) {
          const pair = tradingPairs[i];
          if (['USDT', 'EASY', 'WRX'].includes(pair)) {
            // Skip 'USDT', 'EASY', and 'WRX' assets
            continue;
          }

          const dataForPair = tempSheetData.filter(
            (item: any) => item.Market === pair
          );

          // Use this.marketData to get relevant data
          const marketData = this.assets.Binance[pair];

          tradingPairData.push({
            pair: pair,  // Keep original pair name with LD prefix in our data
            CurrentStaticPrice: parseFloat(responses[responseIndex].price) || 0,
          });

          responseIndex++; // Move to the next response index
        }

        // Update BinanceAssetPriceList with the tradingPairData
        this.assetPriceList_Binance = tradingPairData;
      })
      .catch((error) => {
        console.error('Error fetching prices:', error);
      });
  }

  mapPricesToAssets_Binance() {
    // Map the pairs between this.assets.Binance and BinanceAssetPriceList
    for (let i = 0; i < this.assetPriceList_Binance.length; i++) {
      const pairData = this.assetPriceList_Binance[i];
      const asset = this.assets.Binance.find((binanceAsset: any) => binanceAsset.asset === pairData.pair);

      // console.log(pairData, asset);

      // Update this.assets.Binance with the CurrentStaticPrice
      if (asset) {
        asset.CurrentStaticPrice = pairData.CurrentStaticPrice;
      }
    }

    // Log the updated this.assets.Binance
    // console.log('Updated this.assets.Binance:', this.assets.Binance);
  }

  assetPriceList_Bybit: any[] = []
  isCurrentPrice_Bybit: boolean = false;
  async getPrice_Bybit() {
    let tempSheetData: any[] = Object.values(this.assets.Bybit);

    const tradingPairs: any[] = [
      ...new Set(tempSheetData.map((item: any) => item.coin)),
    ];

    const tradingPairData: {
      pair: string;
      CurrentStaticPrice: any;
    }[] = [];

    const priceRequests = tradingPairs.map((pair) => {
      return this.bybitAPIServiceRef.getPriceBybit(pair).toPromise();
    });

    await Promise.all(priceRequests)
      .then((responses: any[]) => {
        for (let i = 0; i < tradingPairs.length; i++) {
          const pair = tradingPairs[i];

          const dataForPair = tempSheetData.filter(
            (item: any) => item.Market === pair
          );

          tradingPairData.push({
            pair: pair,
            CurrentStaticPrice:
              parseFloat(responses[i]?.result?.list?.[0]?.lastPrice) || 0,
          });
        }

        this.assetPriceList_Bybit = tradingPairData;
      })
      .catch((error) => {
        console.error('Error fetching prices:', error);
      });
  }

  mapPricesToAssets_Bybit() {
    // Map the pairs between this.assets.Binance and BinanceAssetPriceList
    for (let i = 0; i < this.assetPriceList_Bybit.length; i++) {
      const pairData = this.assetPriceList_Bybit[i];
      const asset = this.assets.Bybit.find((bybitAsset: any) => bybitAsset.coin === pairData.pair);

      // console.log(pairData, asset);

      // Update this.assets.Binance with the CurrentStaticPrice
      if (asset) {
        asset.CurrentStaticPrice = pairData.CurrentStaticPrice;
      }
    }

    // Log the updated this.assets.Binance
  }

  assetPriceList_Mexc: any[] = [];
  isCurrentPrice_Mexc: boolean = false;

  async getPrice_Mexc() {
    let tempSheetData: any[] = Object.values(this.assets.Mexc);

    const tradingPairs: any[] = [
      ...new Set(tempSheetData.map((item: any) => item.asset)),
    ];

    const tradingPairData: {
      pair: string;
      CurrentStaticPrice: any;
    }[] = [];

    // Fetch price for all trading pairs in a single API call
    await this.mexcAPIServiceRef.getPriceMexc('').toPromise()
      .then((response: any) => {
        const prices = response.priceInfo;

        for (let i = 0; i < tradingPairs.length; i++) {
          const pair = tradingPairs[i];

          const dataForPair = tempSheetData.filter(
            (item: any) => item.asset === pair
          );

          // Find the corresponding price for the current trading pair in the API response
          const currentPrice = prices.find(
            (priceInfo: any) => priceInfo.symbol === pair + 'USDT'
          )?.price || 0;

          tradingPairData.push({
            pair: pair,
            CurrentStaticPrice: parseFloat(currentPrice) || 0,
          });
        }

        this.assetPriceList_Mexc = tradingPairData;
      })
      .catch((error) => {
        console.error('Error fetching prices:', error);
      });
  }

  mapPricesToAssets_Mexc() {
    // Map the pairs between this.assets.Mexc and assetPriceList_Mexc
    for (let i = 0; i < this.assetPriceList_Mexc.length; i++) {
      const pairData = this.assetPriceList_Mexc[i];
      const asset = this.assets.Mexc.find((mexcAsset: any) => mexcAsset.asset === pairData.pair);

      // Update this.assets.Mexc with the CurrentStaticPrice
      if (asset) {
        asset.CurrentStaticPrice = pairData.CurrentStaticPrice;
      }
    }

    // Log the updated this.assets.Mexc
  }

  assetPriceList_Kucoin: any[] = []
  isCurrentPrice_Kucoin: boolean = false;
  async getPrice_Kucoin() {
    let tempSheetData: any[] = Object.values(this.assets.Kucoin);

    const tradingPairs: any[] = [
      ...new Set(tempSheetData.map((item: any) => item.currency)),
    ];

    const tradingPairData: {
      pair: string;
      CurrentStaticPrice: any;
    }[] = [];

    // Create a dictionary to map trading pairs to responses
    const responseMap: { [pair: string]: any } = {};

    // Fetch prices for all trading pairs in a single API call
    const priceRequests = tradingPairs.map((pair) => {
      return this.kucoinAPIServiceRef.getPriceKucoin(pair + '-USDT')
        .toPromise()
        .then((response) => {
          responseMap[pair] = response; // Store the response in the dictionary
        });
    });

    await Promise.all(priceRequests)
      .then(() => {
        for (let i = 0; i < tradingPairs.length; i++) {
          const pair = tradingPairs[i];

          const dataForPair = tempSheetData.filter(
            (item: any) => item.currency === pair
          );

          const response = responseMap[pair]; // Get the response for the current pair

          if (response && response.data && response.data.price) {
            tradingPairData.push({
              pair: pair,
              CurrentStaticPrice: parseFloat(response.data.price) || 0,
            });
          } else {
            console.error(`Price data missing for pair: ${pair}`);
          }
        }

        this.assetPriceList_Kucoin = tradingPairData;
      })
      .catch((error) => {
        console.error('Error fetching prices:', error);
      });
  }

  mapPricesToAssets_Kucoin() {
    // Map the pairs between this.assets.Kucoin and assetPriceList_Kucoin
    for (let i = 0; i < this.assetPriceList_Kucoin.length; i++) {
      const pairData = this.assetPriceList_Kucoin[i];
      const asset = this.assets.Kucoin.find((kucoinAsset: any) => kucoinAsset.currency === pairData.pair);

      if (asset) {
        asset.CurrentStaticPrice = pairData.CurrentStaticPrice;
      }
    }

    // console.log('Updated this.assets.Kucoin:', this.assets.Kucoin);
  }

  assetPriceList_Gateio: any[] = []
  isCurrentPrice_Gateio: boolean = false;
  async getPrice_Gateio() {
    let tempSheetData: any[] = Object.values(this.assets.Gateio);

    const tradingPairs: any[] = [
      ...new Set(tempSheetData.map((item: any) => item.currency)),
    ].filter(pair => pair !== 'USDT');

    const tradingPairData: {
      pair: string;
      CurrentStaticPrice: any;
    }[] = [];

    // Fetch prices for all trading pairs in a single API call
    const priceRequests = tradingPairs.map((pair) => {
      return this.gateioAPIServiceRef.getPriceGate(pair + '_USDT').toPromise();
    });

    await Promise.all(priceRequests)
      .then((responses: any[]) => {
        for (let i = 0; i < tradingPairs.length; i++) {
          const pair = tradingPairs[i];

          const dataForPair = tempSheetData.filter(
            (item: any) => item.currency === pair
          );

          let currentPrice = 0;
          if (responses[i] && responses[i][0] && responses[i][0].last) {
            currentPrice = parseFloat(responses[i][0].last);
          }

          tradingPairData.push({
            pair: pair,
            CurrentStaticPrice: currentPrice,
          });
        }

        this.assetPriceList_Gateio = tradingPairData;
      })
      .catch((error) => {
        console.error('Error fetching prices:', error);
      });
  }

  mapPricesToAssets_Gateio() {
    for (let i = 0; i < this.assetPriceList_Gateio.length; i++) {
      const pairData = this.assetPriceList_Gateio[i];
      const asset = this.assets.Gateio.find((gateioAsset: any) => gateioAsset.currency === pairData.pair);

      if (asset) {
        asset.CurrentStaticPrice = pairData.CurrentStaticPrice;
      }
    }
  }

  filteredAssets: any = {
    Binance: [],
    Bybit: [],
    Mexc: [],
    Kucoin: [],
    Gateio: []
  };

  filterData() {
    // Filter and sort for Binance
    this.filteredAssets.Binance = this.assets.Binance
      .filter((asset: any) => asset.asset.toLowerCase().includes(this.searchTerm.toLowerCase()) && asset.asset.toUpperCase() !== 'EASY')
      .sort((a: any, b: any) => a.asset.localeCompare(b.asset));

    // Filter and sort for Bybit
    this.filteredAssets.Bybit = this.assets.Bybit
      .filter((asset: any) => asset.coin.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .sort((a: any, b: any) => a.coin.localeCompare(b.coin));

    // Filter and sort for Mexc
    this.filteredAssets.Mexc = this.assets.Mexc
      .filter((asset: any) => asset.asset.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .sort((a: any, b: any) => a.asset.localeCompare(b.asset));

    // Filter and sort for Kucoin
    this.filteredAssets.Kucoin = this.assets.Kucoin
      .filter((asset: any) => asset.currency.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .sort((a: any, b: any) => a.currency.localeCompare(b.currency));

    // Filter and sort for Gateio
    this.filteredAssets.Gateio = this.assets.Gateio
      .filter((asset: any) => asset.currency.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .sort((a: any, b: any) => a.currency.localeCompare(b.currency));
  }

  gotoPortfolio(exchangeName: string) {
    switch (exchangeName) {
      case 'Binance':
        this.router.navigate([
          'portfolio-binance',
          'portfolio-binance-sheets',
          'binance-spot_trades',])

        break;

      case 'Bybit':
        this.router.navigate([
          'portfolio-bybit',
          'portfolio-bybit-sheets',
          'bybit-spot_trades',])

        break;

      case 'Mexc':
        this.router.navigate([
          'portfolio-mexc',
          'portfolio-mexc-sheets',
          'mexc-spot_trades',])

        break;

      case 'Kucoin':
        this.router.navigate([
          'portfolio-kucoin',
          'portfolio-kucoin-sheets',
          'kucoin-spot_trades',])

        break;

      case 'Gateio':
        this.router.navigate([
          'portfolio-gateio',
          'portfolio-gateio-sheets',
          'gateio-spot_trades',])

        break;
    }
  }


  getTotalPortfolioValue(): number {
    const total = this.getTotalExchangeValues().reduce((total, exchange) => {
      const value = isNaN(exchange.value) ? 0 : exchange.value;
      return total + value;
    }, 0);
    
    return isNaN(total) ? 0 : total;
  }

  
  getTotalExchangeValues(): Array<{name: string, value: number, freeValue: number, lockedValue: number}> {
    return [
      {
        name: 'Binance',
        value: this.calculateExchangeValue('Binance') || 0,
        freeValue: this.calculateFreeValue('Binance') || 0,
        lockedValue: this.calculateLockedValue('Binance') || 0
      },
      {
        name: 'Bybit',
        value: this.calculateExchangeValue('Bybit') || 0,
        freeValue: this.calculateFreeValue('Bybit') || 0,
        lockedValue: this.calculateLockedValue('Bybit') || 0
      },
      {
        name: 'Mexc',
        value: this.calculateExchangeValue('Mexc') || 0,
        freeValue: this.calculateFreeValue('Mexc') || 0,
        lockedValue: this.calculateLockedValue('Mexc') || 0
      },
      {
        name: 'Kucoin',
        value: this.calculateExchangeValue('Kucoin') || 0,
        freeValue: this.calculateFreeValue('Kucoin') || 0,
        lockedValue: this.calculateLockedValue('Kucoin') || 0
      },
      {
        name: 'Gateio',
        value: this.calculateExchangeValue('Gateio') || 0,
        freeValue: this.calculateFreeValue('Gateio') || 0,
        lockedValue: this.calculateLockedValue('Gateio') || 0
      }
    ].sort((a, b) => b.value - a.value); // Sort by total value descending
  }

  calculateExchangeValue(exchange: string): number {
    let total = 0;
    switch (exchange) {
      case 'Binance':
        this.filteredAssets.Binance.forEach((asset: any) => {
          if (asset.asset === 'USDT') {
            total += this.stringToFloat(asset.free) + this.stringToFloat(asset.locked);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * 
              (this.stringToFloat(asset.free) + this.stringToFloat(asset.locked));
            total += assetValue;
          }
        });
        break;
      case 'Bybit':
        this.filteredAssets.Bybit.forEach((asset: any) => {
          if (asset.coin === 'USDT') {
            total += this.stringToFloat(asset.walletBalance);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * 
              this.stringToFloat(asset.walletBalance);
            total += assetValue;
          }
        });
        break;
      case 'Mexc':
        this.filteredAssets.Mexc.forEach((asset: any) => {
          if (asset.asset === 'USDT') {
            total += this.stringToFloat(asset.free) + this.stringToFloat(asset.locked);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * 
              (this.stringToFloat(asset.free) + this.stringToFloat(asset.locked));
            total += assetValue;
          }
        });
        break;
      case 'Kucoin':
        this.filteredAssets.Kucoin.forEach((asset: any) => {
          if (asset.currency === 'USDT') {
            total += this.stringToFloat(asset.available || 0) + this.stringToFloat(asset.holds || 0);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * 
              (this.stringToFloat(asset.available || 0) + this.stringToFloat(asset.holds || 0));
            total += assetValue;
          }
        });
        break;
      case 'Gateio':
        this.filteredAssets.Gateio.forEach((asset: any) => {
          if (asset.currency === 'USDT') {
            total += this.stringToFloat(asset.available) + this.stringToFloat(asset.locked);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * 
              (this.stringToFloat(asset.available) + this.stringToFloat(asset.locked));
            total += assetValue;
          }
        });
        break;
    }
    return total;
  }

  calculateFreeValue(exchange: string): number {
    let total = 0;
    switch (exchange) {
      case 'Binance':
        this.filteredAssets.Binance.forEach((asset: any) => {
          if (asset.asset === 'USDT') {
            total += this.stringToFloat(asset.free);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * this.stringToFloat(asset.free);
            total += assetValue;
          }
        });
        break;
      case 'Bybit':
        this.filteredAssets.Bybit.forEach((asset: any) => {
          if (asset.coin === 'USDT') {
            total += this.stringToFloat(asset.walletBalance);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * this.stringToFloat(asset.walletBalance);
            total += assetValue;
          }
        });
        break;
      case 'Mexc':
        this.filteredAssets.Mexc.forEach((asset: any) => {
          if (asset.asset === 'USDT') {
            total += this.stringToFloat(asset.free);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * this.stringToFloat(asset.free);
            total += assetValue;
          }
        });
        break;
      case 'Kucoin':
        this.filteredAssets.Kucoin.forEach((asset: any) => {
          if (asset.currency === 'USDT') {
            total += this.stringToFloat(asset.available || 0);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * this.stringToFloat(asset.available || 0);
            total += assetValue;
          }
        });
        break;
      case 'Gateio':
        this.filteredAssets.Gateio.forEach((asset: any) => {
          if (asset.currency === 'USDT') {
            total += this.stringToFloat(asset.available);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * this.stringToFloat(asset.available);
            total += assetValue;
          }
        });
        break;
    }
    return total;
  }

  calculateLockedValue(exchange: string): number {
    let total = 0;
    switch (exchange) {
      case 'Binance':
        this.filteredAssets.Binance.forEach((asset: any) => {
          if (asset.asset === 'USDT') {
            total += this.stringToFloat(asset.locked);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * this.stringToFloat(asset.locked);
            total += assetValue;
          }
        });
        break;
      case 'Bybit':
        // Bybit doesn't have separate locked value in the current data structure
        break;
      case 'Mexc':
        this.filteredAssets.Mexc.forEach((asset: any) => {
          if (asset.asset === 'USDT') {
            total += this.stringToFloat(asset.locked);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * this.stringToFloat(asset.locked);
            total += assetValue;
          }
        });
        break;
      case 'Kucoin':
        this.filteredAssets.Kucoin.forEach((asset: any) => {
          if (asset.currency === 'USDT') {
            total += this.stringToFloat(asset.holds || 0);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * this.stringToFloat(asset.holds || 0);
            total += assetValue;
          }
        });
        break;
      case 'Gateio':
        this.filteredAssets.Gateio.forEach((asset: any) => {
          if (asset.currency === 'USDT') {
            total += this.stringToFloat(asset.locked);
          } else {
            const assetValue = this.stringToFloat(asset.CurrentStaticPrice) * this.stringToFloat(asset.locked);
            total += assetValue;
          }
        });
        break;
    }
    return total;
  }

  ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (item: CoinTableData, property: string) => {
      switch(property) {
        case 'coin': return item.coin;
        case 'exchange': return item.exchange;
        case 'Current Price': return item.price;
        case 'totalValue': return item.totalValue;
        case 'available': return item.available;
        case 'locked': return item.locked;
        case 'totalQuantity': return item.totalQuantity;
        case 'availableQuantity': return item.availableQuantity;
        case 'lockedQuantity': return item.lockedQuantity;
        default: return (item as any)[property];
      }
    };
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Set up initial filtering
    this.filterTableByExchange();
    
    // Update chart after data is loaded
    this.updateChartData();
  }

  private updateChartData() {
    if (this.chartOptions.series && Array.isArray(this.chartOptions.series)) {
      const data = this.getDisplayedExchanges();
      const totalValue = this.selectedCoin ? 
        this.getCoinAnalytics(this.selectedCoin).totalValue : 
        this.getTotalPortfolioValue();

      this.chartOptions.series[0] = {
        type: 'pie' as const,
        name: this.selectedCoin ? `${this.selectedCoin} Distribution` : 'Exchange Share',
        data: data.map(exchange => ({
          name: exchange.name,
          y: totalValue > 0 ? (exchange.value / totalValue) * 100 : 0,
          color: this.exchangeColors[exchange.name] || '#666666'
        }))
      } as Highcharts.SeriesPieOptions;

      // Update chart title
      if (this.chartOptions.title) {
        this.chartOptions.title.text = this.selectedCoin ? 
          `${this.selectedCoin} Distribution Across Exchanges` : 
          'Exchange Distribution';
      }

      // Force chart update
      this.chartOptions = { ...this.chartOptions };
    }
  }

  getTotalAvailableValue(): number {
    return this.getTotalExchangeValues().reduce((total, exchange) => total + exchange.freeValue, 0);
  }

  getTotalLockedValue(): number {
    return this.getTotalExchangeValues().reduce((total, exchange) => total + exchange.lockedValue, 0);
  }

  initializeAvailableCoins() {
    const coins = new Set<string>();
    
    // Collect coins from Binance
    if (this.assets.Binance && Array.isArray(this.assets.Binance)) {
      this.assets.Binance.forEach((asset: any) => {
        if (asset.asset && asset.asset !== 'EASY') {
          coins.add(asset.asset);
        }
      });
    }

    // Collect coins from Bybit
    if (this.assets.Bybit && Array.isArray(this.assets.Bybit)) {
      this.assets.Bybit.forEach((asset: any) => {
        if (asset.coin) {
          coins.add(asset.coin);
        }
      });
    }

    // Collect coins from Mexc
    if (this.assets.Mexc && Array.isArray(this.assets.Mexc)) {
      this.assets.Mexc.forEach((asset: any) => {
        if (asset.asset) {
          coins.add(asset.asset);
        }
      });
    }

    // Collect coins from Kucoin
    if (this.assets.Kucoin && Array.isArray(this.assets.Kucoin)) {
      this.assets.Kucoin.forEach((asset: any) => {
        if (asset.currency) {
          coins.add(asset.currency);
        }
      });
    }

    // Collect coins from Gateio
    if (this.assets.Gateio && Array.isArray(this.assets.Gateio)) {
      this.assets.Gateio.forEach((asset: any) => {
        if (asset.currency) {
          coins.add(asset.currency);
        }
      });
    }

    this.availableCoins = Array.from(coins).sort();
    this.filteredCoins = this.availableCoins;
    console.log('Available coins:', this.availableCoins); // Debug log
  }

  filterCoins() {
    if (!this.analyticsSearchTerm) {
      this.filteredCoins = this.availableCoins;
      this.selectedCoin = null;
    } else {
      const searchTerm = this.analyticsSearchTerm.toLowerCase();
      this.filteredCoins = this.availableCoins.filter(coin =>
        coin.toLowerCase().includes(searchTerm)
      );
      // Update selected coin if there's an exact match
      const exactMatch = this.filteredCoins.find(
        coin => coin.toLowerCase() === searchTerm
      );
      this.selectedCoin = exactMatch || null;
    }
  }

  getCoinAnalytics(symbol: string): CoinAnalytics {
    const analytics: CoinAnalytics = {
      symbol,
      totalValue: 0,
      exchanges: []
    };

    // Check Binance
    const binanceAsset = this.assets.Binance?.find((a: any) => a.asset === symbol);
    if (binanceAsset) {
      const value = symbol === 'USDT' 
        ? this.stringToFloat(binanceAsset.free) + this.stringToFloat(binanceAsset.locked)
        : this.stringToFloat(binanceAsset.CurrentStaticPrice) * (this.stringToFloat(binanceAsset.free) + this.stringToFloat(binanceAsset.locked));
      
      analytics.exchanges.push({
        name: 'Binance',
        value,
        freeValue: symbol === 'USDT' 
          ? this.stringToFloat(binanceAsset.free)
          : this.stringToFloat(binanceAsset.CurrentStaticPrice) * this.stringToFloat(binanceAsset.free),
        lockedValue: symbol === 'USDT'
          ? this.stringToFloat(binanceAsset.locked)
          : this.stringToFloat(binanceAsset.CurrentStaticPrice) * this.stringToFloat(binanceAsset.locked)
      });
      analytics.totalValue += value;
    }

    // Check Bybit
    const bybitAsset = this.assets.Bybit?.find((a: any) => a.coin === symbol);
    if (bybitAsset) {
      const value = symbol === 'USDT'
        ? this.stringToFloat(bybitAsset.walletBalance)
        : this.stringToFloat(bybitAsset.CurrentStaticPrice) * this.stringToFloat(bybitAsset.walletBalance);
      
      analytics.exchanges.push({
        name: 'Bybit',
        value,
        freeValue: value, // Bybit doesn't separate free/locked
        lockedValue: 0
      });
      analytics.totalValue += value;
    }

    // Check Mexc
    const mexcAsset = this.assets.Mexc?.find((a: any) => a.asset === symbol);
    if (mexcAsset) {
      const value = symbol === 'USDT'
        ? this.stringToFloat(mexcAsset.free) + this.stringToFloat(mexcAsset.locked)
        : this.stringToFloat(mexcAsset.CurrentStaticPrice) * (this.stringToFloat(mexcAsset.free) + this.stringToFloat(mexcAsset.locked));
      
      analytics.exchanges.push({
        name: 'Mexc',
        value,
        freeValue: symbol === 'USDT'
          ? this.stringToFloat(mexcAsset.free)
          : this.stringToFloat(mexcAsset.CurrentStaticPrice) * this.stringToFloat(mexcAsset.free),
        lockedValue: symbol === 'USDT'
          ? this.stringToFloat(mexcAsset.locked)
          : this.stringToFloat(mexcAsset.CurrentStaticPrice) * this.stringToFloat(mexcAsset.locked)
      });
      analytics.totalValue += value;
    }

    // Check Kucoin
    const kucoinAsset = this.assets.Kucoin?.find((a: any) => a.currency === symbol);
    if (kucoinAsset) {
      const value = symbol === 'USDT'
        ? this.stringToFloat(kucoinAsset.available || 0) + this.stringToFloat(kucoinAsset.holds || 0)
        : this.stringToFloat(kucoinAsset.CurrentStaticPrice) * (this.stringToFloat(kucoinAsset.available || 0) + this.stringToFloat(kucoinAsset.holds || 0));
      
      analytics.exchanges.push({
        name: 'Kucoin',
        value,
        freeValue: symbol === 'USDT'
          ? this.stringToFloat(kucoinAsset.available || 0)
          : this.stringToFloat(kucoinAsset.CurrentStaticPrice) * this.stringToFloat(kucoinAsset.available || 0),
        lockedValue: symbol === 'USDT'
          ? this.stringToFloat(kucoinAsset.holds || 0)
          : this.stringToFloat(kucoinAsset.CurrentStaticPrice) * this.stringToFloat(kucoinAsset.holds || 0)
      });
      analytics.totalValue += value;
    }

    // Check Gateio
    const gateioAsset = this.assets.Gateio?.find((a: any) => a.currency === symbol);
    if (gateioAsset) {
      const value = symbol === 'USDT'
        ? this.stringToFloat(gateioAsset.available) + this.stringToFloat(gateioAsset.locked)
        : this.stringToFloat(gateioAsset.CurrentStaticPrice) * (this.stringToFloat(gateioAsset.available) + this.stringToFloat(gateioAsset.locked));
      
      analytics.exchanges.push({
        name: 'Gateio',
        value,
        freeValue: symbol === 'USDT'
          ? this.stringToFloat(gateioAsset.available)
          : this.stringToFloat(gateioAsset.CurrentStaticPrice) * this.stringToFloat(gateioAsset.available),
        lockedValue: symbol === 'USDT'
          ? this.stringToFloat(gateioAsset.locked)
          : this.stringToFloat(gateioAsset.CurrentStaticPrice) * this.stringToFloat(gateioAsset.locked)
      });
      analytics.totalValue += value;
    }

    // Sort exchanges by value
    analytics.exchanges.sort((a, b) => b.value - a.value);
    return analytics;
  }

  filterAnalyticsData() {
    if (this.selectedCoin || this.analyticsSearchTerm) {
      const coinToAnalyze = this.selectedCoin || this.analyticsSearchTerm.toUpperCase();
      const coinAnalytics = this.getCoinAnalytics(coinToAnalyze);
      this.filteredExchangeValues = coinAnalytics.exchanges;
    } else {
      this.filteredExchangeValues = this.getTotalExchangeValues();
    }
    this.updateChartData();
  }

  clearAnalyticsSearch() {
    this.analyticsSearchTerm = '';
    this.selectedCoin = null;
    this.filterCoins();
    this.filterAnalyticsData();
  }

  getCoinTotalAvailable(): number {
    if (!this.selectedCoin) return 0;
    const analytics = this.getCoinAnalytics(this.selectedCoin);
    return analytics.exchanges.reduce((total, exchange) => total + exchange.freeValue, 0);
  }

  getCoinTotalLocked(): number {
    if (!this.selectedCoin) return 0;
    const analytics = this.getCoinAnalytics(this.selectedCoin);
    return analytics.exchanges.reduce((total, exchange) => total + exchange.lockedValue, 0);
  }

  getDisplayedExchanges(): Array<{name: string, value: number, freeValue: number, lockedValue: number}> {
    if (this.selectedCoin) {
      return this.getCoinAnalytics(this.selectedCoin).exchanges;
    }
    return this.getTotalExchangeValues();
  }

  getExchangePercentage(exchange: {name: string, value: number}): number {
    if (this.selectedCoin) {
      const totalValue = this.getCoinAnalytics(this.selectedCoin).totalValue;
      return totalValue > 0 ? (exchange.value / totalValue) * 100 : 0;
    }
    return this.getTotalPortfolioValue() > 0 ? (exchange.value / this.getTotalPortfolioValue()) * 100 : 0;
  }

  filterTableByExchange() {
    this.dataSource.filterPredicate = (data: CoinTableData, filter: string) => {
      // Exchange filter
      const exchangeMatch = this.selectedExchangeFilter === 'all' || 
                           data.exchange === this.selectedExchangeFilter;
      
      // Search filter
      const searchTerm = this.searchTerm.toLowerCase().trim();
      const searchMatch = searchTerm === '' || 
                         data.coin.toLowerCase().includes(searchTerm) ||
                         data.exchange.toLowerCase().includes(searchTerm);
      
      // Both conditions must be true for the row to be shown
      return exchangeMatch && searchMatch;
    };

    // Trigger the filter
    this.dataSource.filter = 'trigger'; // Any non-empty value will work
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;
    this.filterTableByExchange(); // Reuse the same filter logic
  }

  getExchangeColor(exchange: string): string {
    return this.exchangeColors[exchange] || '#666666';
  }

  updateTableData() {
    const tableData: CoinTableData[] = [];
    
    this.availableCoins.forEach(coin => {
      const analytics = this.getCoinAnalytics(coin);
      
      // Create a separate row for each exchange
      analytics.exchanges.forEach(exchange => {
        let availableQty = 0;
        let lockedQty = 0;
        let price = 0;
        
        // Get the raw quantities and price based on exchange
        switch(exchange.name) {
          case 'Binance':
            const binanceAsset = this.assets.Binance?.find((a: any) => a.asset === coin);
            if (binanceAsset) {
              availableQty = this.stringToFloat(binanceAsset.free);
              lockedQty = this.stringToFloat(binanceAsset.locked);
              price = this.stringToFloat(binanceAsset.CurrentStaticPrice);
            }
            break;
          case 'Bybit':
            const bybitAsset = this.assets.Bybit?.find((a: any) => a.coin === coin);
            if (bybitAsset) {
              availableQty = this.stringToFloat(bybitAsset.walletBalance);
              lockedQty = 0; // Bybit doesn't separate free/locked
              price = this.stringToFloat(bybitAsset.CurrentStaticPrice);
            }
            break;
          case 'Mexc':
            const mexcAsset = this.assets.Mexc?.find((a: any) => a.asset === coin);
            if (mexcAsset) {
              availableQty = this.stringToFloat(mexcAsset.free);
              lockedQty = this.stringToFloat(mexcAsset.locked);
              price = this.stringToFloat(mexcAsset.CurrentStaticPrice);
            }
            break;
          case 'Kucoin':
            const kucoinAsset = this.assets.Kucoin?.find((a: any) => a.currency === coin);
            if (kucoinAsset) {
              availableQty = this.stringToFloat(kucoinAsset.available || 0);
              lockedQty = this.stringToFloat(kucoinAsset.holds || 0);
              price = this.stringToFloat(kucoinAsset.CurrentStaticPrice);
            }
            break;
          case 'Gateio':
            const gateioAsset = this.assets.Gateio?.find((a: any) => a.currency === coin);
            if (gateioAsset) {
              availableQty = this.stringToFloat(gateioAsset.available);
              lockedQty = this.stringToFloat(gateioAsset.locked);
              price = this.stringToFloat(gateioAsset.CurrentStaticPrice);
            }
            break;
        }

        tableData.push({
          coin: coin,
          exchange: exchange.name,
          price: price,
          totalValue: exchange.value,
          available: exchange.freeValue,
          locked: exchange.lockedValue,
          totalQuantity: availableQty + lockedQty,
          availableQuantity: availableQty,
          lockedQuantity: lockedQty
        });
      });
    });

    this.dataSource.data = tableData;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private setupTableControls() {
    if (this.dataSource && this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
}
