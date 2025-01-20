import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleSheetApiService } from '../../services/google-sheet-api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentInstanceService } from 'src/app/services/component-instance.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TradeDetailsModalComponent } from '../trade-details-modal/trade-details-modal.component';

@Component({
  selector: 'app-assets-detail-history',
  templateUrl: './assets-detail-history.component.html',
  styleUrls: ['./assets-detail-history.component.scss'],
})
export class AssetsDetailHistoryComponent implements OnDestroy, OnInit {
  //#region Loading SheetData
  exchangeNames: any[] = ['Binance', 'Bybit', 'Mexc', 'Kucoin', 'Gate'];
  // allExchanges: string[] = ['Binance', 'Bybit', 'Mexc', 'Kucoin', 'Gate'];
  selectedExchanges: string[] = ['Binance', 'Bybit', 'Mexc', 'Kucoin', 'Gate'];
  allSelected: boolean = true;

  IsExchangeDataLoaded: boolean = false;

  coinLength: any = {
    Binance: 0,
    Bybit: 0,
    Mexc: 0,
    Kucoin: 0,
    Gate: 0
  }

  exchangeData_Binance: any[] = [];
  exchangeData_Bybit: any[] = [];
  exchangeData_Mexc: any[] = [];
  exchangeData_Kucoin: any[] = [];
  exchangeData_Gate: any[] = [];

  totalPages: { [key: string]: number } = {};
  isSheetDataLoaded: { [key: string]: boolean } = {};
  componentDestroyed$: Subject<void> = new Subject<void>();

  UpdatedExchangeData_Binance: { [coinName: string]: any } = {};
  UpdatedExchangeData_Bybit: { [coinName: string]: any } = {};
  UpdatedExchangeData_Mexc: { [coinName: string]: any } = {};
  UpdatedExchangeData_Kucoin: { [coinName: string]: any } = {};
  UpdatedExchangeData_Gate: { [coinName: string]: any } = {};

  searchCoin: string = '';
  filteredOptions: Array<{coinName: string, exchange: string}> = [];

  pageSize: number = 8;
  currentPage: number = 0;

  // Replace individual options with a single toggle
  show_options: boolean = false;

  // Replace exchange-specific filters with a single global filter
  selectedFilter: number = 1; // Default to showing holdings

  // Add count property for logging control
  private count: number = 1;

  sortBy: string = 'name-asc'; // Default sort

  constructor(
    private googleSheetAPIRef: GoogleSheetApiService,
    private componentInstanceServiceRef: ComponentInstanceService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.componentInstanceServiceRef.setComponentInstance('AssetsDetailHistoryComponent', this)

    this.loadSheetDataForExchange();

  }



  ngOnInit(): void {
    // Initialize filtered options
    this.filterOptions('');
  }

  async loadSheetDataForExchange() {
    // console.log('Starting to load data for exchanges:', this.exchangeNames);
    const requests = this.exchangeNames.map(exchangeName => this.loadSheetData(exchangeName, 1));
    await Promise.all(requests);
    for (const exchangeName of this.exchangeNames) {
      await this.onDataLoaded(exchangeName);
    }
    this.getExchangeDataLength();
    // console.log('Final Exchange Data:', {
    //   Binance: {
    //     data: this.UpdatedExchangeData_Binance,
    //     count: this.coinLength.Binance
    //   },
    //   Bybit: {
    //     data: this.UpdatedExchangeData_Bybit,
    //     count: this.coinLength.Bybit
    //   },
    //   Mexc: {
    //     data: this.UpdatedExchangeData_Mexc,
    //     count: this.coinLength.Mexc
    //   },
    //   Kucoin: {
    //     data: this.UpdatedExchangeData_Kucoin,
    //     count: this.coinLength.Kucoin
    //   },
    //   Gate: {
    //     data: this.UpdatedExchangeData_Gate,
    //     count: this.coinLength.Gate
    //   }
    // });
    this.toastr.info('All exchanges data loaded');
    this.IsExchangeDataLoaded = true;
  }

  loadSheetData(exchangeName: string, currentPage: number): Promise<void> {
    // console.log(`Loading data for ${exchangeName}, page ${currentPage}`);
    return new Promise<void>((resolve, reject) => {
      this.googleSheetAPIRef
        .getSingleSheetDataAIOExchanges(
          exchangeName,
          'Spot_Trades',
          1000,
          currentPage
        )
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe(
          (res: any) => {
            if (res && res.exchangeData && res.exchangeData.length > 0) {
              // console.log(`Received data for ${exchangeName}, page ${currentPage}:`, res.exchangeData);
              if (exchangeName === 'Binance') {
                this.exchangeData_Binance.push(...res.exchangeData);
              } else if (exchangeName === 'Bybit') {
                this.exchangeData_Bybit.push(...res.exchangeData);
              } else if (exchangeName === 'Mexc') {
                this.exchangeData_Mexc.push(...res.exchangeData);
              } else if (exchangeName === 'Kucoin') {
                this.exchangeData_Kucoin.push(...res.exchangeData);
              } else if (exchangeName === 'Gate') {
                this.exchangeData_Gate.push(...res.exchangeData);
              }

              this.totalPages[exchangeName] = res.totalPages;

              if (currentPage < this.totalPages[exchangeName]) {
                this.loadSheetData(exchangeName, currentPage + 1).then(() => resolve());
              } else {
                this.isSheetDataLoaded[exchangeName] = true;
                // console.log(`Completed loading all pages for ${exchangeName}`);
                resolve();
              }
            }
          },
          (error) => {
            console.error(`Error loading data for ${exchangeName}:`, error);
            reject(error);
          }
        );
    });
  }



  // areAllExchangesLoaded(): boolean {
  //   return this.exchangeNames.every(
  //     (exchangeName) => this.isSheetDataLoaded[exchangeName]
  //   );
  // }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
  //#endregion

  //#region After Data Loaded
  async onDataLoaded(exchangeName: string) {
    switch (exchangeName) {
      case 'Binance':
        await this.separateTrades('Binance');
        await this.calculateAverageBuyPrice('Binance');
        await this.calculateRemainingQuantity('Binance');
        break;
      case 'Bybit':
        await this.separateTrades('Bybit');
        await this.calculateAverageBuyPrice('Bybit');
        await this.calculateRemainingQuantity('Bybit');
        break;
      case 'Mexc':
        await this.separateTrades('Mexc');
        await this.calculateAverageBuyPrice('Mexc');
        await this.calculateRemainingQuantity('Mexc');
        break;
      case 'Kucoin':
        await this.separateTrades('Kucoin');
        await this.calculateAverageBuyPrice('Kucoin');
        await this.calculateRemainingQuantity('Kucoin');
        break;
      case 'Gate':
        await this.separateTrades('Gate');
        await this.calculateAverageBuyPrice('Gate');
        await this.calculateRemainingQuantity('Gate');
        break;
      default:
        break;
    }
  }

  async separateTrades(exchangeName: string) {
    // console.log(`Separating trades for ${exchangeName}`);
    const exchangeData = this.getExchangeData(exchangeName);
    const updatedExchangeData = this.createUpdatedExchangeData(exchangeData);
    // console.log(`Separated trades for ${exchangeName}:`, updatedExchangeData);
    this.setUpdatedExchangeData(exchangeName, updatedExchangeData);
  }

  createUpdatedExchangeData(exchangeData: any[]): { [coinName: string]: any } {
    const updatedExchangeData: { [coinName: string]: any } = {};

    for (const trade of exchangeData) {
      const coinName = trade.Market;

      if (!updatedExchangeData[coinName]) {
        updatedExchangeData[coinName] = {
          trades: [],
          buyTrades: [],
          sellTrades: [],
        };
      }

      updatedExchangeData[coinName].trades.push(trade);

      if (trade.Direction === 'BUY') {
        updatedExchangeData[coinName].buyTrades.push(trade);
      } else if (trade.Direction === 'SELL') {
        updatedExchangeData[coinName].sellTrades.push(trade);
      }
    }

    return updatedExchangeData;
  }

  setUpdatedExchangeData(exchangeName: string, updatedExchangeData: { [coinName: string]: any }) {
    switch (exchangeName) {
      case 'Binance':
        this.UpdatedExchangeData_Binance = updatedExchangeData;
        break;
      case 'Bybit':
        this.UpdatedExchangeData_Bybit = updatedExchangeData;
        break;
      case 'Mexc':
        this.UpdatedExchangeData_Mexc = updatedExchangeData;
        break;
      case 'Kucoin':
        this.UpdatedExchangeData_Kucoin = updatedExchangeData;
        break;
      case 'Gate':
        this.UpdatedExchangeData_Gate = updatedExchangeData;
        break;
      default:
        break;
    }
  }

  async calculateAverageBuyPrice(exchangeName: string) {
    const updatedExchangeData = this.getUpdatedExchangeData(exchangeName);
    this.calculateAverageBuyPriceForExchange(exchangeName, updatedExchangeData);
  }

  getUpdatedExchangeData(exchangeName: string): { [coinName: string]: any } {
    switch (exchangeName) {
      case 'Binance':
        return this.UpdatedExchangeData_Binance;
      case 'Bybit':
        return this.UpdatedExchangeData_Bybit;
      case 'Mexc':
        return this.UpdatedExchangeData_Mexc;
      case 'Kucoin':
        return this.UpdatedExchangeData_Kucoin;
      case 'Gate':
        return this.UpdatedExchangeData_Gate;
      default:
        return {};
    }
  }

  calculateAverageBuyPriceForExchange(exchangeName: string, updatedExchangeData: { [coinName: string]: any }) {
    // console.log(`Calculating average buy price for ${exchangeName}`);
    const coins = updatedExchangeData;

    for (const coinName in coins) {
      if (coins.hasOwnProperty(coinName)) {
        const buyTrades = coins[coinName].buyTrades;

        if (buyTrades.length > 0) {
          const totalAmount = buyTrades.reduce((sum: any, trade: any) => sum + trade.Amount, 0);
          const totalUSDT = buyTrades.reduce((sum: any, trade: any) => sum + trade.Total_USDT, 0);

          const averageBuyPrice = totalUSDT / totalAmount;

          coins[coinName].averageBuyPrice = averageBuyPrice;
          // console.log(`${exchangeName} - ${coinName} average buy price:`, averageBuyPrice);
        }
      }
    }
  }

  async calculateRemainingQuantity(exchangeName: string) {
    const updatedExchangeData = this.getUpdatedExchangeData(exchangeName);
    this.calculateRemainingQuantityForExchange(exchangeName, updatedExchangeData);
  }

  calculateRemainingQuantityForExchange(exchangeName: string, updatedExchangeData: { [coinName: string]: any }) {
    // console.log(`Calculating remaining quantity for ${exchangeName}`);
    const coins = updatedExchangeData;

    for (const coinName in coins) {
      if (coins.hasOwnProperty(coinName)) {
        const buyTrades = coins[coinName].buyTrades;
        const sellTrades = coins[coinName].sellTrades;

        const totalBoughtQuantity = buyTrades.reduce((sum: any, trade: any) => sum + trade.Amount, 0);
        const totalSoldQuantity = sellTrades.reduce((sum: any, trade: any) => sum + trade.Amount, 0);

        const remainingQuantity = totalBoughtQuantity - totalSoldQuantity;

        coins[coinName].remainingQuantity = remainingQuantity;
        // console.log(`${exchangeName} - ${coinName} remaining quantity:`, remainingQuantity);
      }
    }
  }

  getExchangeData(exchangeName: string): any[] {
    switch (exchangeName) {
      case 'Binance':
        return this.exchangeData_Binance;
      case 'Bybit':
        return this.exchangeData_Bybit;
      case 'Mexc':
        return this.exchangeData_Mexc;
      case 'Kucoin':
        return this.exchangeData_Kucoin;
      case 'Gate':
        return this.exchangeData_Gate;
      default:
        return [];
    }
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj).map(key => key.toUpperCase());
  }
  getExchangeDataLength() {
    this.coinLength.Binance = this.getFilteredCoinsCount('Binance');
    this.coinLength.Bybit = this.getFilteredCoinsCount('Bybit');
    this.coinLength.Mexc = this.getFilteredCoinsCount('Mexc');
    this.coinLength.Kucoin = this.getFilteredCoinsCount('Kucoin');
    this.coinLength.Gate = this.getFilteredCoinsCount('Gate');
  }
  getFilteredCoinsCount(exchangeName: string): number {
    const updatedExchangeData = this.getUpdatedExchangeData(exchangeName);
    const count = this.calculateFilteredCount(this.selectedFilter, updatedExchangeData);
    // console.log(`Filtered coins count for ${exchangeName}:`, {
    //   filter: this.selectedFilter,
    //   count: count
    // });
    return count;
  }

  calculateFilteredCount(selectedFilter: number, updatedExchangeData: any): number {
    switch (selectedFilter) {
      case 1: // Show both (zero, non zero) coins
        return Object.keys(updatedExchangeData).length;
      case 2: // Show non zero quantity coins
        return Object.keys(updatedExchangeData)
          .filter(coinName => updatedExchangeData[coinName].remainingQuantity > 0)
          .length;
      case 3: // Show only zero quantity coins
        return Object.keys(updatedExchangeData)
          .filter(coinName => updatedExchangeData[coinName].remainingQuantity <= 0)
          .length;
      default:
        return 0;
    }
  }


  getBadgeValue(exchangeName: string): number {
    return this.coinLength[exchangeName];
  }
  // ----------------search functionality-----------

  // Update the options toggle method
  OnShowOptions(): void {
    this.show_options = !this.show_options;
    // Initialize filtered options when options are shown
    if (this.show_options) {
      this.filterOptions(this.searchCoin);
    }
  }

  // ... (rest of your existing code)

  setGlobalFilter(filter: number): void {
    this.selectedFilter = filter;
    this.getExchangeDataLength();
  }

  // Update the filtered data method to use global filter
  filteredExchangeData(): { [key: string]: any } {
    const lowercaseSearchCoin = this.searchCoin.toUpperCase();
    const allData: { [key: string]: any } = {};

    // Combine data from all selected exchanges
    this.selectedExchanges.forEach(exchangeName => {
      const exchangeData = this.getUpdatedExchangeData(exchangeName);
      Object.entries(exchangeData).forEach(([coinName, data]) => {
        const key = `${exchangeName}_${coinName}`;
        if (coinName.toUpperCase().includes(lowercaseSearchCoin)) {
          // Get the last trade date
          const allTrades = [...data.buyTrades, ...data.sellTrades];
          const lastTradeDate = allTrades.length > 0 
            ? Math.max(...allTrades.map(trade => new Date(trade.Date).getTime()))
            : 0;

          switch (this.selectedFilter) {
            case 1: // Show all
              allData[key] = {
                ...data,
                exchange: exchangeName,
                coinName,
                buyTrades: data.buyTrades.length,
                sellTrades: data.sellTrades.length,
                currentValue: data.averageBuyPrice * data.remainingQuantity,
                lastTradeDate
              };
              break;
            case 2: // Show holdings > 0
              if (data.remainingQuantity > 0) {
                allData[key] = {
                  ...data,
                  exchange: exchangeName,
                  coinName,
                  buyTrades: data.buyTrades.length,
                  sellTrades: data.sellTrades.length,
                  currentValue: data.averageBuyPrice * data.remainingQuantity,
                  lastTradeDate
                };
              }
              break;
            case 3: // Show holdings = 0
              if (data.remainingQuantity === 0) {
                allData[key] = {
                  ...data,
                  exchange: exchangeName,
                  coinName,
                  buyTrades: data.buyTrades.length,
                  sellTrades: data.sellTrades.length,
                  currentValue: data.averageBuyPrice * data.remainingQuantity,
                  lastTradeDate
                };
              }
              break;
          }
        }
      });
    });

    // Convert to array for sorting
    const sortedEntries = Object.entries(allData).sort((a, b) => {
      const [keyA, dataA] = a;
      const [keyB, dataB] = b;

      switch (this.sortBy) {
        case 'name-asc':
          return dataA.coinName.localeCompare(dataB.coinName);
        case 'name-desc':
          return dataB.coinName.localeCompare(dataA.coinName);
        case 'value-asc':
          return dataA.currentValue - dataB.currentValue;
        case 'value-desc':
          return dataB.currentValue - dataA.currentValue;
        case 'recent-trade':
          return dataB.lastTradeDate - dataA.lastTradeDate; // Most recent first
        case 'oldest-trade':
          return dataA.lastTradeDate - dataB.lastTradeDate; // Oldest first
        default:
          return 0;
      }
    });

    // Convert back to object
    const result = Object.fromEntries(sortedEntries);
    
    // Log the main display data
    // console.log('Main Display Data:', {
    //   selectedExchanges: this.selectedExchanges,
    //   filter: this.selectedFilter,
    //   sortBy: this.sortBy,
    //   searchTerm: this.searchCoin,
    //   totalCoins: Object.keys(result).length,
    //   data: Object.entries(result).map(([key, value]) => ({
    //     exchange: value.exchange,
    //     coin: value.coinName,
    //     averagePrice: value.averageBuyPrice,
    //     holdings: value.remainingQuantity,
    //     currentValue: value.currentValue,
    //     lastTraded: new Date(value.lastTradeDate).toLocaleString(),
    //     trades: {
    //       buy: value.buyTrades,
    //       sell: value.sellTrades
    //     }
    //   }))
    // });

    return result;
  }

  getTotalCoins(): number {
    return Object.keys(this.filteredExchangeData()).length;
  }

  getPaginatedCoins(): string[] {
    const allCoins = Object.keys(this.filteredExchangeData());
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return allCoins.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  //#endregion

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

      case 'Gate':
        this.router.navigate([
          'portfolio-Gate',
          'portfolio-Gate-sheets',
          'Gate-spot_trades',])

        break;


    }




  }

  onExchangeSelectionChange(): void {
    // Update allSelected state based on whether all exchanges are selected
    this.allSelected = this.selectedExchanges.length === this.exchangeNames.length;
    this.getExchangeDataLength();
  }

  openDetailsModal(exchangeName: string, coinName: string): void {
    const tradeData = this.filteredExchangeData()[`${exchangeName}_${coinName}`];
    this.dialog.open(TradeDetailsModalComponent, {
      data: {
        exchangeName,
        coinName,
        tradeData
      },
      panelClass: 'trade-details-modal'
    });
  }

  toggleAllExchanges(): void {
    // Always select all exchanges when clicking ALL, regardless of current state
    this.selectedExchanges = [...this.exchangeNames];
    this.allSelected = true;
    this.getExchangeDataLength();
  }

  setSorting(sort: string): void {
    this.sortBy = sort;
    this.currentPage = 0; // Reset to first page when sorting changes
  }

  // Add this method to check if all settings are at default
  isAtDefaultSettings(): boolean {
    // Check if all exchanges are selected
    const allExchangesSelected = this.selectedExchanges.length === this.exchangeNames.length;
    
    // Check if sorting is at default (name-asc)
    const defaultSorting = this.sortBy === 'name-asc';
    
    // Check if filter is at default (ALL - 1)
    const defaultFilter = this.selectedFilter === 1;
    
    // Return true only if all settings are at default
    return allExchangesSelected && defaultSorting && defaultFilter;
  }

  resetToDefault(): void {
    // Reset exchange selection
    this.selectedExchanges = [...this.exchangeNames];
    this.allSelected = true;

    // Reset sorting to Name (A-Z)
    this.sortBy = 'name-asc';

    // Reset filter to ALL
    this.selectedFilter = 1;

    // Reset pagination
    this.currentPage = 0;

    // Update data
    this.getExchangeDataLength();
  }

  // Add this method to get all available coins with their exchanges
  getAllCoinsWithExchanges(): Array<{coinName: string, exchange: string}> {
    const coins: Array<{coinName: string, exchange: string}> = [];
    
    // Use exchangeNames instead of selectedExchanges to always show all possibilities
    this.exchangeNames.forEach(exchangeName => {
      const exchangeData = this.getUpdatedExchangeData(exchangeName);
      Object.keys(exchangeData).forEach(coinName => {
        coins.push({
          coinName: coinName,
          exchange: exchangeName
        });
      });
    });
    
    return coins;
  }

  // Add this method to filter coins based on search input
  filterOptions(searchValue: string) {
    const allCoins = this.getAllCoinsWithExchanges();
    
    // Create a map to group coins with their exchanges
    const coinExchangeMap = new Map<string, Set<string>>();
    
    // Group coins by name and collect all exchanges for each coin
    allCoins.forEach(coin => {
      if (!coinExchangeMap.has(coin.coinName)) {
        coinExchangeMap.set(coin.coinName, new Set());
      }
      coinExchangeMap.get(coin.coinName)?.add(coin.exchange);
    });
    
    // Convert the map to array format needed for display
    let displayCoins = Array.from(coinExchangeMap.entries()).map(([coinName, exchanges]) => ({
      coinName,
      exchange: `(${Array.from(exchanges).sort().join(', ')})`  // Sort exchanges and wrap in parentheses
    }));
    
    // Sort by coin name
    displayCoins.sort((a, b) => a.coinName.localeCompare(b.coinName));
    
    if (!searchValue) {
      this.filteredOptions = displayCoins;
    } else {
      const filterValue = searchValue.toUpperCase();
      this.filteredOptions = displayCoins.filter(coin => 
        coin.coinName.toUpperCase().includes(filterValue)
      );
    }
  }

  // Add watcher for searchCoin changes
  onSearchChange(): void {
    this.filterOptions(this.searchCoin);
  }

  // Add this method to handle coin selection
  onCoinSelected(event: any): void {
    // When a coin is selected, we only use the coin name for searching
    this.searchCoin = event.option.value;
    // Reset to defaults after selecting a coin
    this.selectedExchanges = [...this.exchangeNames];
    this.allSelected = true;
    this.sortBy = 'name-asc';
    this.selectedFilter = 1;
    this.currentPage = 0;
    this.getExchangeDataLength();
    this.filterOptions(this.searchCoin);
  }
}