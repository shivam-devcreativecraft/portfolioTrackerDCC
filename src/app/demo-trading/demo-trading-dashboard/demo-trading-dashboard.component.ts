import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { BybitAPIDemoService } from 'src/app/services/WorkingExchangeAPI/bybit-api-demo.service';
import { DataService } from 'src/app/services/data.service';
import { AddDemoTradingEntryMarginBasedComponent } from '../add-demo-trading-entry-margin-based/add-demo-trading-entry-margin-based.component';
@Component({
  selector: 'app-demo-trading-dashboard',
  templateUrl: './demo-trading-dashboard.component.html',
  styleUrls: ['./demo-trading-dashboard.component.scss']
})
export class DemoTradingDashboardComponent {
 
  IsMasterControlEnabled: boolean = false;
  exchangeName: string = 'Demo_Trading';
  sheetName: string = 'Futures'


  sheetData_FilteredBy_Influencers: any[] = [];



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
    private dataServiceRef: DataService,
    private bybitAPIDemoServiceRef: BybitAPIDemoService,



  ) {


    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })







  }

  ngOnInit(): void {

    // this.getTradeHistoryRealtime('BYBIT')



    this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 500, 1, this, this.componentDestroyed$)
      .then((sheetData) => {
        if (sheetData) {
     
          const influencerData: any = sheetData.reduce((acc: any, item: any) => {
            const influencer = item.Influencer;

            if (!acc[influencer]) {
              acc[influencer] = [];
            }

            acc[influencer].push(item);
            return acc;
          }, {});

          this.sheetData_FilteredBy_Influencers = influencerData;
          
          if (this.sheetData_FilteredBy_Influencers) {
            if (this.orderHistoryRealtime) {
              // this.checkForNewEntries();
            }
            console.log(this.sheetData,this.sheetData_FilteredBy_Influencers);
     
          }
        }
      });
  }





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
            const dialogRef = this._dialog.open(AddDemoTradingEntryMarginBasedComponent, {
              data: { ExchangeName : this.exchangeName, SheetName: this.sheetName },
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
      const dialogRef = this._dialog.open(AddDemoTradingEntryMarginBasedComponent, {
        data: { ExchangeName : this.exchangeName, SheetName: this.sheetName },
        disableClose: false, // Prevent the dialog from closing on click outside
        hasBackdrop: false, // Allow interaction with the underlying page
        maxWidth: '335px'
      });

      dialogRef.afterClosed().subscribe(result => {
        this.IsAddDialogOpened = false;
      });
    }
  }

}
