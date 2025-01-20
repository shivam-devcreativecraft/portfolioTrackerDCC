import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PortfolioKucoinSheetsRoutingModule } from './portfolio-kucoin-sheets-routing.module';
import { PortfolioKucoinSheetsComponent } from './portfolio-kucoin-sheets.component';
import { KucoinMoneyFlowComponent } from './kucoin-money-flow/kucoin-money-flow.component';
import { KucoinP2pComponent } from './kucoin-p2p/kucoin-p2p.component';
import { KucoinSpotTradesComponent } from './kucoin-spot-trades/kucoin-spot-trades.component';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { KucoinFuturesComponent } from './kucoin-futures/kucoin-futures.component';


@NgModule({
  declarations: [
    PortfolioKucoinSheetsComponent,
    KucoinMoneyFlowComponent,
    KucoinP2pComponent,
    KucoinSpotTradesComponent,
    KucoinFuturesComponent,
  ],
  imports: [
    CommonModule,
    SharedMaterialImportsModule,
    SharedModule,
    PortfolioKucoinSheetsRoutingModule,
    MatChipsModule,
    FormsModule
  ],
  
})
export class PortfolioKucoinSheetsModule { }
