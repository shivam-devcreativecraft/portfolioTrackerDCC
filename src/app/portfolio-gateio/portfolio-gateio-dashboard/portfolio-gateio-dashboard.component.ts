import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PortfolioDashboardService } from 'src/app/SharedFunctions/portfolio-dashboard.service';
import { GateioAPIService } from 'src/app/services/WorkingExchangeAPI/gateioAPI.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-portfolio-gateio-dashboard',
  templateUrl: './portfolio-gateio-dashboard.component.html',
  styleUrls: ['./portfolio-gateio-dashboard.component.scss']
})
export class PortfolioGateioDashboardComponent implements OnInit, OnDestroy {
  //#region  Data Retrieval

  sheetNames: string[] = ['P2P', 'Futures', 'Spot_Trades'];
  exchangeName: string = 'Gateio'
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
    private gateioAPIServiceRef: GateioAPIService,
    private portfolioDashboardService: PortfolioDashboardService
  ) { }

  ngOnInit(): void {
    this.sheetNames.forEach(sheetName => {
      this.portfolioDashboardService.loadSheetData(this, this.exchangeName, sheetName, '', 1, `${sheetName}SheetData`, this.componentDestroyed$);
    });

    this.gateioAPIServiceRef.getListSpotAccounts().subscribe((exchangeData: any) => {
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
    //#endregion
  stringToFloat(value: string): number {
    return parseFloat(value);
  }
  // ------------adding Price key to each exchanges.asset (Bybit)------------------


  private checkCalculateData(): void {
    if (this.loadSheetDataCompleted && this.getListSpotAccountsCompleted && this.getPriceCompleted) {
      this.calculateData();
    }
  }




  assetPriceList: any[] = []
  isCurrentPrice: boolean = false;
  private async getPrice(): Promise<void> {
    let tempSheetData: any[] = Object.values(this.exchangeData);

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

        this.assetPriceList = tradingPairData;
      })
      .catch((error) => {
        console.error('Error fetching prices:', error);
        throw error; // Throw error to be caught in the subscribe
      });
  }

  private mapPricesToAssets(): void {

    this.exchangeData = this.exchangeData.map((Asset: any) => {
      const priceData = this.assetPriceList.find(pair => pair.pair === Asset.currency);
      if (priceData) {
        return {
          ...Asset,
          CurrentStaticPrice: priceData.CurrentStaticPrice,
          TotalValue: (parseFloat(Asset.available)+parseFloat(Asset.locked)) * priceData.CurrentStaticPrice
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
