import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioOurbitSheetsRoutingModule } from './portfolio-ourbit-sheets-routing.module';
import { PortfolioOurbitSheetsComponent } from './portfolio-ourbit-sheets.component';
import { OurbitFuturesComponent } from './ourbit-futures/ourbit-futures.component';
import { OurbitFuturesTransfersComponent } from './ourbit-futures-transfers/ourbit-futures-transfers.component';
import { OurbitMoneyFlowComponent } from './ourbit-money-flow/ourbit-money-flow.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { OurbitSpotTradesComponent } from './ourbit-spot-trades/ourbit-spot-trades.component';


@NgModule({
  declarations: [

    OurbitMoneyFlowComponent,
    OurbitFuturesComponent,
    
    OurbitFuturesTransfersComponent,
          OurbitSpotTradesComponent,






  ],
  imports: [
    CommonModule,
    PortfolioOurbitSheetsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    //STARTS material imports
    SharedMaterialImportsModule,
    MatChipsModule,
    HttpClientModule,


    //ENDS material imports

    NgApexchartsModule,
    HighchartsChartModule
  ]
})
export class PortfolioOurbitSheetsModule { }
