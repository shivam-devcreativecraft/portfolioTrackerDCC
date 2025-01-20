import { Component } from '@angular/core';

@Component({
  selector: 'app-gateio-p2p',
  templateUrl: './gateio-p2p.component.html',
  styleUrls: ['./gateio-p2p.component.scss']
})
export class GateioP2pComponent {
  exchangeName: string = 'Gateio'; //for 1. MatTablle , 2. deleteEntry()
  sheetName: string = 'P2P'; //for 1. MatTablle , 2. deleteEntry()
}
