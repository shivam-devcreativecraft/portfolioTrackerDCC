import { Component } from '@angular/core';

@Component({
  selector: 'app-delta-money-flow',
  templateUrl: './delta-money-flow.component.html',
  styleUrls: ['./delta-money-flow.component.scss']
})
export class DeltaMoneyFlowComponent {
  exchangeName:string='Delta'; //for 1. MatTablle , 2. deleteEntry()
  sheetName:string='Money_Flow'; //for 1. MatTablle , 2. deleteEntry()
}
