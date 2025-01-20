import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BinanceAPIService } from 'src/app/services/WorkingExchangeAPI/binanceAPI.service';

@Component({
  selector: 'app-open-orders-exchange',
  templateUrl: './open-orders-exchange.component.html',
  styleUrls: ['./open-orders-exchange.component.scss']
})
export class OpenOrdersExchangeComponent {


  openOrders: any[] = [];
  isOpenOrdersDataLoaded: boolean = false;
  exchangeName: string = '';
  filteredOrders: any[] = [];
  selectedFilter: string = 'SINGLE'

  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OpenOrdersExchangeComponent>,
    private binanceAPIServiceRef: BinanceAPIService
  ) {
    // console.log(data)
    if (data) {
      this.openOrders = data.openOrders;
      this.exchangeName = data.exchangeName;
      this.filteredOrders = this.openOrders.filter(order => order.symbol === (this.data.tradingPair) + 'USDT');
      this.isOpenOrdersDataLoaded = true;
      
    }
    // this.exchangeName = (data.exchangeName).toUpperCase();
    // this.binanceAPIServiceRef.getOpenOrders().subscribe((res: any) => {
    //   if (res) {
    //     this.openOrders = res;
    //     this.filteredOrders = this.openOrders.filter(order => order.symbol === (this.data.tradingPair) + 'USDT');

    //     console.log(data, res);
    //     this.isOpenOrdersDataLoaded = true;
    //   }
    // });
  }

  show(param: string) {
    switch (param) {
      case 'ALL':
        this.selectedFilter = param
        this.filteredOrders = [...this.openOrders];
        break;
      case 'SINGLE':
        this.selectedFilter = param

        this.filteredOrders = this.openOrders.filter(order => order.symbol === (this.data.tradingPair) + 'USDT');
        break;
      default:
        this.selectedFilter = param

        this.filteredOrders = [...this.openOrders];
        break;
    }
    // console.log(this.filteredOrders);
  }


  onClose(): void {
    this.dialogRef.close();
  }
}
