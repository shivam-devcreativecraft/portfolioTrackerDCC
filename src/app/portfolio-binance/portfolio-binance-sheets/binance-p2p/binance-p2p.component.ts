import { Component } from '@angular/core';

@Component({
  selector: 'app-binance-p2p',
  templateUrl: './binance-p2p.component.html',
  styleUrls: ['./binance-p2p.component.scss'],
})
export class BinanceP2pComponent  {
   exchangeName:string='Binance'; //for 1. MatTablle , 2. deleteEntry()
   sheetName:string='P2P' //for 1. MatTablle , 2. deleteEntry()
 }
