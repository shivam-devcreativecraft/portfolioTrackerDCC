import { Component, Injectable } from '@angular/core';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../SharedComponents/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GoogleSheetApiService } from '../services/google-sheet-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LoaderService } from '../loader.service';

@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
  //#region  Binance Display Columns
  binance_DisplayColumns: any = {
    Fun_Buying_Depoit: [
      'Date',
      'Market',
      'Price',
      'Direction',
      'Amount',
      'Fees',
      'Total_USDT',
      'Placed',
      'Executed',
      'actions',
    ],
    Futures_Pnl: ['Date', 'Asset', 'Type', 'Amount', 'Symbol', 'actions'],
    Futures_Trades: [
      'Date',
      'Symbol',
      'Direction',
      'Price',
      'Quantity',
      'Fee_BNB',
      'Pnl_USDT',
      'actions',
    ],
    Old_Withdraws: [
      'Date',
      'Type',
      'Withdraw_Wallet',
      'Asset',
      'Total_Amount_USDT',
      'Transaction_Fee',
      'Recieved',
      'Network',
      'To_From_Account',
      'Purpose',
      'Recepient',
      'actions',
    ],
    Money_Flow_Crypto: [
      'Date',
      'Type',
      'Withdraw_Wallet',
      'Asset',
      'Total_Amount_USDT',
      'Transaction_Fee',
      'Recieved',
      'Network',
      'To_From_Account',
      'Purpose',
      'Recepient',
      'actions',
    ],
    P2P: [
      'Date',
      'Order_Type',
      'Price',
      'Amount_USDT',
      'Amount_INR',
      'Notes',
      'actions',
    ],
    SIP: ['Date', 'Market', 'Price', 'Amount', 'Total_USDT', 'actions'],
    Open_Orders_SIP: [
      'ID', 'Date', 'Trading_Pair', 'Type', 'Price', 'Qty_Open_Order', 'Amount', 'Filled', 'Is_Placed', 'Exchange', 'Period', 'IS_TradingView_Setup', 'Holdings', 'TradingView_Account'],

    Spot_Trades: [
      'Date',
      'Market',
      'Direction',
      'Price',
      'Amount',
      'Total_USDT',
      'Fees',
      'Fee_Asset',
      'Influencer',
      'Period',
      'Notes',
      'TradingView_Account',
      'actions',
    ],

  };
  //#endregion





  //#region  Bybit Display Columns

  bybit_DisplayColumns: any = {
    ACT_OFFICIAL: [
      'Open_Date',
      'Trading_Pair',
      'Direction',
      'Leverage',
      'Entry_Price',
      'Exit_Price',
      'Pnl_USDT',
      'Pnl_Percentage',
      'Close_Date',
      'actions',
    ],
    Gold_Vip: [
      'Open_Date',
      'Trading_Pair',
      'Direction',
      'Leverage',
      'Entry_Price',
      'Exit_Price',
      'Pnl_USDT',
      'Pnl_Percentage',
      'Close_Date',
      'actions',
    ],
    Copy_Trading: [
      'Date_From',
      'Date_To',
      'Master_Name',
      'Total_Invested',
      'Equity',
      'Profit_Share_USDT',
      'ROI',
      'Pnl_USDT',
      'actions',
    ],
    Futures_Closed_Pnl: [
      'Date_Creation',
      'Contracts',
      'Opening_Direction',
      'Qty',
      'Entry_Price',
      'Exit_Price',
      'Closed_Pnl',
      'Closed_Pnl_Percentage',
      'Influencer',
      'Notes',
      'actions',
    ],
    Futures_Closed_Pnl_Copy_Trader_Master: [
      'Date_Creation',
      'Contracts',
      'Opening_Direction',
      'Qty',
      'Entry_Price',
      'Exit_Price',
      'Closed_Pnl',
      'Closed_Pnl_Percentage',
      'Influencer',
      'Notes',
      'actions',
    ],

    Money_Flow: [
      'Date',
      'Amount',
      'Asset',
      'Type',
      'Fees',
      'Network',
      'Exchange',
      'Account',
      'Notes',
      'actions',
    ],

    Money_Flow_Copy_Trading: [
      'Date',
      'Amount_USDT',
      'Type',
      'actions'
    ],

    P2P: [
      'Date',
      'Order_Type',
      'Price',
      'Amount_USDT',
      'Amount_INR',
      'Notes',
      'actions',
    ],
    SIP: ['Date', 'Market', 'Price', 'Amount', 'Total_USDT', 'actions'],
    Open_Orders_SIP: [
      'Date',
      'Filled',
      'Price',
      'Qty_Open_Order',
      'Amount',
      'actions',
    ],
    Spot_Trades: [
      'Date',
      'Market',
      'Direction',
      'Price',
      'Amount',
      'Total_USDT',
      'Fees',
      'Fee_Asset',
      'Influencer',
      'Period',
      'Notes',
      'TradingView_Account',
      'actions',
    ],
  };
  //#endregion





  //#region  Mexc Display Columns

  mexc_DisplayColumns: any = {
    Futures_ACT_Positions: [
      'Open_Date',
      'Trading_Pair',
      'Direction',
      'Leverage',
      'Amount_Coin',
      'Entry_Price',
      'Exit_Price',
      'Pnl_USDT',
      'Pnl_Percentage',
      'Close_Date',
      'actions',
    ],
    Futures: [
      'Open_Date',
      'Trading_Pair',
      'Direction',
      'Leverage',
      'Amount_Coin',
      'Entry_Price',
      'Exit_Price',
      'Pnl_USDT',
      'Pnl_Percentage',
      'Close_Date',
      'actions',
    ],
    Money_Flow: [
      'Date',
      'Amount',
      'Asset',
      'Type',
      'Fees',
      'Network',
      'Exchange',
      'Account',
      'Notes',
      'actions',
    ],
    SIP: ['Date', 'Market', 'Price', 'Amount', 'Total_USDT', 'actions'],
    Open_Orders_SIP: [
      'Date',
      'Filled',
      'Price',
      'Qty_Open_Order',
      'Amount',
      'actions',
    ],
    Spot_Trades: [
      'Date',
      'Market',
      'Direction',
      'Price',
      'Amount',
      'Total_USDT',
      'Fees',
      'Fee_Asset',
      'Influencer',
      'Period',
      'Notes',
      'TradingView_Account',
      'actions',
    ],
  };
  //#endregion




  //#region  Delta Display Columns

  delta_DisplayColumns: any = {
    Futures: [
      'Open_Date',
      'Trading_Pair',
      'Direction',
      'Leverage',
      'Amount_Coin',
      'Entry_Price',
      'Exit_Price',
      'Pnl_USDT',
      'Amount_USDT',
      'Fee',
      'actions',
    ],
    Money_Flow: [
      'Date',
      'Amount',
      'Asset',
      'Type',
      'Fees',
      'Network',
      'Exchange',
      'Account',
      'Notes',
      'actions',
    ],
  };
  //#endregion




  //#region  Freebitco Display Columns

  freebitco_DisplayColumns: any = {
    Events: [
      'Result',
      'Remaining',
      'Open_Date',
      'Event',
      'Side',
      'Invested',
      'Return',
      'Close_Date',
      'actions',
    ],
    Fun_Buying: [
      'Date',
      'Type',
      'Price',
      'Cost',
      'Amount',
      'actions'
      // 'Statergy'
    ],
    Premium: [
      'Date',
      'Principal',
      'Maturity',
      'Earning',
      'Days',
      'APY',
      'Expires_Date',
      'Status',
      'actions'
    ],
    Money_Flow: [
      'Date',
      'Quantity',
      'Type',
      'Price',
      'Fees',
      'Amount',
      'Exchange',
      'Account',
      'actions'



    ]
  };
  //#endregion







  //#region  Kucoin Display Columns

  kucoin_DisplayColumns: any = {
    P2P: [
      'Date',
      'Order_Type',
      'Price',
      'Amount_USDT',
      'Amount_INR',
      'Notes',
      'actions',
    ],
    Spot_Trades: [
      'Date',
      'Market',
      'Direction',
      'Price',
      'Amount',
      'Total_USDT',
      'Fees',
      'Fee_Asset',
      'Influencer',
      'Period',
      'Notes',
      'TradingView_Account',
      'actions',
    ],
    Money_Flow: [
      'Date',
      'Amount',
      'Asset',
      'Type',
      'Fees',
      'Network',
      'Exchange',
      'Account',
      'Notes',
      'actions',
    ],
    Open_Orders_SIP: [
      'Date',
      'Filled',
      'Price',
      'Qty_Open_Order',
      'Amount',
      'actions',
    ],

  }
  //#endregion



  //#region Gateio Display Columns

  gateio_DisplayColumns: any = {

    Money_Flow: [
      'Date',
      'Amount',
      'Asset',
      'Type',
      'Fees',
      'Network',
      'Exchange',
      'Account',
      'Notes',
      'actions',
    ],

    P2P: [
      'Date',
      'Order_Type',
      'Price',
      'Amount_USDT',
      'Amount_INR',
      'Notes',
      'actions',
    ],
    Spot_Trades: [
      'Date',
      'Market',
      'Direction',
      'Price',
      'Amount',
      'Total_USDT',
      'Fees',
      'Fee_Asset',
      'Influencer',
      'Period',
      'Notes',
      'TradingView_Account',
      'actions',
    ],
  }
  //#region 


  //#region  Exness Display Columns

  exness_DisplayColumns: any = {
    Exness: [
      'Open_Date',
      'Symbol',
      'Type',
      'Lot_Size',
      'Open_Price',
      'Close_Price',
      'Pnl_USDT',
      'Close_Date',
      'actions'


    ]
  }

  //#endregion




  constructor(
    private dialog: MatDialog,
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private toastr: ToastrService,
    private loaderService: LoaderService

  ) { }





  //#region Edit Entry
  updateOrder_Cards(formData: FormData): Promise<any> {
    return new Promise((resolve, reject) => {
      const defaultMessage = `Are you sure you want to update this item?`;
      const dialogData = new ConfirmDialogModel('Confirm Update', defaultMessage);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '100%',
        data: dialogData,
        hasBackdrop: true,
        disableClose: false
      });

      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult === true) {
          this.loaderService.show(); // Show loader

          this.googleSheetAPIServiceRef
            .edit(formData)
            .then((x: any) => {
              if (x.error) {
              this.toastr.error(x.error, 'Failed !');

                reject(x.error);

              } else {
              this.toastr.success(x.message, 'Updated !');

                resolve(x);
              }
            })
            .catch((error) => {
              reject(error);
            })
            .finally(() => {
              this.loaderService.hide(); // Hide loader
            });
        }
      });
    });
  }



  updateEntry(Data: any, componentRef: any, injectedTradeData: any, location?: string): Promise<any> {
    return new Promise((resolve, reject) => {



      // componentRef.SubmittedEntityCount = 0;
      const updatedFields = this.getUpdatedFieldsStringForDisplayPurpose(Data, injectedTradeData);
      // Updated message format with structured layout
      const defaultMessage = `Are you sure you want to update this item ?`;
      const nonUpdateMessage = `No updated fields !\n\nStil want to update unchanged fields ? `;
      const updateMessage = `\n\nUpdated fields:\n${updatedFields}\n\n`;



      const dialogData = new ConfirmDialogModel('Confirm Update', updatedFields ? defaultMessage + updateMessage : nonUpdateMessage);





      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '100%',
        data: dialogData,
        hasBackdrop: true,
        disableClose: false
      });

      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult === true) {




          // const object: any = {};
          // Data.forEach((value: any, key: any) => {
          //   object[key] = value;
          // });
          // console.log(object)



          componentRef.isNewEntrySubmitted = true; // Set to true only if user confirms
          this.googleSheetAPIServiceRef
            .edit(Data)
            .then((x: any) => {
              if (x.error) {
                if(x.error=="Token present in param but not matched with stored token")
                {
                  localStorage.removeItem('masterControlToken')
                  if (!localStorage.getItem('masterControlToken')) {
                    this.googleSheetAPIServiceRef.checkMasterControl(false);
          
                    
                  }
                }
                reject(x.error);
              } else {
                componentRef.SubmittedEntityCount++;

                resolve(x); // Resolve the promise if update is successful
              }
            })
            .catch((error) => {
         
              reject(error); // Reject the promise if there is an error
            })
            .finally(() => {
              componentRef.isNewEntrySubmitted = false; // Reset the flag after promise is settled

            });
        } else {
          // User canceled, do not update
          // this.toastr.warning('Cancelled !');
          reject('Cancelled'); // Reject the promise if update is cancelled
          componentRef.isNewEntrySubmitted = false; // Reset the flag after promise is settled
        }
      });
    });
  }

  private getUpdatedFieldsStringForDisplayPurpose(newData: FormData, oldData: any): string {


    let updatedFields = '';

    for (const key in oldData) {
      // if (oldData.hasOwnProperty(key) && key !== 'Pnl_Percentage') { // Exclude 'Pnl_Percentage'

      if (oldData.hasOwnProperty(key) && key !== 'Pnl_Percentage' && key !== 'Cost') { // Exclude 'Pnl_Percentage'
        const newValue = newData.get(key);
        const oldValue = oldData[key];

        // Convert null values to empty strings for comparison
        const oldValueStr = (oldValue === null || oldValue === '') ? "' '" : oldValue.toString();
        const newValueStr = (newValue === null || newValue === '') ? "' '" : newValue.toString();

        // Check if the value has changed and is not an empty string becoming null
        if (oldValueStr !== newValueStr && !(oldValueStr === '' && newValue === null)) {
          updatedFields += `${key}: ${oldValueStr} --> ${newValueStr}\n`;
        }
      }

      // }
    }

    return updatedFields;
  }







  //#endregion







  //#region Delete Entry
  deleteEntry(ExchangeName: string, SheetName: string, ID: number) {
    const message = `Are you sure you want to delete this item?`;

    const dialogData = new ConfirmDialogModel('Confirm Deletion', message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === true) {
        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('SheetName', SheetName);
        formData.append('ID', ID.toString());
        this.googleSheetAPIServiceRef
          .delete(formData, ExchangeName)
          .then((x: any) => {
            if (x.message) {
              this.toastr.success(x.message, 'Deleted !');
            }
            else {
              this.toastr.warning(x.error, 'Failed !');
              localStorage.removeItem('masterControlToken')
              if (!localStorage.getItem('masterControlToken')) {
                this.googleSheetAPIServiceRef.checkMasterControl(false);
              }
            }
          })
          .catch((error) => {
            this.toastr.warning(error, 'Failed !');
          });
      } else {
        // User canceled, do not delete
        this.toastr.warning('Cancelled !');
      }
    });
  }
  //#endregion



  //#region Set MaterialTable Data
  loadSheetData(
    exchangeName: string,
    sheetName: string,
    itemsPerPage: any,
    page: number,
    component: any,
    componentDestroyed$: Subject<void>
  ): Promise<any[]> {
    // console.log(exchangeName, sheetName, itemsPerPage, page);
    return new Promise<any[]>((resolve, reject) => {
      if (!itemsPerPage) {
        itemsPerPage = 500
      }
      this.googleSheetAPIServiceRef
        .getAIOSheetsData(exchangeName, sheetName, itemsPerPage, page)
        .pipe(takeUntil(componentDestroyed$))
        .subscribe((data: any) => {
          // console.log(data)
          if (data) {
            const newDataArray: any[] = Object.values(data.data);
            component.sheetData = [...component.sheetData, ...newDataArray];
            component.dataSource = new MatTableDataSource([
              ...component.sheetData,
            ]);

            component.pageSizeOptions = Math.floor(component.sheetData.length);
            component.dataSource.paginator = component.paginator;
            component.dataSource.sort = component.sort;

            component.currentPage = page;
            component.totalPages = data.totalPages;
            component.pagesLoaded++;

            if (component.currentPage < component.totalPages) {
              // API call recursively
              this.loadSheetData(
                exchangeName,
                sheetName,
                itemsPerPage,
                page + 1,
                component,
                componentDestroyed$
              )
                .then((loadedData) => {
                  resolve(loadedData);
                })
                .catch((error) => {
                  reject(error);
                });
            } else if (component.pagesLoaded === component.totalPages) {

              component.sheetData.sort((a: any, b: any) => {
                const dateKeys = ["Date", "Open_Date", 'Date_Creation'];
                let dateKeyA = "";
                let dateKeyB = "";

                // Find the first date key present in the object
                dateKeys.forEach((key) => {
                  if (!dateKeyA && a[key]) {
                    dateKeyA = key;
                  }
                  if (!dateKeyB && b[key]) {
                    dateKeyB = key;
                  }
                });

                // Compare the dates based on the keys found
                const dateA = a[dateKeyA];
                const dateB = b[dateKeyB];

                if (dateA < dateB) return -1;
                if (dateA > dateB) return 1;
                return 0;
              });
              component.IsSelectedSheetDataLoaded = true;

              resolve(component.sheetData);
            }
          }
        });
    });
  }
  //#endregion



  // #region For watchlist  aioSheet_allSheet_Non_Recursive

  loadSheetData_AllSheets(
    exchangeName: string,
    component: any,
    componentDestroyed$: Subject<void>
  ): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.googleSheetAPIServiceRef.getAIOSheetsData_AllSheets(exchangeName)
        .pipe(takeUntil(componentDestroyed$))
        .subscribe((data: any) => {



          for (let key in data.data) {
            data.data[key] = data.data[key].map((item: any) => {
              return {
                ...item,
                Available_Exchanges: item.Available_Exchanges.split(',')
              };
            });
          }



          // const sortedData = this.sortSheetData(data);
          component.sheetData = data.data;

          // component.symbols = component.sheetData?.Portfolio.map((item: any) => item.Market) || [];
          resolve(data);
        })
      // .catch((error) => {
      //   reject(error);
      // });
    });
  }

  //#endregion


  //#region loadSheetData For OpenOrders

  loadAllOpenOrders(
    exchangeName: string,
    sheetName: string,
    itemsPerPage: number,
    componentDestroyed$: Subject<void>
  ): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.loadSheetData_OpenOrders(exchangeName, sheetName, itemsPerPage, 1, componentDestroyed$, [])
        .then((sheetData_OpenOrders) => {
          const sortedData = this.sortSheetData(sheetData_OpenOrders);
          resolve(sortedData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  loadSheetData_OpenOrders(
    exchangeName: string,
    sheetName: string,
    itemsPerPage: number,
    page: number,
    componentDestroyed$: Subject<void>,
    accumulatedData: any[]
  ): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.googleSheetAPIServiceRef
        .getAIOSheetsData(exchangeName, sheetName, itemsPerPage, page)
        .pipe(takeUntil(componentDestroyed$))
        .subscribe((data: any) => {
          if (data) {
            const newDataArray: any[] = Object.values(data.data);
            accumulatedData = [...accumulatedData, ...newDataArray];

            if (page < data.totalPages) {
              // Recursive API call
              this.loadSheetData_OpenOrders(exchangeName, sheetName, itemsPerPage, page + 1, componentDestroyed$, accumulatedData)
                .then((loadedData) => {
                  resolve(loadedData);
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              resolve(accumulatedData);
            }
          }
        });
    });
  }

  private sortSheetData(sheetData: any[]): any[] {
    return sheetData.sort((a: any, b: any) => {
      const dateKeys = ["Date", "Open_Date", 'Date_Creation'];
      let dateKeyA = "";
      let dateKeyB = "";

      // Find the first date key present in the object
      dateKeys.forEach((key) => {
        if (!dateKeyA && a[key]) {
          dateKeyA = key;
        }
        if (!dateKeyB && b[key]) {
          dateKeyB = key;
        }
      });

      // Compare the dates based on the keys found
      const dateA = a[dateKeyA];
      const dateB = b[dateKeyB];

      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return 0;
    });
  }




  //#endregion















  //#region loadSheetData For dashboard

  loadAllSheetData_WithoutMatTable(
    exchangeName: string,
    sheetName: string,
    itemsPerPage: number,
    componentDestroyed$: Subject<void>
  ): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.loadSheetData_WithoutMatTable(exchangeName, sheetName, itemsPerPage, 1, componentDestroyed$, [])
        .then((sheetData_OpenOrders) => {
          const sortedData = this.sortSheetData_WithoutMatTable(sheetData_OpenOrders);
          resolve(sortedData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  loadSheetData_WithoutMatTable(
    exchangeName: string,
    sheetName: string,
    itemsPerPage: number,
    page: number,
    componentDestroyed$: Subject<void>,
    accumulatedData: any[]
  ): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.googleSheetAPIServiceRef
        .getAIOSheetsData(exchangeName, sheetName, itemsPerPage, page)
        .pipe(takeUntil(componentDestroyed$))
        .subscribe((data: any) => {
          if (data) {
            const newDataArray: any[] = Object.values(data.data);
            accumulatedData = [...accumulatedData, ...newDataArray];

            if (page < data.totalPages) {
              // Recursive API call
              this.loadSheetData_OpenOrders(exchangeName, sheetName, itemsPerPage, page + 1, componentDestroyed$, accumulatedData)
                .then((loadedData) => {
                  console.log(loadedData)
                  resolve(loadedData);
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              resolve(accumulatedData);
            }
          }
        });
    });
  }

  private sortSheetData_WithoutMatTable(sheetData: any[]): any[] {
    return sheetData.sort((a: any, b: any) => {
      const dateKeys = ["Date", "Open_Date", 'Date_Creation'];
      let dateKeyA = "";
      let dateKeyB = "";

      // Find the first date key present in the object
      dateKeys.forEach((key) => {
        if (!dateKeyA && a[key]) {
          dateKeyA = key;
        }
        if (!dateKeyB && b[key]) {
          dateKeyB = key;
        }
      });

      // Compare the dates based on the keys found
      const dateA = a[dateKeyA];
      const dateB = b[dateKeyB];

      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return 0;
    });
  }




  //#endregion
























  //#region For open Orders in spot trades.ts
  // sheetData_OpenOrders: any[] = [];
  // IsSheetDataLoaded_OpenOrders: boolean = false;



  // this.functionsServiceRef.loadAllOpenOrders(this.exchangeName, 'SIP_Open_Orders', 5,this.componentDestroyed$)
  // .then((sheetData_OpenOrders) => {
  //   this.sheetData_OpenOrders = sheetData_OpenOrders;
  //   this.IsSheetDataLoaded_OpenOrders=true;
  //   console.log('sheetData_OpenOrders : ', this.sheetData_OpenOrders);
  // })
  // .catch((error) => {
  //   console.error('Error loading open orders:', error);
  // });

  // IsSheetDataLoaded_OpenOrders: boolean = false;
  // sheetData_OpenOrders: any[] = [];
  // currentPage_OpenOrders = 1;
  // totalPages_OpenOrders = 1;
  // pagesLoaded_OpenOrders = 0;
  // pageSizeOptions_OpenOrders = 0;



  // nextPage_OpenOrders() {
  //   if (this.currentPage_OpenOrders < this.totalPages_OpenOrders) {
  //     this.functionsServiceRef.loadSheetData_OpenOrders(this.exchangeName, 'SIP_Open_Orders', 5, this.currentPage_OpenOrders + 1, this, this.componentDestroyed$);
  //   }
  // }

  // prevPage_OpenOrders() {
  //   if (this.currentPage_OpenOrders > 1) {
  //     this.functionsServiceRef.loadSheetData_OpenOrders(this.exchangeName, 'SIP_Open_Orders', 5, this.currentPage_OpenOrders - 1, this, this.componentDestroyed$);
  //   }
  // }





  //#endregion
  //#endregion




  //#region Sheets Operations


  createSheet(sheetName: string, headerData: string[]) {
    const formData = new FormData();
    formData.append('action', 'create');
    formData.append('sheetName', sheetName);

    if (headerData[0] != '') {
      formData.append('headerData', JSON.stringify(headerData));
    }

    this.googleSheetAPIServiceRef.performSheetAction(formData).then(response => {
      // console.log(response);
    });
  }

  deleteSheet(sheetName: string) {
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('sheetName', sheetName);

    this.googleSheetAPIServiceRef.performSheetAction(formData).then(response => {
      // console.log(response);
    });
  }

  renameSheet(sheetName: string, newName: string) {
    const formData = new FormData();
    formData.append('action', 'rename');
    formData.append('sheetName', sheetName);
    formData.append('newName', newName);

    this.googleSheetAPIServiceRef.performSheetAction(formData).then(response => {
      // console.log(response);
    });
  }

  sheetNames: string[] = [];
  getSheetNames() {
    const formData = new FormData();
    formData.append('action', 'getAllSheetNames');

    this.googleSheetAPIServiceRef.performSheetAction(formData).then(response => {
      this.sheetNames = response;
    });
  }

  appendHeaderData(sheetName: string, headerData?: string[]) {
    const formData = new FormData();
    formData.append('action', 'appendHeaderData');
    formData.append('sheetName', sheetName);
    formData.append('headerData', JSON.stringify(headerData));

    this.googleSheetAPIServiceRef.performSheetAction(formData).then(response => {
      // console.log(response);
    });
  }



  //#region Sample html file code 


  // <hr>

  // <!-- Input and Buttons for Create-->
  // <input #sheetNameInput type="text" placeholder="Sheet Name">
  // <input #sheetDataInput type="text" placeholder="Row Data (comma separated)">
  // <button class="btn btn-success" (click)="createSheet(sheetNameInput.value, sheetDataInput.value.split(','))">Create Sheet</button>

  // <hr>

  // <!-- Input and Buttons for Delete-->
  // <input #sheetNameToDelete type="text" placeholder="Sheet Name to Delete">
  // <button class="btn btn-danger" (click)="deleteSheet(sheetNameToDelete.value)"><mat-icon>delete</mat-icon></button>

  // <hr>

  // <!-- Input and Buttons for Rename-->
  // <input #sheetNameToRename type="text" placeholder="Current Sheet Name">
  // <input #newSheetName type="text" placeholder="New Sheet Name">
  // <button class="btn btn-primary" (click)="renameSheet(sheetNameToRename.value, newSheetName.value)"><mat-icon>edit</mat-icon></button>

  // <hr>

  // <!-- Input and Buttons for appendHeaderData-->
  // <input #sheetNameInputToAppend type="text" placeholder="Sheet Name">
  // <input #headerDataInput type="text" placeholder="Header Data (comma separated)">
  // <button class="btn btn-success" (click)="appendHeaderData(sheetNameInputToAppend.value, headerDataInput.value.split(','))">Append Header Data</button>

  // <hr>

  // <!-- Button to Get Sheet Names -->
  // <button class="btn btn-info" (click)="getSheetNames()">Get Sheet Names</button>
  // <div *ngIf="sheetNames">
  //   <p>Sheet Names:</p>
  //   <ul>
  //     <li *ngFor="let sheetName of sheetNames">{{ sheetName }}</li>
  //   </ul>
  // </div>



  //#endregion


  //#endregion

}
