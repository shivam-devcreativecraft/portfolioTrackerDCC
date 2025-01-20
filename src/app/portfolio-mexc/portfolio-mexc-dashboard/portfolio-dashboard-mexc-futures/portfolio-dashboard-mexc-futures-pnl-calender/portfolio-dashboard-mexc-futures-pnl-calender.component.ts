import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { MexcAPIService } from 'src/app/services/WorkingExchangeAPI/mexcAPI.service';
import { DataService } from 'src/app/services/data.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import HighchartsExporting from 'highcharts/modules/exporting';
import * as Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsMore from 'highcharts/highcharts-more';
Highcharts3D(Highcharts);
HighchartsExporting(Highcharts);
HighchartsMore(Highcharts);



@Component({
  selector: 'app-portfolio-dashboard-mexc-futures-pnl-calender',
  templateUrl: './portfolio-dashboard-mexc-futures-pnl-calender.component.html',
  styleUrls: ['./portfolio-dashboard-mexc-futures-pnl-calender.component.scss']
})
export class PortfolioDashboardMexcFuturesPnlCalenderComponent implements OnInit, OnDestroy {
  exchangeName: string = 'Mexc';
  sheetName: string = 'Futures';


  pnlDataPerDay: { [key: string]: { pnl: number } } = {};
  pnlDataPerMonth: { [key: string]: { pnl: number } } = {};
  calendar: (Date | null)[][] = [];
  currentMonth: Date = new Date(); // Assuming you want current month initially
  currentMonthYear: string = ''; // Will be updated in ngOnInit
  currentYear: number = new Date().getFullYear(); // For monthly view

  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  showPnlPerDay: boolean = true; // Default to showing PNL per day
  showGoToCurrentButton: boolean = false; // Flag to show/hide the Go to Current button



  futuresAccountInfo: any[] = [];
  IsFuturesAccountInfo: boolean = false;
  ClaimedBonus: number = 14.84318
  futuresTransferInfo: any[] = []
  accountsPnlInfo: any[] = [];

  constructor(
    private functionsServiceRef: FunctionsService,
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private dataServiceRef: DataService,
    private mexcAPIServiceRef: MexcAPIService


  ) {

  }
  ngOnInit(): void {

    this.getTradeHistoryRealtime('MEXC')



    // #region assets and transfers API
    Promise.all([
      this.mexcAPIServiceRef.getAccountMexcFutures(),
      this.mexcAPIServiceRef.getTransferRecordsMexcFutures(),
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', 1, this, this.componentDestroyed$)
    ]).then(([accountResponse, transferResponse, sheetData]) => {
      // Handle account response
      if (accountResponse) {
        accountResponse.forEach((element: any) => {
          if (element.currency === 'USDT') {
            this.futuresAccountInfo.push(element);
          }
        });
        this.IsFuturesAccountInfo = true;
      }

      // Handle transfer response
      if (transferResponse) {
        const futuresTransferInfo_temp = transferResponse.resultList
          .map((element: any) => {
            const formatDate = (timestamp: string) => {
              const myDate = new Date(parseInt(timestamp));
              return `${myDate.getFullYear()}-${(myDate.getMonth() + 1).toString().padStart(2, '0')}-${myDate.getDate().toString().padStart(2, '0')} ${myDate.getHours().toString().padStart(2, '0')}:${myDate.getMinutes().toString().padStart(2, '0')}:${myDate.getSeconds().toString().padStart(2, '0')}`;
            };

            const formattedCreatedTime = formatDate(element.createTime);
            const formattedUpdateTime = formatDate(element.updateTime);

            return {
              ...element,
              createTime: formattedCreatedTime,
              updateTime: formattedUpdateTime,
            };
          })
          .filter((element: any) => {
            const updateTimeThreshold = new Date("2024-06-24 23:27:24").getTime();
            const elementUpdateTime = new Date(element.updateTime).getTime();
            return elementUpdateTime >= updateTimeThreshold && element.currency === "USDT";
          });

        // Populate futuresTransferInfo with sorted data
        this.futuresTransferInfo = futuresTransferInfo_temp.sort((a: any, b: any) => {
          const timeA = new Date(a.updateTime).getTime();
          const timeB = new Date(b.updateTime).getTime();
          return timeB - timeA;
        });

        // Add the static entry
        const staticEntry_ClamiedBonus = {
          id: "146048816_Bonus",
          txid: "f639e36053b74269816a2c4433879409_Bonus",
          currency: "USDT",
          amount: 14.84318,
          type: "IN",
          state: "SUCCESS",
          createTime: "2024-06-27 04:16:48",
          updateTime: "2024-06-27 04:16:48"
        };


        // test static entry
        // const staticEntry_test = {
        //   id: "146048816",
        //   txid: "f639e36053b74269816a2c4433879409",
        //   currency: "USDT",
        //   amount: 30.341,
        //   type: "OUT",
        //   state: "SUCCESS",
        //   createTime: "2024-06-27 04:16:48",
        //   updateTime: "2024-06-27 04:16:48"
        // };


        this.futuresTransferInfo.push(staticEntry_ClamiedBonus);
        // this.futuresTransferInfo.push(staticEntry_test);



      }

      // Handle sheetData response
      if (sheetData) {
        if (this.orderHistoryRealtime) {
          this.checkForNewEntries();
        }

        this.currentMonth = new Date();
        this.currentMonthYear = this.getMonthYear(this.currentMonth);

      }

      // Do something when all promises are resolved

      this.calculatePnlData();
      this.calculateColumnTotals();
      this.calculateTransferInfo(); // Call the new method to calculate totals
      this.calculateAccountsPnlInfo()
      this.generateCalendar();
      this.render_AccountBalance();
      this.render_accountsPnl();
      this.render_Transfers();
      this.render_TradesPNL();
      this.render_TotalTrades();
      this.render_TradingPair();








    }).catch(error => {
      console.error("Error in fetching data", error);
    });
    //#endregion













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
      const closeDate = new Date(trade.Close_Date);
      const dayKey = this.getDateKey(closeDate);
      const monthKey = this.getMonthKey(closeDate);

      if (!this.pnlDataPerDay[dayKey]) {
        this.pnlDataPerDay[dayKey] = { pnl: 0 };
      }
      if (!this.pnlDataPerMonth[monthKey]) {
        this.pnlDataPerMonth[monthKey] = { pnl: 0 };
      }

      this.pnlDataPerDay[dayKey].pnl += trade.Pnl_USDT;
      this.pnlDataPerMonth[monthKey].pnl += trade.Pnl_USDT;
    });
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

  //#endregion

  // #region transfer calculation

  calculatedTransfersInfo: any[] = [];

  calculateTransferInfo() {
    const totalInAmount = this.futuresTransferInfo
      .filter((element: any) => element.type === 'IN')
      .reduce((acc: number, element: any) => acc + parseFloat(element.amount), 0)
      .toFixed(3);

    const totalOutAmount = this.futuresTransferInfo
      .filter((element: any) => element.type === 'OUT')
      .reduce((acc: number, element: any) => acc + parseFloat(element.amount), 0)
      .toFixed(3);

    const remainAmount = (parseFloat(totalInAmount) - parseFloat(totalOutAmount)).toFixed(3);
    // const remainAmountPercentage = ((parseFloat(remainAmount) / parseFloat(totalInAmount)) * 100).toFixed(3);
    const pnlTrades = this.columnTotals.Pnl_USDT

    this.calculatedTransfersInfo = [
      {
        totalInAmount: parseFloat(totalInAmount),
        totalOutAmount: parseFloat(totalOutAmount),
        totalBonusAmount: (this.ClaimedBonus),
        // remainAmount: parseFloat(remainAmount),
        // remainAmountPercentage: parseFloat(remainAmountPercentage),
        gainedProfit: pnlTrades
      }
    ];
    // console.log('futuresTransferInfo : ', this.futuresTransferInfo);
    // console.log('futuresAccountInfo : ', this.futuresAccountInfo);

    // console.log('calculatedTransfersInfo : ', this.calculatedTransfersInfo)



  }
  // #endregion


  //#region accountPnlInfo

  calculateAccountsPnlInfo() {
    const pnlTrades: number = parseFloat(this.columnTotals.Pnl_USDT);
    const transferInAmount: number = parseFloat(this.calculatedTransfersInfo[0].totalInAmount);
    const transferOutAmount: number = parseFloat(this.calculatedTransfersInfo[0].totalOutAmount);
    const remainAmount: number = (transferOutAmount >= transferInAmount) ? 0 : transferInAmount - transferOutAmount;
    // const 
    // Initialize oldestDate and latestDate with null explicitly
    let oldestDate: Date | null = null;
    let latestDate: Date | null = null;

    // Iterate through futuresTransferInfo to find oldest and latest dates
    this.futuresTransferInfo.forEach((transfer) => {
      const updateTime = new Date(transfer.updateTime);

      if (!oldestDate || updateTime < oldestDate) {
        oldestDate = updateTime;
      }
      if (!latestDate || updateTime > latestDate) {
        latestDate = updateTime;
      }
    });

    let accountsPnl: number = 0;

    if (remainAmount >= 0) {
      // Case 1: Remain amount is positive or zero
      accountsPnl = remainAmount + pnlTrades;
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

    const oldestDateString = formatDate(oldestDate);
    const latestDateString = formatDate(latestDate);

    this.accountsPnlInfo = [{
      oldestDate: oldestDateString,
      latestDate: latestDateString,
      transferInAmount: transferInAmount.toFixed(3),
      transferOutAmount: transferOutAmount.toFixed(3),
      remainAmount: remainAmount.toFixed(3),
      pnlTrades: (pnlTrades).toFixed(3),
      accountsPnlCalculated: accountsPnl.toFixed(3),
      totalEquity: this.futuresAccountInfo[0].equity.toFixed(3)
    }];

    // console.log(this.accountsPnlInfo);
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
      if (exchangeName.toUpperCase() === 'MEXC') {


        const tradeHistory = await this.mexcAPIServiceRef.getPositionHistoryMexcFutures();

        if (tradeHistory) {
          // console.log(tradeHistory)


          const orderHistoryRealtime_temp = tradeHistory.map((element: any) => {
            const formatDate = (timestamp: string) => {
              const myDate = new Date(parseInt(timestamp))
              return `${myDate.getFullYear()}-${(myDate.getMonth() + 1).toString().padStart(2, '0')}-${myDate.getDate().toString().padStart(2, '0')} ${myDate.getHours().toString().padStart(2, '0')}:${myDate.getMinutes().toString().padStart(2, '0')}:${myDate.getSeconds().toString().padStart(2, '0')}`;

            }

            const formattedCreatedTime = formatDate(element.createTime);
            const formattedUpdateTime = formatDate(element.updateTime);

            return {
              ...element,
              createTime: formattedCreatedTime,
              updateTime: formattedUpdateTime,
              positionType: element.positionType == 1 ? 'BUY' : element.positionType == 2 ? 'SELL' : 'error changing positionType',
              openType: element.openType == 1 ? 'Market' : element.openType == 2 ? 'Limit' : 'error changing openType',

              symbol: element.symbol.replace('_USDT', ''),  // Update the symbol
              closeVol: this.dataServiceRef.getStaticSymbolContractValue(element.closeVol, element.symbol),


            };

          });

          this.orderHistoryRealtime = orderHistoryRealtime_temp
            .sort((a: any, b: any) => {
              const timeA = new Date(a.updateTime).getTime();
              const timeB = new Date(b.updateTime).getTime();
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
      const updateTime = order.updateTime;

      // Check if the trade is unique
      const isPresentInSheetData = this.sheetData.some(
        (sheetTrade) => sheetTrade.Close_Date === updateTime
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
    // console.log("Trade history closed pnl bybit/futures (not saved)", this.orderHistoryRealtime_NotSaved)

    this.IsNewOrder = true;

    // console.log("New Unique Trades to Save (orderHistoryRealtime_NotSaved) : ",this.orderHistoryRealtime_NotSaved);
  }
  // ----------------New ORder--------------ENDS



  //#endregion






  // #region Calculating Trading Pairs and Trade Count 

  columnTotals: any = {
    Pnl_USDT: 0,
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
    tradingPairDetails: {}
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

    // Initialize totals
    this.sheetData.forEach((element: any) => {
      if (element.Pnl_USDT) {
        this.columnTotals.Pnl_USDT += element.Pnl_USDT;
      }

      const tradingPair = element.Trading_Pair;
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

      if (element.Pnl_USDT > 0) {
        this.columnTotals.TotalProfit += element.Pnl_USDT;
        this.columnTotals.TotalProfitTrades++;
        this.columnTotals.tradingPairDetails[tradingPair].profitTrades++;
        this.columnTotals.tradingPairDetails[tradingPair].totalProfit += element.Pnl_USDT;
      } else if (element.Pnl_USDT <= 0) {
        this.columnTotals.TotalLoss += element.Pnl_USDT;
        this.columnTotals.TotalLossTrades++;
        this.columnTotals.tradingPairDetails[tradingPair].lossTrades++;
        this.columnTotals.tradingPairDetails[tradingPair].totalLoss += element.Pnl_USDT;
      }

      this.columnTotals.tradingPairDetails[tradingPair].totalPnl =
        this.columnTotals.tradingPairDetails[tradingPair].totalProfit +
        this.columnTotals.tradingPairDetails[tradingPair].totalLoss;

      if (element.Direction == 'BUY') {
        buyCount++;
        this.columnTotals.TotalBuyTrades = buyCount;
        this.columnTotals.tradingPairDetails[tradingPair].totalBuyTrades++;
      } else if (element.Direction == 'SELL') {
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

  // isPrevDisabled_tradingPairTable() {
  //   return this.startIndex === 0;
  // }

  // isNextDisabled_tradingPairTable() {
  //   if (this.showAll) {
  //     return true;
  //   } else {
  //     return this.startIndex + this.rowsToShow >= this.tradingPairDetailsKeys.length;
  //   }
  // }
  //#endregion



  //#region  Charts
  //high charts
  Highcharts: typeof Highcharts = Highcharts

  chartOptions_Assets!: Highcharts.Options;//ColoumnChart
  chartOptions_PNL!: Highcharts.Options;//ColoumnChart

  chartOptions_TradeDirection!: Highcharts.Options;//PieChart
  chartOptions_TradingPairs!: Highcharts.Options;//PieChart
  chartOptions_TotalTradesChart!: Highcharts.Options;//ColoumnChart
  chartOptions_FuturesTransfers!: Highcharts.Options;//ColumnChart
  chartOptions_AccountsPnl!: Highcharts.Options;//ColumnChart





  // #region Account Balance Chart 
  render_AccountBalance() {
    const Equity = parseFloat((this.futuresAccountInfo[0].equity).toFixed(3));
    const AvailableMargin = parseFloat((this.futuresAccountInfo[0].availableBalance).toFixed(3));
    const PositionMargin = parseFloat((this.futuresAccountInfo[0].positionMargin).toFixed(3));
    this.chartOptions_Assets = {
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
          margin: 20,
          text: 'Accounts Balance'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          depth: 70, // Increase the depth of the columns
          dataLabels: {
            enabled: true,
            inside: true,
            formatter: function (this: Highcharts.PointLabelObject) {
              if (this && this.y !== undefined && this.y !== null) {
                let textColor = this.y > 0 ? 'white' : 'white';
                return `<span style="color: ${textColor}">${this.y}</span>`;
              }
              return null;
            },
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
          data: [

            {
              name: `<span style="color: ${Equity < 0 ? '#fa4b42' : '#00e272'}">Total Equity</span>`,
              y: Equity,
              drilldown: 'Total Equity',
              color: Equity < 0 ? '#fa4b42' : '#00e272'
            },
            {
              name: '<span style="color :#00e272c4 ;">Available Margin</span>',
              y: AvailableMargin,
              drilldown: 'Available Margin',
              color: '#00e272c4'
            },
            {
              name: `<span style="color: ${PositionMargin <= 0 ? '#212529BF' : '#00E272A3'}">Position Margin</span>`,
              y: PositionMargin,
              drilldown: 'Position Margin',
              color: PositionMargin <= 0 ? '#212529BF' : '#00E272A3'
            },
          ]
        }
      ]
    };
  }

  //#endregion


  //#region  AccountPnl


  render_accountsPnl() {
    // Extract data for the chart
    // const oldestDate = new Date(this.accountsPnlInfo[0].oldestDate).getTime(); // Convert oldestDate to timestamp
    // const latestDate = new Date(this.accountsPnlInfo[0].latestDate).getTime(); // Convert latestDate to timestamp
    const remainAmount = parseFloat(this.accountsPnlInfo[0].remainAmount);
    const accountsPnlCalculated = parseFloat(this.accountsPnlInfo[0].accountsPnlCalculated);

    // Calculate percentage difference
    const percentageDifference = parseFloat((((accountsPnlCalculated - remainAmount) / Math.abs(remainAmount)) * 100).toFixed(3));

    // Calculate amount difference
    const amountDifference = parseFloat((accountsPnlCalculated - remainAmount).toFixed(3));

    this.chartOptions_AccountsPnl = {
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
          margin: 20,
          text: 'Portfolio PNL'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          depth: 70, // Increase the depth of the columns
          dataLabels: {
            enabled: true,
            inside: true,
            formatter: function (this: Highcharts.PointLabelObject) {
              if (this && this.y !== undefined && this.y !== null) {
                let textColor = this.y > 0 ? 'white' : 'white';
                return `<span style="color: ${textColor}">${this.y}</span>`;
              }
              return null;
            },
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
          data: [
            {
              name: `<span style="color: ${remainAmount < 0 ? '#fa4b42' : '#2caffe'}">Seed Money</span>`,
              y: remainAmount,
              drilldown: 'remain',
              color: remainAmount < 0 ? '#fa4b42' : '#2caffe'
            },
            {
              name: '<span style="color :#50B498 ;">Acc. Balance</span>',
              y: accountsPnlCalculated,
              drilldown: 'accountsPnlCalculated',
              color: '#50B498'
            },
            {
              name: '<span style="color :#00e272 ;">Pnl</span>',
              y: amountDifference,
              drilldown: 'Pnl',
              color: amountDifference < 0 ? '#fa4b42' : '#00e272'
            },
            {
              name: '<span style="color :#00e272c4 ;">Percentage</span>',
              y: percentageDifference,
              drilldown: 'Percentage',
              color: percentageDifference < 0 ? '#fa4b42' : '#00e272c4'
            },
          ]
        }
      ]
    };
  }


  //#endregion



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
    const Pnl = parseFloat((this.columnTotals.Pnl_USDT).toFixed(3));
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
              name: '<span style="color :#00e272c4 ;">PROFIT</span>',
              y: Profit,
              drilldown: 'PROFIT',
              color: '#00e272c4'
            },
            {
              name: '<span style="color : #fa4b42cf;">LOSS</span>',
              y: Loss,
              drilldown: 'LOSS',
              color: '#fa4b42cf'
            }
          ]
        }
      ]
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
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Trades Count)'
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
              name: `<span style="color:#2caffe">Total</span>`,
              y: this.columnTotals.TotalTrades,
              drilldown: 'Total',
              color: '#2caffe'
            },
            {
              name: '<span style="color :#00e272c4 ;">BUY/LONG</span>',
              y: this.columnTotals.TotalBuyTrades,
              drilldown: 'BUY/LONG',
              color: '#00e272c4'
            },
            {
              name: '<span style="color : #fa4b42cf;">SELL/SHORT</span>',
              y: this.columnTotals.TotalSellTrades,
              drilldown: 'SELL/SHORT',
              color: '#fa4b42cf'
            },
          ]
        }
      ]
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
      if (transfer.type === 'OUT') {
        totalOutAmount += transfer.amount;
      } else if (transfer.type === 'IN') {
        totalInAmount += transfer.amount;
      }
    });

    // Determine colors based on conditions
    let outColor = this.ClaimedBonus > totalInAmount ? '#00e272c4' : '#FF6347'; // Yellow or Red based on comparison

    // Prepare data for the pie chart with colors
    const pieData = [
      { name: 'Bonus', y: this.ClaimedBonus, color: outColor },
      { name: 'IN', y: totalInAmount, color: '#00e272' }, // Green color for Transfer IN
      { name: 'OUT', y: totalOutAmount, color: '#50B498' }
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
