import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { BinanceAPIService } from 'src/app/services/WorkingExchangeAPI/binanceAPI.service';
import { MexcAPIService } from 'src/app/services/WorkingExchangeAPI/mexcAPI.service';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
declare const TradingView: any;



import HighchartsExporting from 'highcharts/modules/exporting';
import * as Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsMore from 'highcharts/highcharts-more';
import { AddNewComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/add-new/add-new.component';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { MatDialog } from '@angular/material/dialog';
Highcharts3D(Highcharts);
HighchartsExporting(Highcharts);
HighchartsMore(Highcharts);

@Component({
  selector: 'app-portfolio-freebitco-dashboard',
  templateUrl: './portfolio-freebitco-dashboard.component.html',
  styleUrls: ['./portfolio-freebitco-dashboard.component.scss']
})
export class PortfolioFreebitcoDashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  exchangeName: string = 'Freebitco';
  private componentDestroyed$: Subject<void> = new Subject<void>();

  IsMasterControlEnabled: boolean = false;
  IsSelectedSheetDataLoaded_Fun_Buying: boolean = false;
  IsSelectedSheetDataLoaded_Premium: boolean = false;
  IsSelectedSheetDataLoaded_Money_Flow: boolean = false;
  IsSelectedSheetDataLoaded_Bonus: boolean = false;




  sheetData_Money_Flow: any[] = [];
  sheetData_Fun_Buying: any[] = [];
  sheetData_Premium: any[] = [];
  sheetData_Bonus: any = [];




  // IsColumnTotal_Money_Flow_Loaded: boolean = false;
  // IsColumnTotal_Fun_Buying_Loaded: boolean = false;
  // IsColumnTotal_Premium_Loaded: boolean = false;

  oldesMonthYear: any;
  IsAllPromiseColumnsTotalDataLoaded: boolean = false;
  IsAllColumnsTotalCalcuated: boolean = false;

  constructor(
    private functionsServiceRef: FunctionsService,
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private dataServiceRef: DataService,
    private binanceAPIService: BinanceAPIService,
    private cdr: ChangeDetectorRef,
    private _dialog: MatDialog,



  ) {
    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })
  }


  ngOnInit(): void {

    this.getWsDataBasedOnUrl()


    this.binanceAPIService.getPrice('FUN').subscribe((response: any) => {

      this.Price_FUNUSDT_API = Number(response.price)

      this.cdr.detectChanges(); // Trigger change detection

      if (this.columnTotals_Fun_Buying.Price_FUNUSDT_API) {
        this.IsCoumnDataPresent_Funbuying_After_Fun_Price = true;
      }

    })






    Promise.all([
      this.functionsServiceRef.loadAllSheetData_WithoutMatTable(this.exchangeName, 'Fun_Buying', 500, this.componentDestroyed$),
      this.functionsServiceRef.loadAllSheetData_WithoutMatTable(this.exchangeName, 'Premium', 500, this.componentDestroyed$),
      this.functionsServiceRef.loadAllSheetData_WithoutMatTable(this.exchangeName, 'Money_Flow', 500, this.componentDestroyed$),
      this.functionsServiceRef.loadAllSheetData_WithoutMatTable(this.exchangeName, 'Bonus', 500, this.componentDestroyed$),


    ]).then(([sheetData_Fun_Buying, sheetData_Premium, sheetData_Money_Flow, sheetData_Bonus]) => {

      if (sheetData_Money_Flow) {
        this.sheetData_Money_Flow = sheetData_Money_Flow;
        this.IsSelectedSheetDataLoaded_Money_Flow = true;
        this.calculateColumnTotals_Money_Flow();
        // this.IsColumnTotal_Money_Flow_Loaded = true;


      }
      if (sheetData_Fun_Buying) {
        this.sheetData_Fun_Buying = sheetData_Fun_Buying;
        this.IsSelectedSheetDataLoaded_Fun_Buying = true;
        this.oldesMonthYear = this.getOldestMonthAndYear(this.sheetData_Fun_Buying)
        this.calculateColumnTotals_Fun_Buying();
        // this.IsColumnTotal_Fun_Buying_Loaded = true;
      }


      if (sheetData_Premium) {
        this.sheetData_Premium = sheetData_Premium;
        this.IsSelectedSheetDataLoaded_Premium = true;
        this.calculateStakingTotals();
        // this.IsColumnTotal_Premium_Loaded = true;


      }

      if (sheetData_Bonus) {
        // Transform the data
        this.sheetData_Bonus = sheetData_Bonus.map(entry => {
          const startDate = entry.Start_Date ? entry.Start_Date.split(',') : [];
          const endDate = entry.End_Date ? entry.End_Date.split(',') : [];
          const investedRewards = entry.Invested_Rewards ? entry.Invested_Rewards.split(',') : [];
          const types = entry.Type ? entry.Type.split(',') : [];
          const bonus = entry.Bonus ? entry.Bonus.split(',') : [];

          // Dynamically map Invested_Rewards and Bonus to types
          const investedRewardsMapped = types.reduce((acc: any, type: any, index: any) => {
            acc[type] = parseInt(investedRewards[index]) || 0;
            return acc;
          }, {});
          const bonusMapped = types.reduce((acc: any, type: any, index: any) => {
            acc[type] = parseInt(bonus[index]) || 0;
            return acc;
          }, {});
          const transformedEntry = {
            ...entry,
            Start_Date: startDate,
            End_Date: endDate,
            Invested_Rewards: investedRewardsMapped,
            Type: types,
            Bonus: bonusMapped,
            Rewarded_Rewards: {
              BTC: entry.Rewarded_BTC || 0,
              FUN: entry.Rewarded_FUN || 0,
              RP: entry.Rewarded_RP || 0
            },
            Rolls: {
              Expected: entry.Expected_ROLLS || 0,
              Achieved: entry.Achieved_ROLLS || 0
            },
            Dates: types.reduce((acc: any, type: any, index: any) => {
              acc[type] = {
                Starts: startDate[index] || '',
                Ends: endDate[index] || ''
              };
              return acc;
            }, {}),
            RP_Bonus: entry.RP_Bonus ? parseInt(entry.RP_Bonus) : 0,
            Fun_Sell_Price: entry.Fun_Sell_Price ? parseInt(entry.Fun_Sell_Price) : 0
          };

          // Delete the specified keys
          delete transformedEntry.Rewarded_BTC;
          delete transformedEntry.Rewarded_FUN;
          delete transformedEntry.Rewarded_RP;
          delete transformedEntry.Expected_ROLLS;
          delete transformedEntry.Achieved_ROLLS;
          delete transformedEntry.Start_Date;
          delete transformedEntry.End_Date;

          return transformedEntry;
        });

        // Sort the data by Dates.Starts of the first available type
        this.sheetData_Bonus.sort((a: any, b: any) => {
          const dateA = new Date(a.Dates[Object.keys(a.Dates)[0]].Starts);
          const dateB = new Date(b.Dates[Object.keys(b.Dates)[0]].Starts);
          return dateA.getTime() - dateB.getTime();
        });



        this.IsSelectedSheetDataLoaded_Bonus = true;
      }





      this.IsAllPromiseColumnsTotalDataLoaded = true;


      this.showTickerTapeWidget()


      // Do something when all promises are resolved

      this.render_Total_Columnstotal();
      this.render_Premium_InvestedEarnings_Realtime();
      this.render_Premium_InvestedEarnings_Net();
      //#region Transaction Calender
      this.goToCurrentDate()
      this.calculateBoughtData();
      this.generateCalendar();
      //#endregion
      this.render_MoneyFlow_Flow();
      this.render_MoneyFlow_Avg_Price();
      this.render_Bonus_InvestedEarnedRewards_Total()
      this.render_Bonus_InvestedEarnedRewards()



    }).catch((error => {
      console.error("Error in fetching data", error);

    }))


  }

  ngOnDestroy(): void {
    this.dataServiceRef.sendDestroyObservable(true);

    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  ngAfterViewInit(): void {

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
          "description": "FUN/USDT",
          "proName": "BINANCE:FUNUSDT"
        },
        {
          "description": "BTC/USDT",
          "proName": "BINANCE:BTCUSDT"
        },
        {
          "description": "ETHUSDT",
          "proName": "BINANCE:ETHUSDT"
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

  //#region Fun_Buying

  IsCoumnDataPresent_Funbuying_After_Fun_Price: boolean = false;
  Price_FUNUSDT_API: number = 0;
  columnTotals_Fun_Buying: any = {
    Amount_BTC: 0,
    Amount_FUN: 0,
    Amount_USDT: 0,
    Avg_Price_FUNBTC: 0.0,
    Price_FUNUSDT_API: 0.0


  };

  calculateColumnTotals_Fun_Buying() {
    this.IsCoumnDataPresent_Funbuying_After_Fun_Price = false;
    this.sheetData_Fun_Buying.forEach((element: any) => {
      // Convert satoshis to BTC
      const btcAmount = element.Cost / 100000000;

      // Add to columnTotals_Fun_Buying
      this.columnTotals_Fun_Buying.Amount_FUN += element.Amount;
      this.columnTotals_Fun_Buying.Amount_BTC += btcAmount;

      this.columnTotals_Fun_Buying.Avg_Price_FUNBTC = this.calculateAverageSATPerFUN();
      this.columnTotals_Fun_Buying.Amount_USDT = this.Price_FUNUSDT_API * this.columnTotals_Fun_Buying.Amount_FUN
      this.columnTotals_Fun_Buying.Price_FUNUSDT_API = this.Price_FUNUSDT_API




      // let totalCost_BTC;
      // totalCost_BTC += element.

    });







  }


  calculateAverageSATPerFUN(): number {
    let totalSAT = 0;
    let totalFUN = 0;

    // Calculate total SAT and total FUN
    this.sheetData_Fun_Buying.forEach(entry => {
      totalSAT += entry.Cost;
      totalFUN += entry.Amount;
    });
    // Calculate average SAT per FUN
    const averageSATPerFUN = ((totalSAT / 100000000) / (totalFUN))

    return averageSATPerFUN;
  }





  //#region  amount Calender
  transactionDataPerDay: { [key: string]: { amount: number } } = {};
  transactionDataPerMonth: { [key: string]: { amount: number } } = {};
  calendar: (Date | null)[][] = [];
  currentMonth: Date = new Date(); // Assuming you want current month initially
  currentMonthYear: string = ''; // Will be updated in ngOnInit
  currentYear: number = new Date().getFullYear(); // For monthly view

  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  showTransactionPerDay: boolean = false; // Default to showing amount per day



  calculateBoughtData(): void {
    this.transactionDataPerDay = {}; // Clear previous data
    this.transactionDataPerMonth = {}; // Clear previous data

    this.sheetData_Fun_Buying.forEach(transaction => {
      const date = new Date(transaction.Date);
      const dayKey = this.getDateKey(date);
      const monthKey = this.getMonthKey(date);

      if (!this.transactionDataPerDay[dayKey]) {
        this.transactionDataPerDay[dayKey] = { amount: 0 };
      }
      if (!this.transactionDataPerMonth[monthKey]) {
        this.transactionDataPerMonth[monthKey] = { amount: 0 };
      }

      this.transactionDataPerDay[dayKey].amount += transaction.Amount;
      this.transactionDataPerMonth[monthKey].amount += transaction.Amount;
    });

  }


  generateCalendar(): void {
    if (this.showTransactionPerDay) {
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
    // this.checkPrevButtonDisabled()

  }

  prevMonth(): void {
    if (this.showTransactionPerDay) {
      this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
      this.currentMonthYear = this.getMonthYear(this.currentMonth);
    } else {
      this.currentYear -= 1;
    }
    // console.log('new : ', this.currentMonthYear, this.currentMonth)



    this.calculateBoughtData();
    this.generateCalendar();
  }

  nextMonth(): void {
    const today = new Date(); // Get current date

    if (this.showTransactionPerDay) {
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

    this.calculateBoughtData();
    this.generateCalendar();
  }

  isNextDisabled(): boolean {
    const today = new Date(); // Get current date

    if (this.showTransactionPerDay) {
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

    if (this.showTransactionPerDay) {
      return currentDate.getTime() <= oldestDate.getTime();
    } else {

      return this.currentYear <= oldestDate.getFullYear();
    }
  }




  togglePnlDisplay(boolean: boolean): void {
    this.showTransactionPerDay = boolean

    this.generateCalendar();
  }
  goToCurrentDate(): void {
    this.currentMonth = new Date();
    this.currentMonthYear = this.getMonthYear(this.currentMonth);
    this.currentYear = new Date().getFullYear();
    this.calculateBoughtData();
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
      Date: new Date(item.Date)
    })).sort((a, b) => a.Date - b.Date);

    // Get the oldest date
    const oldestDate = sortedData[0].Date;

    // Get the full month name and year
    const month = oldestDate.toLocaleString('default', { month: 'long' });
    const year = oldestDate.getFullYear();

    // Return combined string with space between month and year
    return `${month} ${year}`;
  }


  // Get the oldest month and year



  //#endregion




  //#endregion


  //#region  WebSocket

  private webSocketRef: WebSocket | undefined;
  prevPrice: number = 0;
  currentPrice: number = 0;
  priceMap: Map<string, { currentPrice: number; prevPrice: number }> = new Map();

  WSData: any[] = []; // Declare WSData as a global property


  // Define a map to store prices for each trading pair


  async getWsDataBasedOnUrl() {
    const tradingPair = 'fun';
    const url = `wss://stream.binance.com:9443/ws/${tradingPair.toLowerCase()}usdt@aggTrade`;

    // this.priceMap.set(tradingPair, {
    //   currentPrice: 0,
    //   prevPrice: 0,
    // });

    this.webSocketRef = new WebSocket(url);

    this.webSocketRef.onmessage = (event) => {
      const currentPrice = JSON.parse(event.data).p;

      this.prevPrice = this.currentPrice;
      this.currentPrice = currentPrice;
      this.Price_FUNUSDT_API = currentPrice; // Update the price variable
      this.prevPrice = this.prevPrice
      this.currentPrice = this.currentPrice
      // console.log(this.prevPrice, this.currentPrice)
      this.cdr.detectChanges(); // Trigger change detection
    };

    this.webSocketRef.onerror = (event) => {
      // Handle error if needed
    };




  }

  getUSDTVaue() {
    return this.currentPrice > 0 ? this.currentPrice * this.columnTotals_Fun_Buying.Amount_FUN : this.columnTotals_Fun_Buying.Amount_FUN * this.Price_FUNUSDT_API
  }
  getPriceColour(pair?: string): boolean {
    // const priceInfo = this.priceMap.get(TradingPair);
    if (this.currentPrice > this.prevPrice) return true;
    else return false;
  }



  //#endregion


  //#region Money_Flow
  columnTotals_Money_Flow: any = {
    TotalDeposit: 0,
    TotalWithdraw: 0,
    AvgDepositPrice: 0,
    AvgWithdrawPrice: 0,
    Exchanges: {
      Deposite: '',
      Withdraw: ''
    }
  };



  calculateColumnTotals_Money_Flow() {


    let depositCount = 0;
    let withdrawCount = 0;
    let totalDepositPrice = 0;
    let totalWithdrawPrice = 0;
    let depositExchanges: string[] = [];
    let withdrawExchanges: string[] = [];



    this.sheetData_Money_Flow.forEach((element: any) => {
      if (element.Type.toUpperCase() == 'DEPOSIT') {
        this.columnTotals_Money_Flow.TotalDeposit += element.Quantity;
        totalDepositPrice += element.Price;
        depositExchanges.push(element.Exchange);
        depositCount++;


      } else if (element.Type.toUpperCase() == 'WITHDRAW') {
        this.columnTotals_Money_Flow.TotalWithdraw += element.Quantity;
        totalWithdrawPrice += element.Price;
        withdrawExchanges.push(element.Exchange)
        withdrawCount++;


      }

    });





    this.columnTotals_Money_Flow.AvgDepositPrice = depositCount > 0 ? totalDepositPrice / depositCount : 0;
    this.columnTotals_Money_Flow.AvgWithdrawPrice = withdrawCount > 0 ? totalWithdrawPrice / withdrawCount : 0;


    // Remove duplicate exchanges and convert to comma-separated string
    const uniqueDepositExchanges = [...new Set(depositExchanges)];
    const uniqueWithdrawExchanges = [...new Set(withdrawExchanges)];

    this.columnTotals_Money_Flow.Exchanges.Deposit = uniqueDepositExchanges.join(', ');
    this.columnTotals_Money_Flow.Exchanges.Withdraw = uniqueWithdrawExchanges.join(', ');


    // this.columnTotals_Premium.TotalBalance =
    //   this.columnTotals_Premium.TotalDeposit - this.columnTotals_Premium.TotalWithdraw;
  }




  //#endregion


  //#region  Premium
  dataToRender: any[] = [];

  columnTotals_Premium: any = {
    TotalInvested: 0,
    TotalEarnings: 0,
    TotalRealizedMaturity: 0,
    TotalUnRealizedMaturity: 0
  };

  columnTotals_Premium_Total: any = {
    TotalInvested: 0,
    TotalEarnings: 0,
    TotalRealized: 0,
    TotalUnRealized: 0
  }

  calculateStakingTotals() {
    // console.log(this.sheetData);
    // Initialize the dataToRender array with the same structure for each element
    this.dataToRender = this.sheetData_Premium.map(() => ({
      Invested: 0,
      Earnings: 0,
      MaturityPeriod: 0,
      MaturityAPY: 0.00,
      UnRealizedMaturity: 0,
      RealizedMaturity: 0,
      UcomingMaturityDate: '',
      StartingDate: '',
      Expires_Date: '',
      Status: '',
    }));

    this.sheetData_Premium.forEach((element: any, index: number) => {
      // Add to dataToRender
      this.dataToRender[index].Invested = element.Principal;
      this.dataToRender[index].Earnings = element.Maturity;
      this.dataToRender[index].StartingDate = element.Date;
      this.dataToRender[index].Expires_Date = element.Expires_Date;
      this.dataToRender[index].Status = element.Status;
      this.dataToRender[index].MaturityPeriod = element.Days;
      this.dataToRender[index].MaturityAPY = element.APY;
      if (element.Status == 'Matured') {
        this.dataToRender[index].RealizedMaturity = element.Earning;
      } else if (element.Status == 'Un-Matured') {
        this.dataToRender[index].UnRealizedMaturity = element.Earning;
        this.dataToRender[index].UcomingMaturityDate = element.Expires_Date;
      }
    });

    // Sort dataToRender based on StartingDate in descending order
    this.dataToRender.sort((a, b) => {
      const dateA = new Date(a.Expires_Date).getTime();
      const dateB = new Date(b.Expires_Date).getTime();
      return dateB - dateA; // Descending order
    });

    this.calculateColumnTotals_Premium()

    // console.log("ColumnTotal : ", this.dataToRender);
  }

  calculateColumnTotals_Premium() {
    this.dataToRender.forEach((ele: any) => {

      this.columnTotals_Premium.TotalInvested += ele.Invested;
      this.columnTotals_Premium.TotalEarnings += ele.Earnings;
      this.columnTotals_Premium.TotalRealizedMaturity += ele.RealizedMaturity;
      this.columnTotals_Premium.TotalUnRealizedMaturity += ele.UnRealizedMaturity
    })

    this.calculateColumnTotals_Premium_Total();

  }

  calculateColumnTotals_Premium_Total() {
    this.dataToRender.forEach((element: any) => {

      this.columnTotals_Premium_Total.TotalInvested += element.Invested;
      this.columnTotals_Premium_Total.TotalEarnings += element.Earnings;
      this.columnTotals_Premium_Total.TotalRealized += element.RealizedMaturity;
      this.columnTotals_Premium_Total.TotalUnRealized += element.UnRealizedMaturity;


    });
  }

  //#endregion


  // #region TotalStats

  get get_earningsRealizedMaturity() {
    return this.dataToRender.reduce((acc, element) => acc + element.RealizedMaturity, 0);
  }
  get get_earningsUnrealizedMaturity() {
    return this.dataToRender.reduce((acc, element) => acc + element.UnRealizedMaturity, 0);
  }
  showAll = false;
  expandedIndex: number | null = null;

  get get_dataToRender() {
    if (this.showAll) {
      return this.dataToRender;
    }
    return this.dataToRender.slice(0, 3);
  }

  toggleDetails(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
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
              data: { ExchangeName: 'Freebitco', SheetName: 'Fun_Buying' },
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
        data: { ExchangeName: 'Freebitco', SheetName: 'Fun_Buying' },
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
  convertSatToBtc(satoshis: number, decimalPlaces: number = 8): string {
    // Convert Satoshis to Bitcoin
    const bitcoin = satoshis / 100000000;
  
    // Format the result to the specified number of decimal places without scientific notation
    return bitcoin.toLocaleString('en-US', { 
      minimumFractionDigits: decimalPlaces, 
      maximumFractionDigits: decimalPlaces 
    });
  }
  

  //#region  Charts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions_MoneyFlow_Flow!: Highcharts.Options;//ColumnChart
  chartOptions_MoneyFlow_Avg_Price!: Highcharts.Options;//ColumnChart
  chartOptions_Premium_InvestedEarnings_Net!: Highcharts.Options;//bar
  chartOptions_Premium_InvestedEarnings_Curr!: Highcharts.Options;//bar
  chartOptions_TotalStats!: Highcharts.Options;//bar
  chartOptions_Bonus_InvestedRewards_Total!: Highcharts.Options;//columnChart
  chartOptions_Bonus_InvestedRewards!: Highcharts.Options;//columnChart



  //#region MoneyFlow

  render_MoneyFlow_Flow() {
    const totalDeposits = parseFloat(this.columnTotals_Money_Flow.TotalDeposit);
    const totalWithdraw = parseFloat(this.columnTotals_Money_Flow.TotalWithdraw);


    this.chartOptions_MoneyFlow_Flow = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 10,
          beta: -10,
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
          text: 'FUN Quantity'
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
        enabled: true // Enable legend
      },
      plotOptions: {
        column: {
          depth: 50, // Increase the depth of the columns
          // pointWidth: 40, // Adjust the width of the columns
          pointWidth: 55, // Minimum width for the columns
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              textOutline: 'none', // Remove shadow/outline
              color: 'white'
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
          name: 'Deposits', // Legend name for deposits
          type: 'column',
          color: '#52BE80',
          data: [
            {
              name: `<span style="color:#52BE80">Deposits</span>`,
              y: totalDeposits,
              drilldown: 'Deposit',
              color: '#52BE80'
            },
          ]
        },
        {
          name: 'Withdraws', // Legend name for withdraws
          type: 'column',
          color: '#E74C3C',

          data: [
            {
              name: `<span style="color:#E74C3C">Withdraws</span>`,
              y: totalWithdraw,
              drilldown: 'Withdraw',
              color: '#E74C3C'
            },

          ]
        }
      ]
    };
  }

  render_MoneyFlow_Avg_Price() {

    const avgDepositPrice = parseFloat((this.columnTotals_Money_Flow.AvgDepositPrice).toFixed(6));
    const avgWithdrawPrice = parseFloat((this.columnTotals_Money_Flow.AvgWithdrawPrice).toFixed(6));

    this.chartOptions_MoneyFlow_Avg_Price = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 10,
          beta: -10,
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
          text: 'FUN Avg. Price'
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
        enabled: true // Enable legend
      },
      plotOptions: {
        column: {
          depth: 50, // Increase the depth of the columns
          // pointWidth: 40, // Adjust the width of the columns
          pointWidth: 55, // Minimum width for the columns
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              textOutline: 'none', // Remove shadow/outline
              color: 'white'
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
          name: 'Deposits', // Legend name for deposits
          type: 'column',
          color: '#52BE80',
          data: [

            {
              name: `<span style="color:#52BE80">Deposit</span>`,
              y: avgDepositPrice,
              drilldown: 'Deposit Avg Price',
              color: '#52BE80'
            },

          ]
        },
        {
          name: 'Withdraws', // Legend name for withdraws
          type: 'column',
          color: '#E74C3C',

          data: [

            {
              name: `<span style="color:#E74C3C">Withdraw</span>`,
              y: avgWithdrawPrice,
              drilldown: 'Withdraw Avg Price',
              color: '#E74C3C'
            }
          ]
        }
      ]
    };
  }

  //#endregion

  //#endregion


  //#region Premium Chart


  // render_Premium_InvestedEarnings() {
  //   console.log(this.dataToRender);

  //   // Calculate the total invested and earnings using reduce
  //   let totalInvested = this.dataToRender.reduce((acc, element) => acc + element.Invested, 0);
  //   let totalEarnings = this.dataToRender.reduce((acc, element) => acc + element.Earnings, 0);

  //   // Prepare data for the pie chart with colors
  //   const pieData = [
  //     { name: 'Invested', y: totalInvested, color: 'yellow' },
  //     { name: 'Earnings', y: totalEarnings, color: 'green' },
  //   ];

  //   // Update the chart options for the pie chart
  //   this.chartOptions_Premium_InvestedEarnings_Net = {
  //     chart: {
  //       type: 'pie',
  //       options3d: {
  //         enabled: true,
  //         alpha: 0,
  //         beta: 0
  //       }
  //     },
  //     title: {
  //       text: ''
  //     },
  //     tooltip: {
  //       formatter: function () {
  //         if (this.point) {
  //           return `<b>${this.point.name}</b>: ${this.y?.toFixed(2)} FUN (${this.percentage?.toFixed(1)}%)`;
  //         }
  //         return '';
  //       }
  //     },
  //     plotOptions: {
  //       pie: {
  //         allowPointSelect: true,
  //         cursor: 'pointer',
  //         depth: 35, // Add depth to the pie chart
  //         size: '75%', // Control the overall size of the pie chart
  //         dataLabels: {
  //           enabled: true,
  //           format: `{point.name}: <br>{point.y:.2f} <br>FUN`
  //         },
  //         showInLegend: true
  //       }
  //     },
  //     series: [{
  //       type: 'pie',
  //       name: 'Amount',
  //       data: pieData
  //     }]
  //   };
  // }













  // -------- Curr



  render_Premium_InvestedEarnings_Realtime() {


    const maturedData = this.dataToRender.filter(element => element.Status.toUpperCase() != 'MATURED');
    let currentInvested = maturedData.reduce((acc, element) => acc + element.Invested, 0);
    let currentEarnings = maturedData.reduce((acc, element) => acc + element.Earnings, 0);
    let earningsUnrealizedMaturity = this.dataToRender.reduce((acc, element) => acc + element.UnRealizedMaturity, 0);

    let stakingCount = this.dataToRender.filter(element => element.Status.toUpperCase() === 'UN-MATURED').length;
    let funPriceApi = this.Price_FUNUSDT_API;
    // console.log('dataToRender : ', this.dataToRender)

    this.chartOptions_Premium_InvestedEarnings_Curr = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 10,
          beta: -10,
          depth: 70,
          viewDistance: 25
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
          text: 'Upcoming Staking'
        },
        plotLines: [{
          color: 'grey',
          value: 0,
          width: 2,
          dashStyle: 'ShortDash',
          label: {
            text: '',
            align: 'right',
            x: -10,
            style: {
              color: 'red'
            }
          }
        }]
      },
      legend: {
        enabled: true
      },
      plotOptions: {
        column: {
          depth: 50,
          pointWidth: 55, // Adjust for overlapping
          pointPadding: 0, // No padding to ensure overlap
          groupPadding: 0, // Reduce space between groups
          stacking: 'normal', // Ensure columns stack if overlapping
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              textOutline: 'none',
              color: 'white'
            }
          }
        }
      },
      tooltip: {
        headerFormat: '',
        formatter: function () {
          // Accessing point value and funPriceApi inside the formatter function
          let value = this.y;
          let calculatedValue = value! * funPriceApi;
          return this.series.name == 'Staking Count' ? `<span style="color: ${this.color}">${this.series.name}</span>: <b>${value}</b>` : `<span style="color: ${this.color}">${this.series.name}</span>: <b>${value}</b><br> Value: <b>₮ ${calculatedValue.toFixed(3)} USDT </b>`;
        }
      },
      series: [
        {
          name: 'Invested',
          type: 'column',
          color: '#B7950B',

          data: [
            {
              name: `<span style="color:#B7950B">Invested</span>`,
              y: currentInvested,
              color: '#B7950B'

            }
          ]
        },
        {
          name: 'Earnings',
          type: 'column',
          color: '#52BE80',
          data: [
            {
              name: `<span style="color:#52BE80">Earnings</span>`,
              y: currentEarnings,
              color: '#52BE80'
            }
          ]
        },
        {
          name: 'Upcoming Maturity',
          type: 'column',
          color: '#1F618D',

          data: [
            {
              name: `<span style="color:#1F618D">Upcoming Maturity</span>`,
              y: earningsUnrealizedMaturity,
              color: '#1F618D'
            }
          ]
        },
        {
          name: 'Staking Count',
          type: 'column',
          color: 'blue',

          data: [
            {
              name: `<span style="color:blue">Staking Count</span>`,
              y: stakingCount,
              color: 'blue'
            }
          ]
        },
      ]
    };
  }





  // ------- Net


  render_Premium_InvestedEarnings_Net() {
    // console.log(this.dataToRender);
    let netInvested = (this.sheetData_Money_Flow.filter(element => element.Type === 'DEPOSIT').reduce((acc, element) => acc + element.Quantity, 0)) + (this.sheetData_Fun_Buying.reduce((acc, element) => acc + element.Amount, 0))
    let netEarnings = netInvested + this.dataToRender.reduce((acc, element) => acc + element.RealizedMaturity + element.UnRealizedMaturity, 0);
    let stakingCount = this.dataToRender.filter(element => element.Status.toUpperCase() === 'MATURED').length;

    // let netInvested = this.dataToRender.reduce((acc, element) => acc + element.Invested, 0);
    // let newNewInvested  = this.sheetData_Money_Flow
    // let netEarnings = this.dataToRender.reduce((acc, element) => acc + element.Earnings, 0);
    let earningsRealizedMaturity = this.dataToRender.reduce((acc, element) => acc + element.RealizedMaturity, 0);
    let funPriceApi = this.Price_FUNUSDT_API;

    this.chartOptions_Premium_InvestedEarnings_Net = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 10,
          beta: -10,
          depth: 70,
          viewDistance: 25
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
          text: 'Total Staked'
        },
        plotLines: [{
          color: 'grey',
          value: 0,
          width: 2,
          dashStyle: 'ShortDash',
          label: {
            text: '',
            align: 'right',
            x: -10,
            style: {
              color: 'red'
            }
          }
        }]
      },
      legend: {
        enabled: true
      },
      plotOptions: {
        column: {
          depth: 50,
          pointWidth: 55, // Adjust for overlapping
          pointPadding: 0, // No padding to ensure overlap
          groupPadding: 0, // Reduce space between groups
          stacking: 'normal', // Ensure columns stack if overlapping
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              textOutline: 'none',
              color: 'white'
            }
          }
        }
      },
      tooltip: {
        headerFormat: '',
        formatter: function () {
          // Accessing point value and funPriceApi inside the formatter function
          let value = this.y;
          let calculatedValue = value! * funPriceApi;
          // return `<span style="color: ${this.color}">${this.series.name}</span>: <b>${value}</b><br> Value: <b>₮ ${calculatedValue.toFixed(3)} USDT </b>`;
          return this.series.name == 'Staking Count' ? `<span style="color: ${this.color}">${this.series.name}</span>: <b>${value}</b>` : `<span style="color: ${this.color}">${this.series.name}</span>: <b>${value}</b><br> Value: <b>₮ ${calculatedValue.toFixed(3)} USDT </b>`;

        }
      },
      series: [
        {
          name: 'Invested',
          type: 'column',
          color: '#B7950B',
          data: [
            {
              name: `<span style="color:#B7950B">Invested</span>`,
              y: netInvested,
              color: '#B7950B'
            }
          ]
        },
        {
          name: 'Earnings',
          type: 'column',
          color: '#52BE80',
          data: [
            {
              name: `<span style="color:#52BE80">Earnings</span>`,
              y: netEarnings,
              color: '#52BE80'
            }
          ]
        },
        {
          name: 'Earned',
          type: 'column',
          color: '#1F618D',
          data: [
            {
              name: `<span style="color:#1F618D">Earned</span>`,
              y: earningsRealizedMaturity,
              color: '#1F618D'
            }
          ]
        },
        {
          name: 'Staking Count',
          type: 'column',
          color: 'blue',

          data: [
            {
              name: `<span style="color:blue">Staking Count</span>`,
              y: stakingCount,
              color: 'blue'
            }
          ]
        },
      ]
    };
  }





  //#endregion




  //#region total stats 

  render_Total_Columnstotal() {

    let funBalance = (parseFloat(this.columnTotals_Money_Flow.TotalDeposit) - parseFloat(this.columnTotals_Money_Flow.TotalWithdraw)) + this.columnTotals_Fun_Buying.Amount_FUN + this.columnTotals_Premium_Total.TotalRealized + this.columnTotals_Premium_Total.TotalUnRealized;
    let funBought = parseFloat(this.columnTotals_Fun_Buying.Amount_FUN);
    let funSold = 0;

    let totalDeposit = parseFloat(this.columnTotals_Money_Flow.TotalDeposit);
    let totalWithdraw = parseFloat(this.columnTotals_Money_Flow.TotalWithdraw);
    let earningsRealizedMaturity = this.dataToRender.reduce((acc, element) => acc + element.RealizedMaturity, 0);
    let earningsUnrealizedMaturity = this.dataToRender.reduce((acc, element) => acc + element.UnRealizedMaturity, 0);

    let funApiPrice = this.Price_FUNUSDT_API;

    this.chartOptions_TotalStats = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 10,
          beta: -10,
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
          text: 'Account Info : FUN'
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
        enabled: true // Enable legend
      },
      plotOptions: {
        column: {
          depth: 50, // Increase the depth of the columns
          // pointWidth: 40, // Adjust the width of the columns
          pointWidth: 55, // Minimum width for the columns
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              textOutline: 'none', // Remove shadow/outline
              color: 'white'
            }
          }
        }
      },
      tooltip: {
        headerFormat: '',
        formatter: function () {
          if ((this.series.name).toUpperCase() === 'STAKING') {
            return `<span style="color: ${this.point.color}">${this.point.name}</span>: <br> Realized: <b>${earningsRealizedMaturity}</b><br>Un-Realized: <b>${earningsUnrealizedMaturity}<br>Value: ${(this.point.y! * funApiPrice).toFixed(2)} USDT</b>`;
          } else if ((this.series.name).toUpperCase() === 'BALANCE') {
            return `<span style="color: ${this.point.color}">${this.point.name}</span>: <b>${this.point.y}</b><br>Value: <b>${(this.point.y! * funApiPrice).toFixed(2)} USDT</b>`;
          } else if ((this.series.name).toUpperCase() === 'BUY/SELL') {
            return `<span style="color: ${this.point.color}">${this.point.name}</span>: <br> Bought: <b>${funBought}</b><br>Sold: <b>${funSold}</b><br>Value: <b>${(this.point.y! * funApiPrice).toFixed(2)} USDT</b>`;
          } else if ((this.series.name).toUpperCase() === 'IN/OUT') {
            return `<span style="color: ${this.point.color}">${this.point.name}</span>: <br> Deposits : <b>${totalDeposit}</b><br>Withdraws: <b>${totalWithdraw}</b><br>Value (profit over seed-FUN) : <span style='color:green'><b>${(this.point.y! * funApiPrice).toFixed(2)} USDT </span></b><br><span style="color:green">[ Seed FUN retrieved ! ]</span>`;
          }
          // else return '<span style="color: {point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
          else return ' '

        }
      },
      series: [
        {
          name: 'BALANCE', // Legend name for deposits
          type: 'column',
          color: 'green',
          data: [
            {
              name: `<span style="color:green">BALANCE</span>`,
              y: funBalance,
              // drilldown: 'Total Invested',
              color: 'green'
            },
          ]
        },
        {
          name: 'BUY/SELL', // Legend name for withdraws
          type: 'column',
          color: '#52BE80',
          data: [
            {
              name: `<span style="color:#52BE80">BUY/SELL</span>`,
              y: funBought - funSold,
              // drilldown: 'Net BUY/SELL',
              color: '#52BE80',
            },
          ]
        },
        {
          name: 'IN/OUT', // Legend name for withdraws
          type: 'column',
          color: '#3498DB',
          data: [
            {
              name: `<span style="color:#3498DB">IN/OUT</span>`,
              y: Math.abs(totalDeposit - totalWithdraw),
              // drilldown: 'Net IN/OUT',
              color: '#3498DB'
            },
          ]
        },
        {
          name: 'STAKING', // Legend name for withdraws
          type: 'column',
          color: '#8E44AD',
          data: [
            {
              name: `<span style="color:#8E44AD">STAKING</span>`,
              y: earningsRealizedMaturity + earningsUnrealizedMaturity,
              // drilldown: 'Net Maturity',
              color: '#8E44AD'
            },
          ]
        }
      ]
    };
  }


  //#endregion


  //#region  Bonus 
  render_Bonus_InvestedEarnedRewards_Total() {
    // Initialize totals
    let totalInvestedRP = 0;
    let totalRewarded_BTC = 0;
    let totalRewarded_RP = 0;
    let totalRewarded_FUN_asBTC = 0;
    let totalRewarded_FUN = 0;
    let totalRewards = 0;
    // let totalFun_Sell_Price = 0;
    // let countFun_Sell_Price = 0;
    let totalFun_Buy_Price = 0;
    let countFun_Buy_Price = 0;
    let bonusCount = 0
    // Aggregate totals
    

    this.sheetData_Bonus.forEach((entry: any) => {
      totalInvestedRP += (entry.Invested_Rewards.BTC ? parseInt(entry.Invested_Rewards.BTC) : 0) + (entry.Invested_Rewards.FUN ? parseInt(entry.Invested_Rewards.FUN) : 0) + (entry.Invested_Rewards.WOF ? parseInt(entry.Invested_Rewards.WOF) : 0);

      totalRewarded_BTC += parseInt(entry.Rewarded_Rewards.BTC || 0);
      totalRewarded_FUN += parseInt(entry.Rewarded_Rewards.FUN || 0);

      totalRewarded_FUN_asBTC +=
        (entry.Rewarded_Rewards.FUN ?
          (parseInt(entry.Rewarded_Rewards.FUN) * parseInt(entry.Fun_Buy_Price || 0)) : 0) +
        (entry.Rewarded_Rewards.WOF ?
          (parseInt(entry.Rewarded_Rewards.FUN) * parseInt(entry.Fun_Buy_Price || 0)) : 0);


      totalRewarded_RP += parseInt(entry.Rewarded_Rewards.RP || 0);
      // if (entry.Fun_Sell_Price) {
      //   totalFun_Sell_Price += parseFloat(entry.Fun_Sell_Price);
      //   countFun_Sell_Price++;
      // }
      if (entry.Fun_Buy_Price) {
        totalFun_Buy_Price += parseFloat(entry.Fun_Buy_Price);
        countFun_Buy_Price++;
      }
      bonusCount++
    });


    // const avgFun_Sell_Price = countFun_Sell_Price > 0 ? Math.floor(totalFun_Sell_Price / countFun_Sell_Price) : 0;
    const avgFun_Buy_Price = countFun_Buy_Price > 0 ? Math.floor(totalFun_Buy_Price / countFun_Buy_Price) : 0;




    totalRewards = totalRewarded_BTC + totalRewarded_FUN_asBTC + totalRewarded_RP;




    // Configure chart options
    this.chartOptions_Bonus_InvestedRewards_Total = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 10,
          beta: -10,
          depth: 70,
          viewDistance: 25
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: {
          margin: 20,
          text: 'TOTAL Amount RP (or BTC)'
        },
        plotLines: [{
          color: 'grey',
          value: 0,
          width: 2,
          dashStyle: 'ShortDash',
          label: {
            text: '',
            align: 'right',
            x: -10,
            style: {
              color: 'red'
            }
          }
        }]
      },
      legend: {
        enabled: true
      },
      plotOptions: {
        column: {
          depth: 50,
          pointWidth: 55,
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              textOutline: 'none',
              color: 'white'
            }
          }
        }
      },
      tooltip: {
        headerFormat: '',
        formatter: function () {
          // if (this.series.name.toUpperCase() === 'REWARDED') {
          //   return `<span style="color: ${this.point.color}">${this.point.name}</span>: ${this.point.y} <br>
          //     BTC: <b>${totalRewarded_BTC}</b><br/>
          //     FUN: <b>${totalRewarded_FUN}</b> <br>[ Avg Sell Price : ${avgFun_Sell_Price} FUN/BTC <br> Avg Buy Price : ${avgFun_Buy_Price} FUN/BTC  ]<br/>
          //     RP: <b>${totalRewarded_RP}</b><br/>`;
          // }
          // if (this.series.name.toUpperCase() === 'REWARDED') {
          //   return `<span style="color: ${this.point.color}">${this.point.name}</span>: ${this.point.y} <br>
          //     BTC: <b>${totalRewarded_BTC}</b><br/>
          //     FUN: <b>${totalRewarded_FUN}</b> [ ${totalRewarded_FUN_asBTC} (as BTC or RP) @ avg ${avgFun_Buy_Price} FUN/BTC ]<br/>
          //     RP: <b>${totalRewarded_RP}</b><br/>`;
          // }

          return `<span style="color: ${this.point.color}">${this.point.name}</span>: <b>${(this.point.y)}</b><br/>`;
        }
      },
      series: [
        {
          name: 'Invested',
          type: 'column',
          color: '#8E44AD',
          data: [
            {
              name: 'Invested',
              y: totalInvestedRP,
              drilldown: 'Invested',
              color: '#8E44AD'
            }
          ]
        },
        {
          name: 'Rewarded',
          type: 'column',
          color: '#52BE80',
          data: [
            {
              name: 'Rewarded',
              y: totalRewards,
              drilldown: 'Rewarded',
              color: '#52BE80'
            }
          ]
        },
        {
          name: 'Earned',
          type: 'column',
          color: 'green',
          data: [
            {
              name: 'Earned',
              y: (totalRewards - totalInvestedRP),
              drilldown: 'Earned',
              color: 'green'
            }
          ]
        },
        {
          name: 'Bonus Count',
          type: 'column',
          color: '#3498DB',
          data: [
            {
              name: 'Bonus Count',
              y: (bonusCount),
              drilldown: 'Bonus Count',
              color: '#3498DB',

            }
          ]
        }
      ]
    };
  }

  render_Bonus_InvestedEarnedRewards() {
    // Initialize totals
0;
    let totalRewarded_BTC = 0;
    let totalRewarded_RP = 0;
    let totalRewarded_FUN_asBTC = 0;
    let totalRewarded_FUN = 0;

    let totalFun_Sell_Price = 0;
    let countFun_Sell_Price = 0;
    let totalFun_Buy_Price = 0;
    let countFun_Buy_Price = 0;

    this.sheetData_Bonus.forEach((entry: any) => {

      totalRewarded_BTC += parseInt(entry.Rewarded_Rewards.BTC || 0);
      totalRewarded_FUN += parseInt(entry.Rewarded_Rewards.FUN || 0);

      totalRewarded_FUN_asBTC +=parseFloat(this.convertSatToBtc(
        (entry.Rewarded_Rewards.FUN ?
          (parseInt(entry.Rewarded_Rewards.FUN) * parseInt(entry.Fun_Buy_Price || 0)) : 0) +
        (entry.Rewarded_Rewards.WOF ?
          (parseInt(entry.Rewarded_Rewards.FUN) * parseInt(entry.Fun_Buy_Price || 0)) : 0)))

      totalRewarded_RP += parseInt(entry.Rewarded_Rewards.RP || 0);
      if (entry.Fun_Sell_Price) {
        totalFun_Sell_Price += parseFloat(entry.Fun_Sell_Price);
        countFun_Sell_Price++;
      }
      if (entry.Fun_Buy_Price) {
        totalFun_Buy_Price += parseFloat(entry.Fun_Buy_Price);
        countFun_Buy_Price++;
      }
      
    });

        const avgFun_Sell_Price =( this.convertSatToBtc(countFun_Sell_Price > 0 ? Math.floor(totalFun_Sell_Price / countFun_Sell_Price) : 0));
        const avgFun_Buy_Price = (this.convertSatToBtc(countFun_Buy_Price > 0 ? Math.floor(totalFun_Buy_Price / countFun_Buy_Price) : 0));


    // Configure chart options
    this.chartOptions_Bonus_InvestedRewards = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 10,
          beta: -10,
          depth: 70,
          viewDistance: 25
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: {
          margin: 20,
          text: 'Total Earnings'
        },
        plotLines: [{
          color: 'grey',
          value: 0,
          width: 2,
          dashStyle: 'ShortDash',
          label: {
            text: '',
            align: 'right',
            x: -10,
            style: {
              color: 'red'
            }
          }
        }]
      },
      legend: {
        enabled: true
      },
      plotOptions: {
        column: {
          depth: 50,
          pointWidth: 55,
          dataLabels: {
            enabled: true,
            inside: true,
            style: {
              textOutline: 'none',
              color: 'white'
            }
          }
        }
      },
      tooltip: {
        headerFormat: '',
        formatter: function () {

          if (this.series.name.toUpperCase() === 'FUN') {
            return `<span style="color: ${this.point.color}">${this.point.name}</span>: ${this.point.y} <br><br>
              
              Avg Sell Price :<br>${avgFun_Sell_Price} FUN/BTC<br><br>Avg Buy Price :<br>${avgFun_Buy_Price} FUN/BTC<br><br>BTC Value :<br>${totalRewarded_FUN_asBTC}`;
          }
          

          return `<span style="color: ${this.point.color}">${this.point.name}</span>: <b>${this.point.y}</b><br/>`;
        }
      },
      series: [

        {
          name: 'BTC',
          type: 'column',
          color: '#8E44AD',
          data: [
            {
              name: 'BTC',
              y: totalRewarded_BTC,
              drilldown: 'Earned',
              color: '#8E44AD'

            }
          ]
        },
        {
          name: 'RP',
          type: 'column',
          color: '#3498DB',
          data: [
            {
              name: 'RP',
              y: totalRewarded_RP,
              drilldown: 'RP',
              color: '#3498DB',

            }
          ]
        },
        {
          name: 'FUN',
          type: 'column',
          color: '#52BE80',
          data: [
            {
              name: 'FUN',
              y: totalRewarded_FUN,
              drilldown: 'Rewarded',
              color: '#52BE80'
            }
          ]
        },

      ]
    };
  }


  //#endregion


}
