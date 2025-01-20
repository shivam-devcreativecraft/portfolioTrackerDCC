import { Component } from '@angular/core';

@Component({
  selector: 'app-exness-real',
  templateUrl: './exness-real.component.html',
  styleUrls: ['./exness-real.component.scss']
})
export class ExnessRealComponent {
  exchangeName:string='Exness'; //for 1. MatTablle , 2. deleteEntry()
  sheetName:string='ACT_Forex_Real' //for 1. MatTablle , 2. deleteEntry()
}
