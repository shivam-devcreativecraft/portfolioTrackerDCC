import { Component } from '@angular/core';

@Component({
  selector: 'app-kucoin-futures',
  templateUrl: './kucoin-futures.component.html',
  styleUrls: ['./kucoin-futures.component.scss']
})
export class KucoinFuturesComponent {
  exchangeName:string='Kucoin'; //for 1. MatTablle , 2. deleteEntry()
  sheetName:string='Futures' //for 1. MatTablle , 2. deleteEntry()
}
