import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.scss']
})
export class NewOrdersComponent implements OnInit {

  public Period: string = '';
  public Notes: string = '';
  public TradingView_Account: string = 'shivamcp10june@gmail.com';


  public influencerControl = new FormControl();
  filteredInfluencers: Observable<string[]>[] = [];

  public Influencer: string = '';


  public notes: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public newOrdersDataInjected: any,
    private dataServiceRef: DataService,
    private googleSheetAPIRef: GoogleSheetApiService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<NewOrdersComponent>,
    private _dialog: MatDialog,
    private router: Router

  ) {




  }


  ngOnInit(): void {
    console.log(this.newOrdersDataInjected)
    this.newOrdersData[0].NewOrders.forEach((order: any, index: number) => {
      order.influencerControl = new FormControl('');
      this.filteredInfluencers[index] = order.influencerControl.valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filter(value))
      );
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.dataServiceRef.influencersList.filter(option => option.toLowerCase().includes(filterValue));
  }

  clearInfluencer(index: number): void {
    this.newOrdersData[0].NewOrders[index].influencerControl.setValue('');
  }




  newOrdersData = this.newOrdersDataInjected;




  uploadingStates: { [key: string]: boolean } = {}; // Object to track loading state for each item
  uploadCount: number = 0;





  async uplaodData(ExchangeName_param: string, SheetName_param: string, newOrders_param: any, index: number, notes?: string) {



    try {
      // Set the loading state to true for the specific item
      this.uploadingStates[index] = true;
      // Extract the influencer value from the FormControl
      const influencer = newOrders_param.influencerControl ? newOrders_param.influencerControl.value : newOrders_param.influencer;

      // Update the newOrders_param with the extracted influencer value
      newOrders_param.influencer = influencer;

      switch (ExchangeName_param) {

        case 'Bybit': {
          switch (SheetName_param) {
            case 'Futures_Closed_Pnl':
              await this.processFuturesClosedPnlTrades_Bybit(ExchangeName_param, SheetName_param, newOrders_param, notes);
              break;
            // case 'Spot_Trades':
            //   await this.processSpotTrades_Bybit(ExchangeName_param, SheetName_param, newOrders_param);
            //   break;
            case 'Futures_Closed_Pnl_Demo':
              await this.processFuturesClosedPnlTrades_Bybit(ExchangeName_param, SheetName_param, newOrders_param, notes);
              break;

          }
          break;

        }

        case 'Demo_Trading': {
          switch (SheetName_param) {
            case 'Futures':
              await this.processFuturesClosedPnlTrades_Bybit(ExchangeName_param, SheetName_param, newOrders_param, notes);
              break;
            // case 'Spot_Trades':
            //   await this.processSpotTrades_Bybit(ExchangeName_param, SheetName_param, newOrders_param);
            //   break;
          }
          break;

        }



        case 'Mexc': {
          switch (SheetName_param) {
            case 'Futures':
              await this.processFuturePositionTrades_Mexc(ExchangeName_param, SheetName_param, newOrders_param, notes)
              break;
          }
          break;
        }



      }



    } catch (error: any) {
      this.toastr.error(error, 'Something went wrong!');
    } finally {
      // Set the loading state to false for the specific item regardless of success or failure
      this.uploadingStates[index] = false;

      // if (this.newOrdersData[0].NewOrders.length <= 0) {

      //   const currentUrl = this.router.url;
      //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //     this.router.navigate([currentUrl]);
      //   });

      // }
    }

    // Optional: Perform any final actions after the switch statement.

    // Close the dialog
    // this.dialogRef.close();
  }














  // displayFn(value: string): string {
  //   return value || '';
  // }

  // async processSpotTrades_Bybit(ExchangeName_param: string, SheetName_param: string, newOrders_param: any) {


  //   let T_ID = '';
  //   let O_NO = '';

  //   // Include common data in each request


  //   // for (const newOrders_param of newOrders_param.NewOrders) {

  //   const elementFormData = new FormData();
  //   elementFormData.append('action', 'add');
  //   elementFormData.append('ExchangeName', ExchangeName_param);
  //   elementFormData.append('SheetName', SheetName_param);

  //   elementFormData.append('Date', newOrders_param.execTime.toString());
  //   elementFormData.append('Market', newOrders_param.symbol.toUpperCase().replace('USDT', ''));
  //   elementFormData.append('Direction', newOrders_param.side.toUpperCase());
  //   elementFormData.append('Total_USDT', (newOrders_param.execQty * newOrders_param.execPrice).toString());
  //   elementFormData.append('Price', newOrders_param.execPrice);
  //   elementFormData.append('Amount', newOrders_param.execQty);
  //   elementFormData.append('Fees', newOrders_param.execFee);

  //   elementFormData.append('Influencer', newOrders_param.influencer);
  //   // elementFormData.append('Transaction_ID', T_ID);
  //   // elementFormData.append('Order_No', O_NO);
  //   elementFormData.append('Period', this.Period);
  //   elementFormData.append('Notes', notes);
  //   elementFormData.append('TradingView_Account', this.TradingView_Account);


  //   try {
  //     const response = await this.googleSheetAPIRef.addNewEntry_AIO(elementFormData);


  //     // Remove the element based on 'execTime'
  //     this.newOrdersData[0].NewOrders = this.newOrdersData[0].NewOrders.filter((order: any) => order.execTime !== newOrders_param.execTime);
  //     if (this.newOrdersData[0].NewOrders.length <= 0) {
  //       this.dialogRef.close();
  //       this.dataServiceRef.sendAllNewOrdersUploadedObservable(true)

  //     }

  //     this.toastr.success(response.message, 'Successful!');




  //   } catch (error: any) {
  //     this.toastr.error(error, 'Something went wrong!');
  //   }
  //   // }
  // }


  async processFuturesClosedPnlTrades_Bybit(ExchangeName_param: string, SheetName_param: string, newOrders_param: any, notes: any) {
    // console.log("OnClick uploadData inside processSpotTrades  : ", newOrders_param);

    let T_ID = '';
    let O_NO = '';

    // Include common data in each request



    // for (const newOrders_param of newOrders_param.NewOrders) {

    const elementFormData = new FormData();
    elementFormData.append('action', 'add');
    elementFormData.append('ExchangeName', ExchangeName_param);
    elementFormData.append('SheetName', SheetName_param);

    elementFormData.append('Date_Creation', newOrders_param.createdTime.toString());
    elementFormData.append('Contracts', newOrders_param.symbol.toUpperCase().replace('USDT', ''));
    elementFormData.append('Opening_Direction', newOrders_param.side.toUpperCase());
    elementFormData.append('Closing_Direction', newOrders_param.side.toUpperCase());
    elementFormData.append('Closed_Pnl_Percentage', (this.calculateClosedPnlPercentage(newOrders_param)).toString());

    elementFormData.append('Leverage', newOrders_param.leverage);

    elementFormData.append('Qty', newOrders_param.qty);
    elementFormData.append('Entry_Price', newOrders_param.avgEntryPrice);
    elementFormData.append('Exit_Price', newOrders_param.avgExitPrice);
    elementFormData.append('Closed_Pnl', (newOrders_param.closedPnl).toString());
    elementFormData.append('Exit_Type', newOrders_param.execType);
    elementFormData.append('Influencer', newOrders_param.influencer.toUpperCase());
    elementFormData.append('Notes', notes ? notes : '');





    elementFormData.append('Order_Id', newOrders_param.orderId);



    try {

      await this.googleSheetAPIRef.addNewEntry_AIO(elementFormData).then((response: any) => {
        if (response.message) {
          this.toastr.success(response.message, 'Successful!');

          this.uploadCount++;

          this.newOrdersData[0].NewOrders = this.newOrdersData[0].NewOrders.filter((order: any) => order.createdTime !== newOrders_param.createdTime);
          if (this.newOrdersData[0].NewOrders.length <= 0) {
            // this.onClose()
            this.dataServiceRef.sendAllNewOrdersUploadedObservable(true)

          }

        }
        if (response.error) {
          this.toastr.error(response.error, 'Failed!');

        }
      });

      // return

      // Remove the element based on 'execTime'





    } catch (error: any) {
      this.toastr.error(error, 'Something went wrong!');
    }
    // }
  }


  async processFuturePositionTrades_Mexc(ExchangeName_param: string, SheetName_param: string, newOrders_param: any, notes: any) {

    const elementFormData = new FormData();
    elementFormData.append('action', 'add');
    elementFormData.append('ExchangeName', ExchangeName_param);
    elementFormData.append('SheetName', SheetName_param);

    elementFormData.append('Open_Date', newOrders_param.createTime.toString());
    elementFormData.append('Trading_Pair', newOrders_param.symbol.toUpperCase());
    elementFormData.append('Direction', newOrders_param.positionType.toUpperCase());
    elementFormData.append('Leverage', newOrders_param.leverage);
    elementFormData.append('Entry_Price', newOrders_param.openAvgPrice);
    elementFormData.append('Amount_Coin', newOrders_param.closeVol);
    elementFormData.append('Exit_Price', newOrders_param.closeAvgPrice);

    elementFormData.append('Pnl_USDT', newOrders_param.realised);
    // const pnlPercentage = ((newOrders_param.realised) / (newOrders_param.openAvgPrice * newOrders_param.closeVol / newOrders_param.leverage) * 100).toFixed(3)
    elementFormData.append('Pnl_Percentage', (this.calculateClosedPnlPercentage(newOrders_param)).toString());

    elementFormData.append('Close_Date', newOrders_param.updateTime);
    elementFormData.append('Influencer', newOrders_param.influencer.toUpperCase());
    elementFormData.append('Notes', notes ? notes : '');



    try {
      await this.googleSheetAPIRef.addNewEntry_AIO(elementFormData).then((response: any) => {
        if (response.message) {
          this.toastr.success(response.message, 'Successful!');

          this.uploadCount++;

          this.newOrdersData[0].NewOrders = this.newOrdersData[0].NewOrders.filter((order: any) => order.updateTime !== newOrders_param.updateTime);

          if (this.newOrdersData[0].NewOrders.length <= 0) {
            // this.onClose()
            this.dataServiceRef.sendAllNewOrdersUploadedObservable(true)

          }

        }
        if (response.error) {
          this.toastr.error(response.error, 'Failed!');

        }
      });

      // return

      // Remove the element based on 'execTime'




    } catch (error: any) {
      this.toastr.error(error, 'Something went wrong!');
    }

  }


  calculateClosedPnlPercentage(newOrdersParam: any): string {

    let pnlPercentage: any;
    if (this.newOrdersData[0].ExchangeName == 'Bybit' || this.newOrdersData[0].ExchangeName == 'Demo_Trading') {
      pnlPercentage = (newOrdersParam.side).toUpperCase() === 'SELL'
        ? (((newOrdersParam.cumEntryValue - newOrdersParam.cumExitValue) /
          newOrdersParam.cumEntryValue) * newOrdersParam.leverage * 100)
        : (((newOrdersParam.cumExitValue - newOrdersParam.cumEntryValue) /
          newOrdersParam.cumEntryValue) * newOrdersParam.leverage * 100);
    }

    if (this.newOrdersData[0].ExchangeName == 'Mexc') {
      pnlPercentage = (newOrdersParam.positionType).toUpperCase() === 'SELL'
        ? (((newOrdersParam.openAvgPrice - newOrdersParam.closeAvgPrice) /
          newOrdersParam.openAvgPrice) * newOrdersParam.leverage * 100)
        : (((newOrdersParam.closeAvgPrice - newOrdersParam.openAvgPrice) /
          newOrdersParam.openAvgPrice) * newOrdersParam.leverage * 100);
    }


    return pnlPercentage.toFixed(3); // Return the percentage with two decimal places
  }




  onClose(): void {

    this.dialogRef.close();


    if (this.uploadCount != 0) {





      const message = `New Data Update Found ! Refresh Data ?`;

      const dialogData = new ConfirmDialogModel("Confirm", message);

      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        // position: { left: '550px', top: '365px' }, // Adjust these values as needed
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult === true) {


          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {

            this.router.navigate([currentUrl]);
          });



        } else {

          // this.toastr.warning("Cancelled !")

        }
      });






















    }

    // this.uploadCount = 0;

  }
}
