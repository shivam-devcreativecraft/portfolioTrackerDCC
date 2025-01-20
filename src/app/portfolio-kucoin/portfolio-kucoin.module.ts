import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PortfolioKucoinRoutingModule } from './portfolio-kucoin-routing.module';
import { PortfolioKucoinComponent } from './portfolio-kucoin.component';
import { PortfolioKucoinDashboardComponent } from './portfolio-kucoin-dashboard/portfolio-kucoin-dashboard.component';
import { SharedModule } from '../SharedComponents/shared.module';


@NgModule({
  declarations: [
    PortfolioKucoinComponent,
    PortfolioKucoinDashboardComponent,
  ],
  imports: [
    CommonModule,
    PortfolioKucoinRoutingModule,
    SharedModule
  ],
  

})
export class PortfolioKucoinModule { }
