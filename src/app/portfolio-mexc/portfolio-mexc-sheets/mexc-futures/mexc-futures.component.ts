import { Component} from '@angular/core';

@Component({
  selector: 'app-mexc-futures',
  templateUrl: './mexc-futures.component.html',
  styleUrls: ['./mexc-futures.component.scss'],
})
export class MexcFuturesComponent {
  exchangeName:string='Mexc'; //for 1. MatTablle , 2. deleteEntry()
  sheetName:string='Futures' //for 1. MatTablle , 2. deleteEntry()

}
