import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PortfolioFreebitcoRoutingModule } from './portfolio-freebitco-routing.module';
import { PortfolioFreebitcoComponent } from './portfolio-freebitco.component';
import { PortfolioFreebitcoDashboardComponent } from './portfolio-freebitco-dashboard/portfolio-freebitco-dashboard.component';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { CountdownTimerComponent } from '../SharedComponents/countdown-timer/countdown-timer.component';
import { SharedModule } from '../SharedComponents/shared.module';


@NgModule({
  declarations: [
    PortfolioFreebitcoComponent,
    PortfolioFreebitcoDashboardComponent,


  ],
  providers : [DatePipe],

  imports: [
    CommonModule,
    PortfolioFreebitcoRoutingModule,
    SharedMaterialImportsModule,
    HighchartsChartModule,
    SharedModule
    
  ]
})
export class PortfolioFreebitcoModule { }
