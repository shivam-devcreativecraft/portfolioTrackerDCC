import { Component } from '@angular/core';

@Component({
  selector: 'app-ourbit-futures',
  templateUrl: './ourbit-futures.component.html',
  styleUrls: ['./ourbit-futures.component.scss']
})
export class OurbitFuturesComponent {
  exchangeName:string='Ourbit'; //for 1. MatTablle , 2. deleteEntry()
  sheetName:string='Futures' //for 1. MatTablle , 2. deleteEntry()
}
