import { Component } from '@angular/core';

@Component({
  selector: 'app-bybit-money-flow',
  templateUrl: './bybit-money-flow.component.html',
  styleUrls: ['./bybit-money-flow.component.scss'],
})
export class BybitMoneyFlowComponent {
   exchangeName:string='Bybit'; //for 1. MatTablle , 2. deleteEntry()
   sheetName:string='Money_Flow'; //for 1. MatTablle , 2. deleteEntry()

}
