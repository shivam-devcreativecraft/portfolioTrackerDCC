import { Component } from '@angular/core';

@Component({
  selector: 'app-kucoin-money-flow',
  templateUrl: './kucoin-money-flow.component.html',
  styleUrls: ['./kucoin-money-flow.component.scss']
})
export class KucoinMoneyFlowComponent {
  exchangeName:string='Kucoin'; //for 1. MatTablle , 2. deleteEntry()
   sheetName:string='Money_Flow' //for 1. MatTablle , 2. deleteEntry()
}
