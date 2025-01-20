import { Component, OnInit } from '@angular/core';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-open-orders-aio-binance',
  templateUrl: './open-orders-aio-binance.component.html',
  styleUrls: ['./open-orders-aio-binance.component.scss']
})
export class OpenOrdersAioBinanceComponent implements OnInit {
  exchangeName: string = 'Binance';



constructor(
  private googleSheetAPIServiceRef: GoogleSheetApiService,

){}

ngOnInit(): void {
  this.googleSheetAPIServiceRef.setSheetName(this.exchangeName)
  
}

}
