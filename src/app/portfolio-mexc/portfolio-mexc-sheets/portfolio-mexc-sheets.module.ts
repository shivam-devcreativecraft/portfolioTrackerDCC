import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PortfolioMexcSheetsRoutingModule } from './portfolio-mexc-sheets-routing.module';
import { MexcMoneyFlowComponent } from './mexc-money-flow/mexc-money-flow.component';
// import { MexcFuturesActPositionsComponent } from './mexc-futures-act-positions/mexc-futures-act-positions.component';


//STARTS material imports
import { HttpClientModule } from '@angular/common/http';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { MatChipsModule } from '@angular/material/chips';
import { MexcFuturesComponent } from './mexc-futures/mexc-futures.component';


import { NgApexchartsModule } from 'ng-apexcharts';
import { HighchartsChartModule } from 'highcharts-angular';

import { MexcSpotTradesComponent } from './mexc-spot-trades/mexc-spot-trades.component';
import { SharedModule } from 'src/app/SharedComponents/shared.module';



@NgModule({
  declarations: [
    MexcMoneyFlowComponent,
    // MexcFuturesActPositionsComponent,
    MexcFuturesComponent,
    
    MexcSpotTradesComponent,
    

  ],
  imports: [
    CommonModule,
    PortfolioMexcSheetsRoutingModule,
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
export class PortfolioMexcSheetsModule { }
