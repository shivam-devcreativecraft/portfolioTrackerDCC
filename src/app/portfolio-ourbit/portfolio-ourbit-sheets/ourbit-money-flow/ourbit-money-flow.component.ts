import { Component } from '@angular/core';

@Component({
  selector: 'app-ourbit-money-flow',
  templateUrl: './ourbit-money-flow.component.html',
  styleUrls: ['./ourbit-money-flow.component.scss']
})
export class OurbitMoneyFlowComponent {
  exchangeName:string='Ourbit'; //for 1. MatTablle , 2. deleteEntry()
  sheetName:string='Money_Flow' //for 1. MatTablle , 2. deleteEntry()
}
