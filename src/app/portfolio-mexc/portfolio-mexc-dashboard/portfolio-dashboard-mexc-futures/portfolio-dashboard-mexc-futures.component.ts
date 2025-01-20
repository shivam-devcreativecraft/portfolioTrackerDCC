import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-portfolio-dashboard-mexc-futures',
  templateUrl: './portfolio-dashboard-mexc-futures.component.html',
  styleUrls: ['./portfolio-dashboard-mexc-futures.component.scss']
})
export class PortfolioDashboardMexcFuturesComponent {
  exchangeName: string = 'Mexc';
  sheetName: string = 'Futures';

}
