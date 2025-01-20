import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioGateioSheetsRoutingModule } from './portfolio-gateio-sheets-routing.module';
import { PortfolioGateioSheetsComponent } from './portfolio-gateio-sheets.component';
import { GateioSpotTradesComponent } from './gateio-spot-trades/gateio-spot-trades.component';
import { GateioMoneyFlowComponent } from './gateio-money-flow/gateio-money-flow.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { GateioP2pComponent } from './gateio-p2p/gateio-p2p.component';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { GateioFuturesComponent } from './gateio-futures/gateio-futures.component';


@NgModule({
  declarations: [
    PortfolioGateioSheetsComponent,
    GateioSpotTradesComponent,
    GateioMoneyFlowComponent,
    GateioP2pComponent,
    GateioFuturesComponent
  ],
  imports: [
    CommonModule,
    PortfolioGateioSheetsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialImportsModule,
    MatChipsModule,
    SharedModule
  ]
})
export class PortfolioGateioSheetsModule { }
