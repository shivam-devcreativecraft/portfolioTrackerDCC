import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-bybit-futures-closed-pnl',
  templateUrl: './bybit-futures-closed-pnl.component.html',
  styleUrls: ['./bybit-futures-closed-pnl.component.scss'],
})
export class BybitFuturesClosedPnlComponent  {
  exchangeName:string='Bybit'; //for 1. MatTablle , 2. deleteEntry()
  sheetName:string='Futures_Closed_Pnl' //for 1. MatTablle , 2. deleteEntry()
  
}
