import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { DataService } from 'src/app/services/data.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import HighchartsExporting from 'highcharts/modules/exporting';
import * as Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsMore from 'highcharts/highcharts-more';

import { MatDialog } from '@angular/material/dialog';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { AddNewComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/add-new/add-new.component';
import { BybitAPIDemoService } from 'src/app/services/WorkingExchangeAPI/bybit-api-demo.service';
Highcharts3D(Highcharts);
HighchartsExporting(Highcharts);
HighchartsMore(Highcharts);

@Component({
  selector: 'app-portfolio-dashboard-bybit-futures-closed-pnl-demo',
  templateUrl: './portfolio-dashboard-bybit-futures-closed-pnl-demo.component.html',
  styleUrls: ['./portfolio-dashboard-bybit-futures-closed-pnl-demo.component.scss']
})
export class PortfolioDashboardBybitFuturesClosedPnlDemoComponent implements OnInit, OnDestroy {
 exchangeName: string = 'Bybit';
 sheetName: string = 'Futures_Closed_Pnl_Demo';

  IsMasterControlEnabled: boolean = false;

  pnlDataPerDay: { [key: string]: { pnl: number } } = {};
  pnlDataPerMonth: { [key: string]: { pnl: number } } = {};
  calendar: (Date | null)[][] = [];
  currentMonth: Date = new Date(); // Assuming you want current month initially
  currentMonthYear: string = ''; // Will be updated in ngOnInit
  currentYear: number = new Date().getFullYear(); // For monthly view

  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  showPnlPerDay: boolean = true; // Default to showing PNL per day
  showGoToCurrentButton: boolean = false; // Flag to show/hide the Go to Current button
  oldesMonthYear: any;



  futuresAccountInfo: any[] = [];
  IsFuturesAccountInfo: boolean = false;
  ClaimedBonus: any;
  futuresTransferInfo: any[] = []
  portfolioPnlInfo: any[] = [];

  constructor(
    private functionsServiceRef: FunctionsService,
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private dataServiceRef: DataService,
    private bybitAPIDemoServiceRef: BybitAPIDemoService,
    private _dialog: MatDialog,



  ) {
    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })
  }
  ngOnInit(): void {



      
        this.getTradeHistoryRealtime('BYBIT')

        // #region assets and transfers API
        Promise.all([

          this.functionsServiceRef.loadAllSheetData_WithoutMatTable(this.exchangeName, 'Futures_Transfer_Demo', 500, this.componentDestroyed$),
          this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', 1, this, this.componentDestroyed$)
        ]).then(([ sheetData_transferResponse,sheetData_SheetName]) => {

          //Handle sheetData response for Futures_Transfer


          if (sheetData_transferResponse) {
            this.futuresTransferInfo = sheetData_transferResponse;

          }

          // Handle sheetData response for Futures
          if (sheetData_SheetName) {
            if (this.orderHistoryRealtime) {
              this.checkForNewEntries();
            }
            this.oldesMonthYear = this.getOldestMonthAndYear(sheetData_SheetName)

            this.currentMonth = new Date();
            this.currentMonthYear = this.getMonthYear(this.currentMonth);

          }
          
     

          // Do something when all promises are resolved
          this.executeAfterPromiseMethods(this.exchangeName)







        }).catch(error => {
          console.error("Error in fetching data", error);
        });
        //#endregion



  }

  executeAfterPromiseMethods(exchangeName: string) {
    this.calculatePnlData();
    this.calculateColumnTotals();

    this.calculateTransferInfo(); // Call the new method to calculate totals

    this.calculatePortfolioPnlInfo()



    this.generateCalendar();
    this.render_TradesPNL();
    this.render_InfluencerPNL();
    this.render_TotalTrades();
    this.render_InfluencersTotalTrades();
    this.render_Transfers();
    this.render_TradingPair();


  
  }


  //#region Material Table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;

  private componentDestroyed$: Subject<void> = new Subject<void>();

  IsSelectedSheetDataLoaded: boolean = false;
  sheetData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pagesLoaded = 0;
  pageSizeOptions = 0;


  ngOnDestroy(): void {
    this.dataServiceRef.sendDestroyObservable(true);

    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', this.currentPage + 1, this, this.componentDestroyed$);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', this.currentPage - 1, this, this.componentDestroyed$);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //#endregion


  //#region  Pnl Calender

  calculatePnlData(): void {
    this.pnlDataPerDay = {}; // Clear previous data
    this.pnlDataPerMonth = {}; // Clear previous data

    this.sheetData.forEach(trade => {
      const Date_Creation = new Date(trade.Date_Creation);
      const dayKey = this.getDateKey(Date_Creation);
      const monthKey = this.getMonthKey(Date_Creation);

      if (!this.pnlDataPerDay[dayKey]) {
        this.pnlDataPerDay[dayKey] = { pnl: 0 };
      }
      if (!this.pnlDataPerMonth[monthKey]) {
        this.pnlDataPerMonth[monthKey] = { pnl: 0 };
      }

      this.pnlDataPerDay[dayKey].pnl += trade.Closed_Pnl;
      this.pnlDataPerMonth[monthKey].pnl += trade.Closed_Pnl;
    });
    
    console.log(`Pnl Data Per Day :`, this.pnlDataPerDay);
    console.log(`Pnl Data Per Month :`, this.pnlDataPerMonth);
    this.showGoToCurrentButton = this.shouldShowGoToCurrentButton();
  }

  shouldShowGoToCurrentButton(): boolean {
    const today = new Date();
    if (this.showPnlPerDay) {
      return this.currentMonth.getFullYear() !== today.getFullYear() ||
        this.currentMonth.getMonth() !== today.getMonth();
    } else {
      return this.currentYear !== today.getFullYear();
    }
  }


  generateCalendar(): void {
    if (this.showPnlPerDay) {
      const startOfMonth = new Date(this.currentMonth);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(this.currentMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      let date = new Date(startOfMonth);

      this.calendar = [];

      while (date <= endOfMonth) {
        const week: (Date | null)[] = [];

        for (let i = 0; i < 7; i++) {
          if (date >= startOfMonth && date <= endOfMonth) {
            week.push(new Date(date)); // Push a Date object
          } else {
            week.push(null); // Push null for days outside current month's range
          }

          date.setDate(date.getDate() + 1);
        }

        this.calendar.push(week);
      }
    } else {
      this.calendar = [];
      const months = Array.from({ length: 12 }, (_, i) => new Date(this.currentYear, i, 1));
      const weeks = [];
      for (let i = 0; i < months.length; i += 3) {
        weeks.push(months.slice(i, i + 3));
      }
      this.calendar = weeks;
    }
  }

  prevMonth(): void {
    if (this.showPnlPerDay) {
      this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
      this.currentMonthYear = this.getMonthYear(this.currentMonth);
    } else {
      this.currentYear -= 1;
    }
    this.calculatePnlData();
    this.generateCalendar();
  }

  nextMonth(): void {
    const today = new Date(); // Get current date

    if (this.showPnlPerDay) {
      // Check if next month is beyond current date
      if (this.currentMonth.getFullYear() === today.getFullYear() && this.currentMonth.getMonth() >= today.getMonth()) {
        return; // Do not allow navigation
      }

      this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
      this.currentMonthYear = this.getMonthYear(this.currentMonth);
    } else {
      // Check if next year is beyond current date
      if (this.currentYear >= today.getFullYear()) {
        return; // Do not allow navigation
      }

      this.currentYear += 1;
    }

    this.calculatePnlData();
    this.generateCalendar();
  }

  isNextDisabled(): boolean {
    const today = new Date(); // Get current date

    if (this.showPnlPerDay) {
      // Check if next month is beyond current date
      if (this.currentMonth.getFullYear() === today.getFullYear() && this.currentMonth.getMonth() >= today.getMonth()) {
        return true; // Disable next button
      }
    } else {
      // Check if next year is beyond current date
      if (this.currentYear >= today.getFullYear()) {
        return true; // Disable next button
      }
    }

    return false; // Enable next button
  }

  isPreDisabled(): boolean {
    const oldestDate = new Date(this.oldesMonthYear);
    const currentDate = new Date(this.currentMonthYear);



    if (this.showPnlPerDay) {
      return currentDate.getTime() <= oldestDate.getTime();
    } else {

      return this.currentYear <= oldestDate.getFullYear();
    }
  }

  togglePnlDisplay(boolean: boolean): void {
    this.showPnlPerDay = boolean

    this.generateCalendar();
  }
  goToCurrentDate(): void {
    this.currentMonth = new Date();
    this.currentMonthYear = this.getMonthYear(this.currentMonth);
    this.currentYear = new Date().getFullYear();
    this.calculatePnlData();
    this.generateCalendar();
  }


  getMonthYear(date: Date): string {
    return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  }

  getDateKey(date: Date): string {
    // Ensure the date is correctly formatted as yyyy-mm-dd
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getMonthKey(date: Date): string {
    // Ensure the date is correctly formatted as yyyy-mm
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  // Function to get the oldest month and year
  getOldestMonthAndYear(data: any[]): string {
    // Parse dates and sort the array by date

    const sortedData = data.map(item => ({
      ...item,
      Date_Creation: new Date(item.Date_Creation)
    })).sort((a, b) => a.Date_Creation - b.Date_Creation);

    // Get the oldest date
    const oldestDate = sortedData[0].Date_Creation;

    // Get the full month name and year
    const month = oldestDate.toLocaleString('default', { month: 'long' });
    const year = oldestDate.getFullYear();

    // Return combined string with space between month and year
    return `${month} ${year}`;
  }


  //#endregion

  // #region transfer calculation

  calculatedTransfersInfo: any[] = [];

  calculateTransferInfo() {
    const totalInAmount = this.futuresTransferInfo
      .filter((element: any) => (element.Amount > 0) && element.Type != 'IN_BONUS')
      .reduce((acc: number, element: any) => acc + parseFloat(element.Amount), 0)
      .toFixed(3);

    const totalOutAmount = this.futuresTransferInfo
      .filter((element: any) => element.Amount < 0)
      .reduce((acc: number, element: any) => acc + parseFloat(element.Amount), 0)
      .toFixed(3);


    this.calculatedTransfersInfo = [
      {
        totalInAmount: parseFloat(totalInAmount),
        totalOutAmount: parseFloat(totalOutAmount),

      }
    ];




  }
  // #endregion


  //#region accountPnlInfo

  calculatePortfolioPnlInfo() {
    const pnlTrades: number = parseFloat(this.columnTotals.Closed_Pnl);
    const transferInAmount: number = parseFloat(this.calculatedTransfersInfo[0].totalInAmount);
    const transferOutAmount: number = parseFloat(this.calculatedTransfersInfo[0].totalOutAmount);
    const seedMoney: number = (transferOutAmount >= transferInAmount) ? 0 : (Math.abs(transferInAmount) + Math.abs(this.ClaimedBonus)) - Math.abs(transferOutAmount);


    let accountsPnl: number = 0;

    if (seedMoney >= 0) {
      // Case 1: Remain amount is positive or zero
      accountsPnl = seedMoney + pnlTrades;
    } else {
      // Case 2: Remain amount is negative (more transferred out than in)
      accountsPnl = pnlTrades;
    }

    // Round accountsPnl to 3 decimal places
    accountsPnl = parseFloat(accountsPnl.toFixed(3));

    // Format dates to "YYYY-mm-dd hh-mm-ss" 24-hour format with '-' instead of '/'
    const formatDate = (date: Date | null): string => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };



    this.portfolioPnlInfo = [{

      transferInAmount: transferInAmount.toFixed(3),
      transferOutAmount: transferOutAmount.toFixed(3),
      seedMoney: seedMoney.toFixed(3),
      pnlTrades: (pnlTrades).toFixed(3),
      portfolioPnlCalculated: accountsPnl.toFixed(3),
      // totalEquity: this.futuresAccountInfo[0].equity.toFixed(3)
    }];

  }




  //#endregion


  //#region newOrder



  // ----------------New ORder--------------STARTS
  private orderHistoryRealtime: any;

  async getTradeHistoryRealtime(exchangeName: string) {



    const category = 'limit';
    const limit = 1000
    try {

      // --------------
      if (exchangeName.toUpperCase() === 'BYBIT') {


        const tradeHistory = await this.bybitAPIDemoServiceRef.getClosedPnl_Bybit('linear', 1000);

        if (tradeHistory) {


          const orderHistoryRealtime_temp = tradeHistory.map((element: any) => {
            const formatDate = (timestamp: string) => {
              const myDate = new Date(parseInt(timestamp))
              return `${myDate.getFullYear()}-${(myDate.getMonth() + 1).toString().padStart(2, '0')}-${myDate.getDate().toString().padStart(2, '0')} ${myDate.getHours().toString().padStart(2, '0')}:${myDate.getMinutes().toString().padStart(2, '0')}:${myDate.getSeconds().toString().padStart(2, '0')}`;

            }

            const formattedCreatedTime = formatDate(element.createdTime);
            const formattedUpdateTime = formatDate(element.updatedTime);

            return {
              ...element,
              createdTime: formattedCreatedTime,
              updatedTime: formattedUpdateTime,
              // positionType: element.positionType == 1 ? 'BUY' : element.positionType == 2 ? 'SELL' : 'error changing positionType',
              side: element.side == 'Sell' ? 'BUY' : element.side == 'Buy' ? 'SELL' : 'error changing side',


              openType: element.openType == 1 ? 'Market' : element.openType == 2 ? 'Limit' : 'error changing openType',

              symbol: element.symbol.replace('_USDT', ''),  // Update the symbol
              closedSize: this.dataServiceRef.getStaticSymbolContractValue(element.closedSize, element.symbol),


            };

          });

          this.orderHistoryRealtime = orderHistoryRealtime_temp
            .sort((a: any, b: any) => {
              const timeA = new Date(a.updatedTime).getTime();
              const timeB = new Date(b.updatedTime).getTime();
              return timeB - timeA;
            });

        }

      }
      // -----------------

    }
    catch (error) {
      // Handle errors here if needed
      console.error('Error in fetching trade history:', error);
    }
  }

  orderHistoryRealtime_NotSaved: any[] = [];

  IsNewOrder: boolean = false;

  checkForNewEntries() {

    this.IsNewOrder = false;
    const newUniqueTrades = [];

    // Iterate through orderHistoryRealtime
    for (const order of this.orderHistoryRealtime) {
      const createdTime = order.createdTime;

      // Check if the trade is unique
      const isPresentInSheetData = this.sheetData.some(
        (sheetTrade) => sheetTrade.Date_Creation === createdTime
      );





      if (!isPresentInSheetData) {
        // Add the trade to the NewOrders array
        newUniqueTrades.push(order);
      }
    }

    // Add a new entry to orderHistoryRealtime_NotSaved
    this.orderHistoryRealtime_NotSaved.push({
      ExchangeName: this.exchangeName, // Set your predefined value here
      SheetName: this.sheetName,    // Set your predefined value here
      NewOrders: newUniqueTrades,
    });
    this.dataServiceRef.updateOrderHistory(this.orderHistoryRealtime_NotSaved);

    this.IsNewOrder = true;

  }
  // ----------------New ORder--------------ENDS



  //#endregion






  // #region Calculating Trading Pairs and Trade Count 

  columnTotals: any = {
    Closed_Pnl: 0,
    MostFrequentTradingPair: 'NONE',
    HighestCount: 0,
    MostTradedDirection: 'NONE',
    MostTradedDirectionTrades: 0,
    BuyDirectionCount: 0,
    SellDirectionCount: 0,
    TotalProfit: 0,
    TotalLoss: 0,
    TotalLossTrades: 0,
    TotalProfitTrades: 0,
    TotalBuyTrades: 0,
    TotalSellTrades: 0,
    TotalTrades: 0,
    tradingPairDetails: {},
    influencerPNL: {}
  }

  tradingPairCounts: { [key: string]: number } = {};
  tradingPairDetailsKeys: string[] = [];
  expandedPair: string | null = null;

  startIndex = 0;
  endIndex = 0;
  rowsToShow = 5;
  showAll = false;

  calculateColumnTotals() {
    let buyCount = 0;
    let sellCount = 0;

    const uniqueInfluencers = new Set<string>();

    // Initialize totals
    this.sheetData.forEach((element: any) => {

      if (element.Influencer) {
        uniqueInfluencers.add(element.Influencer);
      }

      if (element.Closed_Pnl) {
        this.columnTotals.Closed_Pnl += element.Closed_Pnl;
      }

      const tradingPair = element.Contracts;
      if (!this.columnTotals.tradingPairDetails[tradingPair]) {
        this.columnTotals.tradingPairDetails[tradingPair] = {
          profitTrades: 0,
          lossTrades: 0,
          totalProfit: 0,
          totalLoss: 0,
          totalPnl: 0,
          totalTrades: 0,
          totalBuyTrades: 0,
          totalSellTrades: 0
        };
      }

      if (element.Closed_Pnl > 0) {
        this.columnTotals.TotalProfit += element.Closed_Pnl;
        this.columnTotals.TotalProfitTrades++;
        this.columnTotals.tradingPairDetails[tradingPair].profitTrades++;
        this.columnTotals.tradingPairDetails[tradingPair].totalProfit += element.Closed_Pnl;
      } else if (element.Closed_Pnl <= 0) {
        this.columnTotals.TotalLoss += element.Closed_Pnl;
        this.columnTotals.TotalLossTrades++;
        this.columnTotals.tradingPairDetails[tradingPair].lossTrades++;
        this.columnTotals.tradingPairDetails[tradingPair].totalLoss += element.Closed_Pnl;
      }

      this.columnTotals.tradingPairDetails[tradingPair].totalPnl =
        this.columnTotals.tradingPairDetails[tradingPair].totalProfit +
        this.columnTotals.tradingPairDetails[tradingPair].totalLoss;

      if (element.Opening_Direction == 'BUY') {
        buyCount++;
        this.columnTotals.TotalBuyTrades = buyCount;
        this.columnTotals.tradingPairDetails[tradingPair].totalBuyTrades++;
      } else if (element.Opening_Direction == 'SELL') {
        sellCount++;
        this.columnTotals.TotalSellTrades = sellCount;
        this.columnTotals.tradingPairDetails[tradingPair].totalSellTrades++;
      }

      this.columnTotals.tradingPairDetails[tradingPair].totalTrades++;

      // Calculate most frequent trading pair
      if (this.tradingPairCounts[tradingPair]) {
        this.tradingPairCounts[tradingPair]++;
      } else {
        this.tradingPairCounts[tradingPair] = 1;
      }
    });



    // Initialize influencerPNL with unique influencers
    uniqueInfluencers.forEach((influencer) => {
      this.columnTotals.influencerPNL[influencer] = {
        totalProfit: 0,
        totalLoss: 0,
        totalPnl: 0
      };
    });

    // Calculate profit and loss for each influencer
    this.sheetData.forEach((element: any) => {
      const influencer = element.Influencer;
      if (element.Closed_Pnl > 0) {
        this.columnTotals.influencerPNL[influencer].totalProfit += element.Closed_Pnl;
      } else if (element.Closed_Pnl < 0) {
        this.columnTotals.influencerPNL[influencer].totalLoss += element.Closed_Pnl;
      }

      // Calculate totalPnl for the influencer
      this.columnTotals.influencerPNL[influencer].totalPnl =
        this.columnTotals.influencerPNL[influencer].totalProfit +
        this.columnTotals.influencerPNL[influencer].totalLoss;


    });




    this.columnTotals.TotalTrades = this.columnTotals.TotalBuyTrades + this.columnTotals.TotalSellTrades;
    this.columnTotals.BuyDirectionCount = buyCount;
    this.columnTotals.SellDirectionCount = sellCount;

    if (buyCount > sellCount) {
      this.columnTotals.MostTradedDirection = 'BUY/LONG';
      this.columnTotals.MostTradedDirectionTrades = buyCount;
    } else if (sellCount > buyCount) {
      this.columnTotals.MostTradedDirection = 'SELL/SHORT';
      this.columnTotals.MostTradedDirectionTrades = sellCount;
    } else if (sellCount == buyCount) {
      this.columnTotals.MostTradedDirection = 'All Equal';
      this.columnTotals.MostTradedDirectionTrades = 0;
    }

    // Find the most frequent trading pair
    for (const tradingPair in this.tradingPairCounts) {
      if (this.tradingPairCounts[tradingPair] > this.columnTotals.HighestCount) {
        this.columnTotals.MostFrequentTradingPair = tradingPair;
        this.columnTotals.HighestCount = this.tradingPairCounts[tradingPair];
      }
    }

    // Check if all trading pairs have equal frequency
    const equalFrequencies = Object.values(this.tradingPairCounts).every(
      (count) => count === this.columnTotals.HighestCount
    );

    // Handle the condition where all pairs are equal
    if (equalFrequencies) {
      this.columnTotals.MostFrequentTradingPair = 'All Equal';
    }
    this.tradingPairDetailsKeys = Object.keys(this.columnTotals.tradingPairDetails);
    this.endIndex = this.tradingPairDetailsKeys.length
    this.updateDisplayedPairs();

  }


  toggleDetails(pair: string) {
    if (this.expandedPair === pair) {
      this.expandedPair = null; // Collapse if already expanded
    } else {
      this.expandedPair = pair; // Expand clicked row
    }
  }


  showNextRows() {
    this.startIndex += this.rowsToShow;
    this.updateDisplayedPairs();
  }

  showPrevRows() {
    this.startIndex -= this.rowsToShow;
    this.updateDisplayedPairs();
  }

  showAllRows() {
    this.showAll = !this.showAll;
    this.startIndex = 0; // Reset start index to show all rows from beginning
    this.updateDisplayedPairs();
  }
  rowsLength: number = 0
  // Update the displayed trading pairs with sorting
  private updateDisplayedPairs() {
    this.tradingPairDetailsKeys = Object.keys(this.columnTotals.tradingPairDetails);

    // Sort tradingPairDetailsKeys based on totalPnl in ascending order
    this.tradingPairDetailsKeys.sort((a, b) => {
      return this.columnTotals.tradingPairDetails[b].totalPnl - this.columnTotals.tradingPairDetails[a].totalPnl;
    });

    if (!this.showAll) {
      this.tradingPairDetailsKeys = this.tradingPairDetailsKeys.slice(this.startIndex, this.startIndex + this.rowsToShow);
    }
  }


  //#endregion


  //#region  Add New

  IsAddDialogOpened: boolean = false;

  openAddNewEntryDialogForm() {
    this.IsAddDialogOpened = true;

    if (!this.IsMasterControlEnabled) {
      if (!this.IsMasterControlEnabled) {

        const dialogRef = this._dialog.open(MasterControlComponent, {
          disableClose: false,
          hasBackdrop: true
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {


            const dialogRef = this._dialog.open(AddNewComponent, {
              data: { ExchangeName: this.exchangeName, SheetName: this.sheetName },

              disableClose: false, // Prevent the dialog from closing on click outside
              hasBackdrop: false, // Allow interaction with the underlying page
            });

            dialogRef.afterClosed().subscribe(result => {
              this.IsAddDialogOpened = false

              // Handle any data returned from the dialog if needed
              // console.log('Dialog was closed with result:', result);
            });
          }
        })

      }
    }

    else {

      const dialogRef = this._dialog.open(AddNewComponent, {
        data: { ExchangeName: this.exchangeName, SheetName: this.sheetName },

        disableClose: false, // Prevent the dialog from closing on click outside
        hasBackdrop: false, // Allow interaction with the underlying page
      });

      dialogRef.afterClosed().subscribe(result => {
        this.IsAddDialogOpened = false

        // Handle any data returned from the dialog if needed
        // console.log('Dialog was closed with result:', result);
      });

    }
  }



  //#endregion




  //#region  Charts

  //high charts
  Highcharts: typeof Highcharts = Highcharts

  // chartOptions_Assets!: Highcharts.Options;//ColoumnChart
  chartOptions_PNL!: Highcharts.Options;//ColoumnChart

  // chartOptions_TradeDirection!: Highcharts.Options;//PieChart
  chartOptions_TradingPairs!: Highcharts.Options;//PieChart
  chartOptions_InfluencerPNL!: Highcharts.Options;//PieChart

  chartOptions_TotalTradesChart!: Highcharts.Options;//ColoumnChart
  chartOptions_InfluencersTotalTrades !: Highcharts.Options;//BarChart
  chartOptions_FuturesTransfers!: Highcharts.Options;//ColumnChart



  //#region trading Pairs Chart
  render_TradingPair() {
    // Extract trading pairs and their total trades from tradingPairDetails
    const tradingPairs = Object.keys(this.columnTotals.tradingPairDetails);
    const totalTrades = tradingPairs.map(pair => this.columnTotals.tradingPairDetails[pair].totalTrades);

    // Prepare the pie data
    const pieData = tradingPairs.map((pair, index) => [pair, totalTrades[index]]);

    // Update the chart options
    this.chartOptions_TradingPairs = {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
        }
      },
      title: {
        text: '',
        align: 'left'
      },
      tooltip: {
        pointFormat: '{point.y} Trades'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          innerSize: '50%', // This makes it a donut chart
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Trades',
          data: pieData
        }
      ]
    };

    // Log the chart data for debugging
  }




  //#endregion


  // #region trades pnl




  render_TradesPNL() {
    const Pnl = parseFloat((this.columnTotals.Closed_Pnl).toFixed(3));
    const Profit = parseFloat((this.columnTotals.TotalProfit).toFixed(3));
    const Loss = parseFloat((this.columnTotals.TotalLoss).toFixed(3));

    this.chartOptions_PNL = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 70,
          viewDistance: 25 // Adjust the view distance for better perspective
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Profit Loss (USDT)'
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
        enabled: false
      },
      plotOptions: {
        column: {
          // depth: 35,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            color: 'white',
            inside: true,
            style: {
              textOutline: 'none' // Remove shadow/outline
            }
          }
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color: {point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
      },
      series: [
        {
          type: 'column',
          name: 'P/L',
          colorByPoint: true,
          data: [
            {
              name: `<span style="color: ${Pnl < 0 ? '#fa4b42' : '#00e272'}">PNL</span>`,
              y: Pnl,
              drilldown: 'PNL',
              color: Pnl < 0 ? '#fa4b42' : '#00e272'
            },
            {
              name: '<span style="color :#00e272 ;">PROFIT</span>',
              y: Profit,
              drilldown: 'PROFIT',
              color: '#00e272'
            },
            {
              name: '<span style="color : #fa4b42;">LOSS</span>',
              y: Loss,
              drilldown: 'LOSS',
              color: '#fa4b42'
            }
          ]
        }
      ]
    };
  }




  //#endregion






  //#region  render bar for influencer_PNL


  render_InfluencerPNL() {
    // Prepare the data for each influencer
    const influencers = Object.keys(this.columnTotals.influencerPNL);
    let seriesData = influencers.map(influencer => {
      const totalPnl = parseFloat(this.columnTotals.influencerPNL[influencer].totalPnl.toFixed(2));
      const totalProfit = parseFloat(this.columnTotals.influencerPNL[influencer].totalProfit.toFixed(2));
      const totalLoss = parseFloat(this.columnTotals.influencerPNL[influencer].totalLoss.toFixed(2));
      const color = totalPnl >= 0 ? '#00e272' : '#fa4b42'; // Green for profit, red for loss

      return {
        name: influencer,
        y: totalPnl,
        color: color,
        fullName: influencer, // Store full name for use in tooltip
        totalProfit: totalProfit,
        totalLoss: totalLoss
      };
    });

    // Sort seriesData by y value (totalPnl) in descending order
    seriesData = seriesData.sort((a, b) => b.y - a.y);

  // Update the categories to match the sorted order
  const sortedInfluencers = seriesData.map(data => {
    return data.name.length > 10 ? data.name.substring(0, 9) + '...' : data.name;
  });

    // Calculate min and max values with additional space

    this.chartOptions_InfluencerPNL = {
      chart: {
        type: 'bar',
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: sortedInfluencers.map(name => name.substring(0, 9) + '..'),
        title: {
          text: 'Influencers'
        },
        
        labels: {
          formatter: function () {
            const point = seriesData.find(data => data.name === this.value);
            const color = point ? point.color : '#000000'; // Default to black if no color found
            return `<span style="color: ${color}">${this.value}</span>`;
          },
          style: {
            fontSize: '9px' // Adjust the font size here
          }
        }
      },
      yAxis: {
        min: Math.min(...seriesData.map(d => d.y)) - 1,
        max: Math.max(...seriesData.map(d => d.y)) + 1,
        title: {
          text: 'USDT',
          margin: 20
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
        }],
      
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'black',
            textOutline: 'none'
          }
        },
        labels: {
          formatter: function () {
            return this.value !== null ? this.value.toString() : '';
          }
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        bar: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
            formatter: function () {
              return this.y ? this.y.toFixed(3) : '';
            },
            style: {
              textOutline: 'none',
              color: 'black'
            }
          },
          maxPointWidth: 40 // Set the maximum width for the bars
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormatter: function () {
          const point = this as any; // Use type assertion
          return `<span style="color: ${point.color}">${point.fullName}</span>: <br>PNL: ${point.y.toFixed(3)}<br>Profit: ${point.totalProfit}<br>Loss: ${point.totalLoss}`;
        }
      },
      series: [{
        type: 'bar',
        name: 'Influencer PNL (USDT)',
        data: seriesData
      }]
    };
    
  }











  //#endregion



  //#region rendertrades bar graph count 



  render_TotalTrades() {


    this.chartOptions_TotalTradesChart = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 70,
          viewDistance: 25 // Adjust the view distance for better perspective
        }
      },

      // title: {
      //   align: 'center',
      //   text: '<span class="text-muted">P/L</span>',
      //   useHTML: true

      // },
      title: {
        text: ''
      },

      xAxis: {
        type: 'category',

      },
      yAxis: {
        title: {
          text: 'Trades Count',
          margin: 20 // Add margin to the y-axis title

        },

      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            color: 'white',
            inside: true,
            style: {
              textOutline: 'none' // Remove shadow/outline
            }
          },
          
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color: {point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
      },
      series: [
        {
          type: 'column',
          name: 'P/L',
          colorByPoint: true,
          data: [
            {
              name: `<span style="color:#2caffe">Total</span>`,
              y: this.columnTotals.TotalTrades,
              drilldown: 'Total',
              color: '#2caffe'
            },
            {
              name: '<span style="color :#00e272 ;">BUY/LONG</span>',
              y: this.columnTotals.TotalBuyTrades,
              drilldown: 'BUY/LONG',
              color: '#00e272'


            },
            {
              name: '<span style="color : #fa4b42;">SELL/SHORT</span>',
              y: this.columnTotals.TotalSellTrades,
              drilldown: 'SELL/SHORT',
              color: '#fa4b42'

            },
          ]
        }
      ]
    };

  }



  //#endregion
  //#region  render bar chart for Influencer_TotalTrades


  render_InfluencersTotalTrades() {
    // Extract unique influencers
    const uniqueInfluencers = Array.from(new Set(this.sheetData.map(trade => trade.Influencer)));

    // Prepare the data for each influencer
    let seriesData = uniqueInfluencers.map(influencer => {
      const influencerTrades = this.sheetData.filter(trade => trade.Influencer === influencer);

      const totalBuyTrades = influencerTrades.filter(trade => trade.Opening_Direction === 'BUY').length;
      const totalSellTrades = influencerTrades.filter(trade => trade.Opening_Direction === 'SELL').length;
      const totalProfitableTrades = influencerTrades.filter(trade => trade.Closed_Pnl > 0).length;
      const totalLostTrades = influencerTrades.filter(trade => trade.Closed_Pnl < 0).length;

      let barColor = '#2caffe'; // Default color
      if (totalBuyTrades < totalSellTrades) {
        barColor = '#00e272';
      } else if (totalBuyTrades > totalSellTrades) {
        barColor = '#fa4b42';
      }

      return {
        name: influencer,
        y: influencerTrades.length,
        color: barColor,
        totalBuyTrades: totalBuyTrades,
        totalSellTrades: totalSellTrades,
        totalProfitableTrades: totalProfitableTrades,
        totalLostTrades: totalLostTrades
      };
    });

    // Sort seriesData by total trades in descending order
    seriesData = seriesData.sort((a, b) => b.y - a.y);

    // Update the categories to match the sorted order
    const sortedInfluencers = seriesData.map(data => data.name);

    this.chartOptions_InfluencersTotalTrades = {
      chart: {
        type: 'bar',
        // spacingBottom: 50,
        // spacingTop: 50,
      },
      title: {
        text: '',

      },
      xAxis: {
        categories: sortedInfluencers.map(name => name.substring(0, 9) + '..'),
        title: {
          text: 'Influencers',

        },
        labels: {
          style: {
            fontSize: '9px'
          }
        }
      },
      yAxis: {
        min: 0,
        max: Math.max(...seriesData.map(d => d.y)) + 1, // Add extra space above the highest value
        title: {
          text: 'Trades',
          margin: 20 // Add margin to the y-axis title

        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'black',
            textOutline: 'none'
          }
        },
        labels: {
          formatter: function () {
            return this.value !== null ? this.value.toString() : '';
          }
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        bar: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
            formatter: function () {
              return this.y ? this.y.toFixed(3) : '';
            },
            style: {
              textOutline: 'none',
              color: `black`
            }
          },
          maxPointWidth: 40 // Set the maximum width for the bars

        }
      },
      tooltip: {
        headerFormat: '',
        pointFormatter: function () {
          const point = this as any; // Use type assertion
          // return `
          //   <span style="color: ${point.color}">${point.name}</span>:<br>
          //   <span style="color: green">Buy Trades:</span> <span style="color: green">${point.totalBuyTrades}</span><br>
          //   <span style="color: red">Sell Trades:</span> <span style="color: red">${point.totalSellTrades}</span><br>
          //   <span style="color: green">Profitable Trades:</span> <span style="color: green">${point.totalProfitableTrades}</span><br>
          //   <span style="color: red">Lost Trades:</span> <span style="color: red">${point.totalLostTrades}</span>`;
          return `<span style="color: ${point.color}">${point.name}</span>:<br>
        Buy Trades: <span style="color: #00e272c4">${point.totalBuyTrades}</span><br>
        Sell Trades:<span style="color: #fa4b42cf">${point.totalSellTrades}</span><br>
        Profitable Trades: <span style="color: #00e272c4">${point.totalProfitableTrades}</span><br>
        Lost Trades: <span style="color: #fa4b42cf">${point.totalLostTrades}</span>`;
        }
      },
      series: [{
        type: 'bar',
        name: 'Total Trades',
        data: seriesData
      }]
    };
  }




  //#endregion



  //#region Transfer Chart


  render_Transfers() {


    if (!this.futuresTransferInfo || this.futuresTransferInfo.length === 0) {
      return;
    }

    // Flatten the nested array into a single array of transfer info objects
    const transferInfo = this.futuresTransferInfo.flat();

    // Sort transferInfo by updateTime in ascending order (oldest to newest)
    transferInfo.sort((a, b) => {
      return new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime();
    });

    // Initialize variables for total amounts

    let totalInAmount = 0;
    let totalOutAmount = 0;

    // Iterate through transferInfo to calculate total amounts
    transferInfo.forEach(transfer => {
      if (transfer.Amount < 0) {
        totalOutAmount += transfer.Amount;
      } else if (transfer.Amount > 0) {
        totalInAmount += transfer.Amount;
      }
    });



    // Determine colors based on conditions
    let outColor = this.ClaimedBonus > totalInAmount ? '#00e272c4' : '#FF6347'; // Yellow or Red based on comparison

    // Prepare data for the pie chart with colors
    const pieData = [
      // { name: 'Bonus', y: this.ClaimedBonus, color: outColor },
      { name: 'IN', y: totalInAmount, color: '#00e272' }, // Green color for Transfer IN
      { name: 'OUT', y: Math.abs(totalOutAmount), color: '#FF6347' }
    ];

    // Update the chart options for the pie chart
    this.chartOptions_FuturesTransfers = {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 30,
          beta: 10
        }
      },
      title: {
        text: ''
      },
      tooltip: {
        formatter: function () {
          if (this.point) {
            return `<b>${this.point.name}</b>: ${this.y?.toFixed(2)} USDT (${this.percentage?.toFixed(1)}%)`;
          }
          return '';
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35, // Add depth to the pie chart
          size: '75%', // Control the overall size of the pie chart
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y:.2f} USDT'
          },
          showInLegend: true
        }
      },
      series: [{
        type: 'pie',
        name: 'Amount',
        data: pieData
      }]
    };
  }





  //#endregion


  //#endregion

}
