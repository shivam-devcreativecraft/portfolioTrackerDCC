import { Component } from '@angular/core';

@Component({
  selector: 'app-bybit-p2p',
  templateUrl: './bybit-p2p.component.html',
  styleUrls: ['./bybit-p2p.component.scss'],
})
export class BybitP2pComponent {
  exchangeName: string = 'Bybit'; //for 1. MatTablle , 2. deleteEntry()
  sheetName: string = 'P2P'; //for 1. MatTablle , 2. deleteEntry()
}
