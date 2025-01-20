import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { AddTradingSetupEntryComponent } from '../add-trading-setup-entry/add-trading-setup-entry.component';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-trade-setup-futures',
  templateUrl: './trade-setup-futures.component.html',
  styleUrls: ['./trade-setup-futures.component.scss']
})
export class TradeSetupFuturesComponent implements OnInit {

  IsMasterControlEnabled: boolean = false;
  exchangeName: string = 'Trade_Setup';
  sheetName: string = 'Futures'



  //#region  pnl calender

  currentMonth: Date = new Date(); // Assuming you want current month initially
  currentMonthYear: string = ''; // Will be updated in ngOnInit
  currentYear: number = new Date().getFullYear(); // For monthly view

  // pnlDataPerDay: { [key: string]: { pnl: number } } = {};
  // pnlDataPerMonth: { [key: string]: { pnl: number } } = {};
  // calendar: (Date | null)[][] = [];



  // dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // showPnlPerDay: boolean = true; // Default to showing PNL per day
  // showGoToCurrentButton: boolean = false; // Flag to show/hide the Go to Current button
  // oldesMonthYear: any;


  // Data storage for each influencer
  // influencerData: {
  //   [key: string]: {
  //     pnlDataPerDay: { [key: string]: { pnl: number } },
  //     pnlDataPerMonth: { [key: string]: { pnl: number } },
  //     calendar: (Date | null)[][],
  //     showPnlPerDay: boolean,
  //     showGoToCurrentButton: boolean,
  //     oldestMonthYear: string,
  //     trades: any[]
  //   }
  // } = {};

  // influencerData: any = {}
  finalTradeSetupData:any= {}


  //#endregion

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

  //#endregion





  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();

  }


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 500, this.currentPage + 1, this, this.componentDestroyed$);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 500, this.currentPage - 1, this, this.componentDestroyed$);
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


  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private toastr: ToastrService,
    private _dialog: MatDialog,
    private functionsServiceRef: FunctionsService,



  ) {


    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })







  }

  ngOnInit(): void {
    this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 500, 1, this, this.componentDestroyed$)
      .then((sheetData) => {
        if (sheetData) {
          this.finalTradeSetupData.sheetData = sheetData;
          this.initializeInfluencerData(this.finalTradeSetupData.sheetData);
          console.log('finalTradeSetupData: ', this.finalTradeSetupData);
          // console.log('influencerData(perDay_perMonth)',  this.finalTradeSetupData.influencerData)


        }
      });
  }




  initializeInfluencerData(sheetData: any) {
    // Parse the data and convert keys to arrays of numbers
    const parsedData = sheetData.map((item: any) => {
      return {
        ...item,
        Profits: typeof item.Profits === 'string' ? item.Profits.split(',').map(Number) : [item.Profits],
        Profit_Percentages: typeof item.Profit_Percentages === 'string' ? item.Profit_Percentages.split(',').map(Number) : [item.Profit_Percentages],
        Targets: typeof item.Targets === 'string' ? item.Targets.split(',').map(Number) : [item.Targets]
      };
    });

    // Group data by unique 'Influencer'
    const influencerData: { [key: string]: any[] } = parsedData.reduce((acc: any, item: any) => {
      const influencer = item.Influencer;

      if (!acc[influencer]) {
        acc[influencer] = [];
      }

      acc[influencer].push(item);
      return acc;
    }, {});

    // Ensure influencerData is initialized in finalTradeSetupData
    if (!this.finalTradeSetupData.influencerData) {
      this.finalTradeSetupData.influencerData = {}; // Initialize it if not present
    }

    // Initialize data for each influencer
    for (const [influencer, trades] of Object.entries(influencerData)) {
      if (!this.finalTradeSetupData.influencerData[influencer]) {
        this.finalTradeSetupData.influencerData[influencer] = { // Initialize influencer data if not present

          calendarData: {
            pnlDataPerDay: {},
            pnlDataPerMonth: {},
            oldestMonthYear: '',
          },
          trades: [],
          status: false
        };



        this.finalTradeSetupData.influencerData[influencer].calendarData.oldestMonthYear = this.getOldestMonthAndYear(trades);
        this.finalTradeSetupData.influencerData[influencer].trades = trades;



      }

      // Process the trades
      this.calculatePnlData(influencer, trades);
    }
  }


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
            const dialogRef = this._dialog.open(AddTradingSetupEntryComponent, {
              data: { ExchangeName: this.exchangeName, SheetName: this.sheetName },
              disableClose: false, // Prevent the dialog from closing on click outside
              hasBackdrop: false, // Allow interaction with the underlying page
              maxWidth: '335px'
            });

            dialogRef.afterClosed().subscribe(result => {
              this.IsAddDialogOpened = false;
            });
          }
        });
      }
    } else {
      const dialogRef = this._dialog.open(AddTradingSetupEntryComponent, {
        data: { ExchangeName: this.exchangeName, SheetName: this.sheetName },
        disableClose: false, // Prevent the dialog from closing on click outside
        hasBackdrop: false, // Allow interaction with the underlying page
        maxWidth: '335px'
      });

      dialogRef.afterClosed().subscribe(result => {
        this.IsAddDialogOpened = false;
      });
    }
  }

  // Function to get the oldest month and year
  getOldestMonthAndYear(trades: any[]): string {
    const allDates = trades.map(item => new Date(item.Date_Creation));
    const sortedData = allDates.sort((a, b) => a.getTime() - b.getTime());
    const oldestDate = sortedData[0];
    const month = oldestDate.toLocaleString('default', { month: 'long' });
    const year = oldestDate.getFullYear();
    return `${month} ${year}`;
  }

  getMonthYear(date: Date): string {
    return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  }

  calculatePnlData(influencer: string, trades: any[]): void {
    const pnlDataPerDay: { [key: string]: { pnl: number } } = {};
    const pnlDataPerMonth: { [key: string]: { pnl: number } } = {};


    trades.forEach(trade => {
      const Date_Creation = new Date(trade.Date_Creation);
      const dayKey = this.getDateKey(Date_Creation);
      const monthKey = this.getMonthKey(Date_Creation);

      if (!pnlDataPerDay[dayKey]) {
        pnlDataPerDay[dayKey] = { pnl: 0 };
      }
      if (!pnlDataPerMonth[monthKey]) {
        pnlDataPerMonth[monthKey] = { pnl: 0 };
      }

      pnlDataPerDay[dayKey].pnl += trade.Profits.reduce((a: number, b: number) => a + b, 0);
      pnlDataPerMonth[monthKey].pnl += trade.Profits.reduce((a: number, b: number) => a + b, 0);
    });

    // Store the calculated data

    // this.finalTradeSetupData.influencerData[influencer].pnlDataPerDay = pnlDataPerDay;
    //  this.finalTradeSetupData.influencerData[influencer].pnlDataPerMonth = pnlDataPerMonth;
    //  this.finalTradeSetupData.influencerData[influencer].calendarData = calendar;

    this.finalTradeSetupData.influencerData[influencer].calendarData.pnlDataPerDay = pnlDataPerDay;
    this.finalTradeSetupData.influencerData[influencer].calendarData.pnlDataPerMonth = pnlDataPerMonth;





    //  this.finalTradeSetupData.influencerData[influencer].showPnlPerDay = true; // Set based on your requirement
    //  this.finalTradeSetupData.influencerData[influencer].showGoToCurrentButton = false; // Set based on your requirement


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

}
