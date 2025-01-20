import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ChartAnalysisComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/chart-analysis/chart-analysis.component';
import { UpdateEntryComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/update-entry/update-entry.component';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { BinanceAPIService } from 'src/app/services/WorkingExchangeAPI/binanceAPI.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-freebitco-fun-buying',
  templateUrl: './freebitco-fun-buying.component.html',
  styleUrls: ['./freebitco-fun-buying.component.scss']
})
export class FreebitcoFunBuyingComponent implements OnInit, OnDestroy {
  private exchangeName: string = 'Freebitco'; //for 1. MatTablle , 2. deleteEntry()
  private sheetName: string = 'Fun_Buying' //for 1. MatTablle , 2. deleteEntry()

  IsMasterControlEnabled:boolean=false;

  Price_FUNUSDT: number = 0;
  columnTotals: any = {
    Amount_BTC: 0,
    Amount_FUN: 0,
    Amount_USDT: 0,
    Avg_Price_FUNBTC: 0.0
  };

  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,

    private functionsServiceRef: FunctionsService,
    private _dialog: MatDialog,
    private binanceAPIService: BinanceAPIService,
    private cdr: ChangeDetectorRef,


  ) {
    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled=IsEnabled;
    })
  }
  ngOnInit(): void {

    this.googleSheetAPIServiceRef.setSheetName(this.sheetName)


    this.getWsDataBasedOnUrl()

    this.displayedColumns = this.functionsServiceRef.freebitco_DisplayColumns.Fun_Buying
    this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 200, 1, this, this.componentDestroyed$)
      .then((sheetData) => {
        if (sheetData) {
          this.calculateColumnTotals();

        }
      })
  }

  //#region Material Table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;

  private componentDestroyed$: Subject<void> = new Subject<void>();

  IsSelectedSheetDataLoaded: boolean = false;
  IsCoumnDataPresent: boolean = false;
  sheetData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pagesLoaded = 0;
  pageSizeOptions = 0;


  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
    this.webSocketRef!.close()

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

  editItem(item: any) {
    // console.log("Edit Method's item on edit click : ", item)

    if (!this.IsMasterControlEnabled) {

      const dialogRef = this._dialog.open(MasterControlComponent, {
        disableClose: false,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe((result) => {

        if (result) {
          const dialogRef = this._dialog.open(UpdateEntryComponent, {

            data: {
              tradeData: item, sheetName: this.sheetName, exchangeName: this.exchangeName
            }, // Pass the 'item' data to the dialog component
            disableClose: false, // Prevent the dialog from closing on click outside
            hasBackdrop: false, // Allow interaction with the underlying page

          });
          dialogRef.afterClosed().subscribe((result) => {
            // Handle any data returned from the dialog if needed
            // console.log('Dialog was closed with result:', result);
          })

        }
      })


    }

    else {

      const dialogRef = this._dialog.open(UpdateEntryComponent, {

        data: {
          tradeData: item, sheetName: this.sheetName, exchangeName: this.exchangeName
        }, // Pass the 'item' data to the dialog component
        disableClose: false, // Prevent the dialog from closing on click outside
        hasBackdrop: false, // Allow interaction with the underlying page

      });
      dialogRef.afterClosed().subscribe((result) => {
        // Handle any data returned from the dialog if needed
        // console.log('Dialog was closed with result:', result);
      })
    }
  }
  deleteEntry(ID: number, element: any) {
    if (!this.IsMasterControlEnabled) {
      if (!this.IsMasterControlEnabled) {

        const dialogRef = this._dialog.open(MasterControlComponent, {
          disableClose: false,
          hasBackdrop: true
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.functionsServiceRef.deleteEntry(this.exchangeName, this.sheetName, ID)
          }
        })

      }
    }

    else {
      this.functionsServiceRef.deleteEntry(this.exchangeName, this.sheetName, ID)
    }

  }

  

  calculateColumnTotals() {
    this.IsCoumnDataPresent = false;
    this.sheetData.forEach((element: any) => {
      // Convert satoshis to BTC
      const btcAmount = element.Cost / 100000000;

      // Add to columnTotals
      this.columnTotals.Amount_FUN += element.Amount;
      this.columnTotals.Amount_BTC += btcAmount;

      this.columnTotals.Avg_Price_FUNBTC = this.calculateAverageSATPerFUN()
      // let totalCost_BTC;
      // totalCost_BTC += element.



    });






    this.binanceAPIService.getPrice('FUN').subscribe((response: any) => {

      this.Price_FUNUSDT = response.price
      this.columnTotals.Price_FUNUSDT = this.Price_FUNUSDT * this.columnTotals.Amount_FUN
      this.cdr.detectChanges(); // Trigger change detection

      if (this.columnTotals.Price_FUNUSDT)

        this.IsCoumnDataPresent = true;
      // console.log(response.price)
    })
  }



  calculateAverageSATPerFUN(): number {
    let totalSAT = 0;
    let totalFUN = 0;

    // Calculate total SAT and total FUN
    this.sheetData.forEach(entry => {
      totalSAT += entry.Cost;
      totalFUN += entry.Amount;
    });
    // Calculate average SAT per FUN
    const averageSATPerFUN = ((totalSAT / 100000000) / (totalFUN))





    return averageSATPerFUN;
  }









  onOpenChartAnalysisDialog(TradingPair: any) {
    const dialogRef = this._dialog.open(ChartAnalysisComponent, {
      data: { exchangeName: (this.exchangeName).toUpperCase(), tradingPair: TradingPair, Location: 'Orders' },
      disableClose: false,
      hasBackdrop:false,
      // height: '90vh', // Set your desired height
      minWidth: '95vw',
      minHeight: '93vh',
      maxHeight: '93vh'



    })
    dialogRef.afterClosed().subscribe((result) => {
      // Handle any data returned from the dialog if needed
      // console.log('Dialog was closed with result:', result);
    });
  }







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
      this.Price_FUNUSDT = currentPrice; // Update the price variable
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
    return this.currentPrice > 0 ? this.currentPrice * this.columnTotals.Amount_FUN : this.columnTotals.Amount_FUN * this.Price_FUNUSDT
  }
  getPriceColour(pair?: string): boolean {
    // const priceInfo = this.priceMap.get(TradingPair);
    if (this.currentPrice > this.prevPrice) return true;
    else return false;
  }

}










