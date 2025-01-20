import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenOrdersAioRoutingModule } from './open-orders-aio-routing.module';
import { OpenOrdersAioComponent } from './open-orders-aio.component';
import { OpenOrdersAioDashboardComponent } from './open-orders-aio-dashboard/open-orders-aio-dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';


@NgModule({
  declarations: [
    OpenOrdersAioComponent,
    OpenOrdersAioDashboardComponent
  ],
  imports: [
    CommonModule,
    OpenOrdersAioRoutingModule,
    HighchartsChartModule,
    SharedMaterialImportsModule
  ]
})
export class OpenOrdersAioModule { }
