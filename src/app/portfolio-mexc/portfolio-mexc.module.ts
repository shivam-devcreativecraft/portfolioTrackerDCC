import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { PortfolioMexcRoutingModule } from './portfolio-mexc-routing.module';
import { PortfolioMexcComponent } from './portfolio-mexc.component';
import { PortfolioMexcSheetsComponent } from './portfolio-mexc-sheets/portfolio-mexc-sheets.component';
import { PortfolioMexcDashboardComponent } from './portfolio-mexc-dashboard/portfolio-mexc-dashboard.component';
//STARTS material imports
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { PortfolioDashboardMexcMoneyFlowComponent } from './portfolio-mexc-dashboard/portfolio-dashboard-mexc-money-flow/portfolio-dashboard-mexc-money-flow.component';
import { PortfolioDashboardMexcTotalStatsComponent } from './portfolio-mexc-dashboard/portfolio-dashboard-mexc-total-stats/portfolio-dashboard-mexc-total-stats.component';
import { NgApexchartsModule } from 'ng-apexcharts';

import { PortfolioDashboardMexcSipComponent } from './portfolio-mexc-dashboard/portfolio-dashboard-mexc-sip/portfolio-dashboard-mexc-sip.component';


// high charts
import { HighchartsChartModule } from 'highcharts-angular';
import { PortfolioDashboardMexcFuturesComponent } from './portfolio-mexc-dashboard/portfolio-dashboard-mexc-futures/portfolio-dashboard-mexc-futures.component';
import { PortfolioDashboardMexcFuturesPnlCalenderComponent } from './portfolio-mexc-dashboard/portfolio-dashboard-mexc-futures/portfolio-dashboard-mexc-futures-pnl-calender/portfolio-dashboard-mexc-futures-pnl-calender.component';
import { SharedModule } from '../SharedComponents/shared.module';



@NgModule({
  declarations: [
    PortfolioMexcComponent,
    PortfolioMexcSheetsComponent,
    PortfolioMexcDashboardComponent,

    PortfolioDashboardMexcMoneyFlowComponent,
    PortfolioDashboardMexcTotalStatsComponent,
    PortfolioDashboardMexcFuturesComponent,
    PortfolioDashboardMexcSipComponent,
    PortfolioDashboardMexcFuturesPnlCalenderComponent
  ],
  providers : [DatePipe],
  imports: [
    CommonModule,
    PortfolioMexcRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    //STARTS material imports
    NgApexchartsModule,
   SharedMaterialImportsModule,
    SharedModule,
    HttpClientModule,
    SharedModule,

    HighchartsChartModule
  ]
})
export class PortfolioMexcModule { }
