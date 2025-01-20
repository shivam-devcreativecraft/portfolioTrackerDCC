import { Component } from '@angular/core';

@Component({
  selector: 'app-kucoin-p2p',
  templateUrl: './kucoin-p2p.component.html',
  styleUrls: ['./kucoin-p2p.component.scss']
})
export class KucoinP2pComponent {
  exchangeName: string = 'Kucoin'; //for 1. MatTablle , 2. deleteEntry()
  sheetName: string = 'P2P'; //for 1. MatTablle , 2. deleteEntry()
}
