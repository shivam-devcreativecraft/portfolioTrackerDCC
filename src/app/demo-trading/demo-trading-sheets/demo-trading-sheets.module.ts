import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoTradingSheetsRoutingModule } from './demo-trading-sheets-routing.module';
import { DeltaExchangeComponent } from './delta-exchange/delta-exchange.component';
import { DemoTradeFuturesComponent } from './demo-trade-futures/demo-trade-futures.component';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [
    DeltaExchangeComponent,
    DemoTradeFuturesComponent
  ],
  imports: [
    CommonModule,
    DemoTradingSheetsRoutingModule,
    SharedMaterialImportsModule,
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    MatDatepickerModule
  ]
})
export class DemoTradingSheetsModule { }
