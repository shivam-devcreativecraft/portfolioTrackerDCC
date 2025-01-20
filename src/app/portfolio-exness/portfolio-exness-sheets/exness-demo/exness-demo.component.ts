import { Component } from '@angular/core';

@Component({
  selector: 'app-exness-demo',
  templateUrl: './exness-demo.component.html',
  styleUrls: ['./exness-demo.component.scss']
})
export class ExnessDemoComponent {
  exchangeName:string='Exness'; //for 1. MatTablle , 2. deleteEntry()
  sheetName:string='ACT_Forex_Demo' //for 1. MatTablle , 2. deleteEntry()
}
