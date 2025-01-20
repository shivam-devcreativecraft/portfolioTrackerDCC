import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PortfolioDashboardService } from 'src/app/SharedFunctions/portfolio-dashboard.service';
import { KucoinAPIService } from 'src/app/services/WorkingExchangeAPI/kucoinAPI.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-portfolio-kucoin-dashboard',
  templateUrl: './portfolio-kucoin-dashboard.component.html',
  styleUrls: ['./portfolio-kucoin-dashboard.component.scss']
})
export class PortfolioKucoinDashboardComponent implements OnInit, OnDestroy {
  //#region  Data Retrieval
  sheetNames: string[] = ['P2P', 'Money_Flow', 'Spot_Trades'];
  exchangeName: string = 'Kucoin'
  sheetData: any = {};
  exchangeData: any = {}
  columnTotals: any = {
    TotalInvested: 0,
  };
  totalSheets: number = this.sheetNames.length;
  loadedSheets: number = 0;
  private componentDestroyed$: Subject<void> = new Subject<void>();
  private loadSheetDataCompleted: boolean = false;
  private getListSpotAccountsCompleted: boolean = false;
  private getPriceCompleted: boolean = false;

  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private kucoinAPIServiceRef: KucoinAPIService,
    private portfolioDashboardService: PortfolioDashboardService
  ) { }

  ngOnInit(): void {
    this.sheetNames.forEach(sheetName => {
      this.portfolioDashboardService.loadSheetData(this, this.exchangeName, sheetName, '', 1, `${sheetName}SheetData`, this.componentDestroyed$);
    });

    this.kucoinAPIServiceRef.getAssetDetailsKucoin().subscribe((exchangeData: any) => {
      this.exchangeData = exchangeData;
      this.getListSpotAccountsCompleted = true;
      this.getPrice().then(() => {
        this.mapPricesToAssets();
        this.getPriceCompleted = true;
        this.checkCalculateData();
      }).catch(() => {
        this.getListSpotAccountsCompleted = false; // Reset the flag
        this.checkCalculateData();
      });
    });

    this.portfolioDashboardService.getAllSheetsLoadedObservable().subscribe(() => {
      this.loadSheetDataCompleted = true;
      this.checkCalculateData();
    });
  }


  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  nextPage(sheetName: string) {
    const currentPageKey = `${sheetName}SheetData.currentPage`;
    if (this.sheetData[currentPageKey] < this.sheetData[`${sheetName}SheetData.totalPages`]) {
      this.portfolioDashboardService.loadSheetData(this, this.exchangeName, sheetName, '', this.sheetData[currentPageKey] + 1, `${sheetName}SheetData`, this.componentDestroyed$);
    }
  }

  prevPage(sheetName: string) {
    const currentPageKey = `${sheetName}SheetData.currentPage`;
    if (this.sheetData[currentPageKey] > 1) {
      this.portfolioDashboardService.loadSheetData(this, this.exchangeName, sheetName, '', this.sheetData[currentPageKey] - 1, `${sheetName}SheetData`, this.componentDestroyed$);
    }
  }

  // loadData(): void {
  //   const allDataLoaded$: Subject<void> = new Subject<void>();

  //   this.sheetNames.forEach(sheetName => {
  //     this.portfolioDashboardService.loadSheetData(this, this.exchangeName, sheetName, '', 1, `${sheetName}SheetData`, this.componentDestroyed$).then(() => {
  //       this.loadedSheets++;
  //       if (this.loadedSheets === this.totalSheets) {
  //         allDataLoaded$.next();
  //         allDataLoaded$.complete();
  //       }
  //     });
  //   });

  //   this.kucoinAPIServiceRef.getAssetDetailsKucoin().subscribe(async (exchangeData: any) => {
  //     this.exchangeData = Object.values(exchangeData);
  //     this.IsAssetPriceLoaded = true;
  //     if (this.loadedSheets === this.totalSheets) {
  //       await this.getPriceInitialize();
  //       this.mapPricesToAssets_Kucoin();
  //       allDataLoaded$.next();
  //       allDataLoaded$.complete();
  //     }
  //   });

  //   allDataLoaded$.subscribe(() => {
  //     this.calculateColumnsTotal();
  //   });
  // }

  //#endregion

  stringToFloat(value: string): number {
    return parseFloat(value);
  }



  private checkCalculateData(): void {
    if (this.loadSheetDataCompleted && this.getListSpotAccountsCompleted && this.getPriceCompleted) {
      this.calculateData();
    }
  }

  assetPriceList: any[] = []
  isCurrentPrice: boolean = false;
   async getPrice() {
    let tempSheetData: any[] = Object.values(this.exchangeData);

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

        this.assetPriceList = tradingPairData;
      })
      .catch((error) => {
        console.error('Error fetching prices:', error);
      });
  }

  private mapPricesToAssets(): void {

    this.exchangeData = this.exchangeData.map((Asset: any) => {
      const priceData = this.assetPriceList.find(pair => pair.pair === Asset.currency);
      if (priceData) {
        return {
          ...Asset,
          CurrentStaticPrice: priceData.CurrentStaticPrice,
          TotalValue: parseFloat(Asset.balance) * priceData.CurrentStaticPrice
        };
      }
      return Asset;  // Return original asset if no price data is found
    }).filter((Asset: any) => Asset.TotalValue > 0.1);  // Filter the assets based on total value



  }
  private calculateData(): void {
 
    // Check if exchangeData is correctly structured and not empty
    if (Array.isArray(this.exchangeData) && this.exchangeData.length > 0) {
      const totalInvested = this.exchangeData.reduce((acc, curr) => {
        // Ensure each item has a TotalValue and it's a number
        const totalValue = Number(curr.TotalValue || 0);  // Fallback to 0 if undefined or NaN
        return acc + totalValue;
      }, 0);

      this.columnTotals.TotalInvested = totalInvested;
      // console.log('Total Invested:', this.columnTotals.TotalInvested);  // Log the calculated total
      // this.isColumnTotalsCalculated = true;
    } else {
      // console.log('No data available to calculate totals.');
      this.columnTotals.TotalInvested = 0;  // Reset or handle no data scenario
    }
  }

  }
