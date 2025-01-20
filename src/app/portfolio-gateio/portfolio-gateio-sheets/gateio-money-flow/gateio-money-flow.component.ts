import { Component } from '@angular/core';

@Component({
  selector: 'app-gateio-money-flow',
  templateUrl: './gateio-money-flow.component.html',
  styleUrls: ['./gateio-money-flow.component.scss']
})
export class GateioMoneyFlowComponent {
  exchangeName:string='Gateio'; //for 1. MatTablle , 2. deleteEntry()
   sheetName:string='Money_Flow' //for 1. MatTablle , 2. deleteEntry()
}
