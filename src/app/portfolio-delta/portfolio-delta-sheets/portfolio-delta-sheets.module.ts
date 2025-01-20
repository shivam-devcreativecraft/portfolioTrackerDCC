import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioDeltaSheetsRoutingModule } from './portfolio-delta-sheets-routing.module';
import { PortfolioDeltaSheetsComponent } from './portfolio-delta-sheets.component';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { DeltaFuturesComponent } from './delta-futures/delta-futures.component';
import { DeltaOptionsComponent } from './delta-options/delta-options.component';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { DeltaMoneyFlowComponent } from './delta-money-flow/delta-money-flow.component';
import { SharedModule } from 'src/app/SharedComponents/shared.module';


@NgModule({
  declarations: [
    PortfolioDeltaSheetsComponent,
    DeltaFuturesComponent,
    DeltaOptionsComponent,
    DeltaMoneyFlowComponent,
  ],
  imports: [ 
    CommonModule,
    PortfolioDeltaSheetsRoutingModule,
    SharedModule,
    SharedMaterialImportsModule,
    MatChipsModule,
    FormsModule
  ]
})
export class PortfolioDeltaSheetsModule { }
