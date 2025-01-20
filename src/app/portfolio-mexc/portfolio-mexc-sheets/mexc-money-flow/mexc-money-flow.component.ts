import { Component, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-mexc-money-flow',
  templateUrl: './mexc-money-flow.component.html',
  styleUrls: ['./mexc-money-flow.component.scss'],
})
export class MexcMoneyFlowComponent {
   exchangeName:string='Mexc'; //for 1. MatTablle , 2. deleteEntry()
   sheetName:string='Money_Flow' //for 1. MatTablle , 2. deleteEntry()
}
