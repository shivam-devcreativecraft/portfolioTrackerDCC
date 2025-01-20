import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PortfolioOurbitRoutingModule } from './portfolio-ourbit-routing.module';
import { PortfolioOurbitComponent } from './portfolio-ourbit.component';
import { PortfolioOurbitDashboardComponent } from './portfolio-ourbit-dashboard/portfolio-ourbit-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClientModule } from '@angular/common/http';
import { PortfolioOurbitSheetsComponent } from './portfolio-ourbit-sheets/portfolio-ourbit-sheets.component';
import { PortfolioDashboardOurbitFuturesComponent } from './portfolio-ourbit-dashboard/portfolio-dashboard-ourbit-futures/porfolio-dashboard-ourbit-futures.component';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { SharedModule } from '../SharedComponents/shared.module';


@NgModule({
  declarations: [
    PortfolioOurbitComponent,
    PortfolioOurbitSheetsComponent,
    PortfolioOurbitDashboardComponent,

    PortfolioDashboardOurbitFuturesComponent




  ],
  providers : [DatePipe],

  imports: [
    CommonModule,
    PortfolioOurbitRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgApexchartsModule,
    SharedMaterialImportsModule,
    SharedModule,
    HighchartsChartModule,
    HttpClientModule
  ]
})
export class PortfolioOurbitModule { }
