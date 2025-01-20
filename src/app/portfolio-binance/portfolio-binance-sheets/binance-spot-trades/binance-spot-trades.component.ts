import {Component} from '@angular/core';

@Component({
  selector: 'app-binance-spot-trades',
  templateUrl: './binance-spot-trades.component.html',
  styleUrls: ['./binance-spot-trades.component.scss']
})
export class BinanceSpotTradesComponent {
  exchangeName: string = 'Binance';
}