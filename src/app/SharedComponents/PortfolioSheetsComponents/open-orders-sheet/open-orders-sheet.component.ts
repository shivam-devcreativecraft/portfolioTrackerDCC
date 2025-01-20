import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { MasterControlComponent } from '../../master-control/master-control.component';
import { UpdateEntryComponent } from '../update-entry/update-entry.component';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-open-orders-sheet',
  templateUrl: './open-orders-sheet.component.html',
  styleUrls: ['./open-orders-sheet.component.scss']
})
export class OpenOrdersSheetComponent implements OnInit, OnDestroy {

  // private exchangeName: string = ''; //for 1. MatTablle , 2. deleteEntry()
  // private sheetName: string = 'SIP_Open_Orders' //for 1. MatTablle , 2. deleteEntry()




  openTradesFilteredData: any = {
    TradingPair: '',
    CurrentPrice: 0,
    TotalBuyQuantity: 0,
    TotalInvestedAmount: 0,
    TradeCount: 0,
    OpenOrders: [],
  };

  IsMasterControlEnabled: boolean = false;

  IsSelectedSheetDataLoaded: boolean = false;
  sheetName: string = 'SIP_Open_Orders';
  exchangeName: string = ''

  tradingPairData: any[] = [];

  pageSizeOptions = 0;

  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor
    (
      @Inject(MAT_DIALOG_DATA) public tradingPairDataInjected: any,
      public dialogRef: MatDialogRef<OpenOrdersSheetComponent>,
      private functionsServiceRef: FunctionsService,
      private toastr: ToastrService,
      private _dialog: MatDialog,
      private googleSheetAPIServiceRef : GoogleSheetApiService

    ) {

    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })
    
  }


  ngOnInit(): void {

    this.exchangeName = this.tradingPairDataInjected.exchangeName;

    this.openTradesFilteredData = this.tradingPairDataInjected.TradingPairData;
    this.openTradesFilteredData.CurrentPrice = this.tradingPairDataInjected.TradingPairData.CurrentStaticPrice;

    

    this.getWsDataBasedOnUrl(this.tradingPairDataInjected.tradingPair);


    if (this.exchangeName?.toUpperCase() == 'BINANCE') {
      this.displayedColumns = this.functionsServiceRef.binance_DisplayColumns.SIP_Open_Orders
    }

    if (this.exchangeName?.toUpperCase() == 'BYBIT') {
      this.displayedColumns = this.functionsServiceRef.bybit_DisplayColumns.SIP_Open_Orders
    }

    if (this.exchangeName?.toUpperCase() == 'MEXC') {
      this.displayedColumns = this.functionsServiceRef.mexc_DisplayColumns.SIP_Open_Orders
    }
    if (this.exchangeName?.toUpperCase() == 'KUCOIN') {
      this.displayedColumns = this.functionsServiceRef.kucoin_DisplayColumns.SIP_Open_Orders
    }
    if (this.exchangeName?.toUpperCase() == 'GATEIO') {
      this.displayedColumns = this.functionsServiceRef.gateio_DisplayColumns.SIP_Open_Orders
    }





    let filterdSheetData = this.tradingPairDataInjected.OpenOrders.filter(
      (item: any) =>
        item.TradingPair == this.tradingPairDataInjected.tradingPair
    );


    this.openTradesFilteredData.OpenOrders = filterdSheetData[0].OpenOrders;


    this.dataSource = new MatTableDataSource(this.openTradesFilteredData.OpenOrders);
    this.pageSizeOptions = Math.floor((this.openTradesFilteredData.Trades).length);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


    this.IsSelectedSheetDataLoaded = true;
    // console.log(this.openTradesFilteredData)
    // this.set_openTradesFilteredData(filterdSheetData[0]);






  }






  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



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
          tradeData: item, sheetName: this.sheetName, exchangeName: this.exchangeName, location : 'dialog'
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

                                                                                                                                                





  // ---------------------------------------------------
  private webSocketRefs: WebSocket[] = [];

  getWsDataBasedOnUrl(tradingPair: any) {

    if (this.exchangeName.toUpperCase() === 'BINANCE') {

      // Create a WebSocket connection to update the price
      const wsUrl = `wss://stream.binance.com:9443/ws/${tradingPair.toLowerCase()}usdt@aggTrade`;
      const webSocketRef = new WebSocket(wsUrl);

      webSocketRef.onmessage = (event) => {
        const currentPrice = JSON.parse(event.data).p;

        // Update the CurrentPrice property with the new price
        this.openTradesFilteredData.CurrentPrice = parseFloat(currentPrice);

        // You can also update any other properties of openTradesFilteredData as needed

        // Call a function to handle the updated data or update the UI
      };

      webSocketRef.onerror = (event) => {
        console.error(`WebSocket error for ${tradingPair}:`, event);
      };

      this.webSocketRefs.push(webSocketRef);


    }


    if (this.exchangeName.toUpperCase() === 'BYBIT') {

      const wsUrl = `wss://stream.bybit.com/v5/public/spot`;
      const webSocketRef = new WebSocket(wsUrl);

      webSocketRef.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.topic === `tickers.${tradingPair}USDT`) {
          const currentPrice = message.data.lastPrice;
          this.openTradesFilteredData.CurrentPrice = parseFloat(currentPrice);
        }
      };

      webSocketRef.onerror = (event) => {
        console.error(`WebSocket error for ${tradingPair}:`, event);
      };

      // Subscribe to the trading pair
      webSocketRef.addEventListener('open', () => {
        const subscribeMessage = {
          op: 'subscribe',
          args: [`tickers.${tradingPair}USDT`],
        };
        webSocketRef.send(JSON.stringify(subscribeMessage));
      });

      this.webSocketRefs.push(webSocketRef);

    }

    if (this.exchangeName.toUpperCase() === 'MEXC') { }
    if (this.exchangeName.toUpperCase() === 'KUCOIN') { }
    if (this.exchangeName.toUpperCase() === 'GATEIO') { }


  }

  // ---------------------------------------------------

  getEstPnl(trade: any) {
    let totalPnl = trade.Price * trade.Qty_Open_Order;
    let estPnl =
      totalPnl -
      this.openTradesFilteredData.AverageBuyPrice * trade.Qty_Open_Order;

    // Calculate estPnl as a percentage

    // Return the estPnl as a string with 3 decimal places
    return estPnl;
  }
  getEstPnlPercentage(trade: any) {
    let totalPnl = trade.Price * trade.Qty_Open_Order;
    let estPnl =
      totalPnl -
      this.openTradesFilteredData.AverageBuyPrice * trade.Qty_Open_Order;

    // Calculate estPnl as a percentage
    let estPnlPercentage =
      (estPnl /
        (this.openTradesFilteredData.AverageBuyPrice * trade.Qty_Open_Order)) *
      100;

    // Return the estPnl as a string with 3 decimal places
    return estPnlPercentage;
  }

  getCurrentPnl(trade: any) {
    return (
      trade.Qty_Open_Order * this.openTradesFilteredData.CurrentPrice -
      trade.Qty_Open_Order * this.openTradesFilteredData.AverageBuyPrice
    );
  }

  getCurrentPnlPercentage(trade: any) {
    // Calculate the current profit and loss
    const currentPnl =
      trade.Qty_Open_Order * this.openTradesFilteredData.CurrentPrice -
      trade.Qty_Open_Order * this.openTradesFilteredData.AverageBuyPrice;

    // Calculate the percentage
    const currentPnlPercentage =
      (currentPnl /
        (trade.Qty_Open_Order * this.openTradesFilteredData.AverageBuyPrice)) *
      100;

    // Return the current profit and loss percentage
    return currentPnlPercentage.toFixed(2);
  }

  // getUntilTarget(trade: any): number {
  //   console.log("Trade PArameter : ", trade)
  //   let totalPnl = trade.Price * trade.Qty_Open_Order;
  //   let estPnl =
  //     totalPnl -
  //     this.openTradesFilteredData.AverageBuyPrice * trade.Qty_Open_Order;
  //   // Calculate estPnl as a percentage
  //   let estPnlPercentage =
  //     (estPnl /
  //       (this.openTradesFilteredData.AverageBuyPrice * trade.Qty_Open_Order)) *
  //     100;

  //   const currentPnl =
  //     trade.Qty_Open_Order * this.openTradesFilteredData.CurrentPrice -
  //     trade.Qty_Open_Order * this.openTradesFilteredData.AverageBuyPrice;
  //   // Calculate the percentage
  //   const currentPnlPercentage =
  //     (currentPnl /
  //       (trade.Qty_Open_Order * this.openTradesFilteredData.AverageBuyPrice)) *
  //     100;

  //   return currentPnlPercentage - estPnlPercentage;
  // }

  getUntilTarget(trade: any): number {
    const pnlPercentage =
      ((this.openTradesFilteredData.CurrentPrice - trade.Price) /
        this.openTradesFilteredData.CurrentPrice) *
      100;

    return pnlPercentage;
  }


  getQtyOpen_Percentage(trade: any): number {

    const TotalBuyQuantity = this.openTradesFilteredData.TotalBuyQuantity;
    const Qty_Open_Order = trade.Qty_Open_Order;

    if (TotalBuyQuantity === 0) {
      return 0; // To avoid division by zero
    }

    const percentage = (Qty_Open_Order / TotalBuyQuantity) * 100;
    return parseFloat(percentage.toFixed(2));
  }


  onClose(): void {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {

    this.webSocketRefs.forEach((webSocketRef) => {
      webSocketRef.close();
    });
  }




}
