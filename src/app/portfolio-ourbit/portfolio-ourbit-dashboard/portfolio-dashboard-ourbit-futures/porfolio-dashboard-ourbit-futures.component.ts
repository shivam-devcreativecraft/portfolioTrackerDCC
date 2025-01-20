import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-portfolio-dashboard-ourbit-futures',
  templateUrl: './portfolio-dashboard-ourbit-futures.component.html',
  styleUrls: ['./portfolio-dashboard-ourbit-futures.component.scss']
})
export class PortfolioDashboardOurbitFuturesComponent   {
  exchangeName: string = 'Ourbit';
  sheetName: string = 'Futures';

}
