import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenOrdersAioSheetsRoutingModule } from './open-orders-aio-sheets-routing.module';
import { OpenOrdersAioSheetsComponent } from './open-orders-aio-sheets.component';
import { MatChipsModule } from '@angular/material/chips';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { OpenOrdersAioBinanceComponent } from './open-orders-aio-binance/open-orders-aio-binance.component';
import { OpenOrdersAioBybitComponent } from './open-orders-aio-bybit/open-orders-aio-bybit.component';
import { OpenOrdersAioMexcComponent } from './open-orders-aio-mexc/open-orders-aio-mexc.component';
import { OpenOrdersAioKucoinComponent } from './open-orders-aio-kucoin/open-orders-aio-kucoin.component';
import { OpenOrdersAioGateioComponent } from './open-orders-aio-gateio/open-orders-aio-gateio.component';
import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [
    OpenOrdersAioSheetsComponent,
    OpenOrdersAioBinanceComponent,
    OpenOrdersAioBybitComponent,
    OpenOrdersAioMexcComponent,
    OpenOrdersAioKucoinComponent,
    OpenOrdersAioGateioComponent
  ],
  imports: [
    CommonModule,
    OpenOrdersAioSheetsRoutingModule,
    SharedMaterialImportsModule,
    MatChipsModule,
    // HighchartsChartModule,
    SharedModule
  ]
})
export class OpenOrdersAioSheetsModule { }
 