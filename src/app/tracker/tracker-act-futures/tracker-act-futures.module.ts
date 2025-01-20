import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackerActFuturesRoutingModule } from './tracker-act-futures-routing.module';
import { TrackerActFuturesComponent } from './tracker-act-futures.component';
import { ActFuturesRealComponent } from './act-futures-real/act-futures-real.component';
import { ActFuturesDemoComponent } from './act-futures-demo/act-futures-demo.component';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';


@NgModule({
  declarations: [
    TrackerActFuturesComponent,
    ActFuturesRealComponent,
    ActFuturesDemoComponent
  ],
  imports: [
    CommonModule,
    TrackerActFuturesRoutingModule,
    SharedMaterialImportsModule
  ]
})
export class TrackerActFuturesModule { }
