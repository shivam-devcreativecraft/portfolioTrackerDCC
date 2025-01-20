import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';

import { DemoTradingRoutingModule } from './demo-trading-routing.module';
import { DemoTradingComponent } from './demo-trading.component';
import { DemoTradingSheetsComponent } from './demo-trading-sheets/demo-trading-sheets.component';
import { DemoTradingDashboardComponent } from './demo-trading-dashboard/demo-trading-dashboard.component';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { DisableNumberInputScrollDirective } from '../directives/disable-number-input-scroll.directive';
import { AddDemoTradingDeltaFuturesComponent } from './add-demo-trading-delta-futures/add-demo-trading-delta-futures.component';


@NgModule({
  declarations: [
    DemoTradingComponent,
    DemoTradingSheetsComponent,
    DemoTradingDashboardComponent,
    AddDemoTradingDeltaFuturesComponent,
    // DisableNumberInputScrollDirective

  ],
  imports: [
    CommonModule,
    DemoTradingRoutingModule,
    SharedMaterialImportsModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    HighchartsChartModule
  ]
})
export class DemoTradingModule { }
