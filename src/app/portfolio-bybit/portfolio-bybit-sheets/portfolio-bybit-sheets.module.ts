import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioBybitSheetsRoutingModule } from './portfolio-bybit-sheets-routing.module';
import { PortfolioBybitSheetsComponent } from './portfolio-bybit-sheets.component';

//STARTS material imports
import { HttpClientModule } from '@angular/common/http';
import { BybitP2pComponent } from './bybit-p2p/bybit-p2p.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BybitCopyTradingComponent } from './bybit-copy-trading/bybit-copy-trading.component';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { MatChipsModule } from '@angular/material/chips';
import { BybitMoneyFlowComponent } from './bybit-money-flow/bybit-money-flow.component';
import { BybitFuturesClosedPnlComponent } from './bybit-futures-closed-pnl/bybit-futures-closed-pnl.component';
import { BybitSpotTradesComponent } from './bybit-spot-trades/bybit-spot-trades.component';
import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { BybitFuturesClosedPnlDemoComponent } from './bybit-futures-closed-pnl-demo/bybit-futures-closed-pnl-demo.component';



@NgModule({
  declarations: [
    PortfolioBybitSheetsComponent,


    BybitP2pComponent,
    BybitCopyTradingComponent,
    BybitMoneyFlowComponent,
    BybitFuturesClosedPnlComponent,
    BybitSpotTradesComponent,
    BybitFuturesClosedPnlDemoComponent,


  ],
  imports: [
    CommonModule,
    PortfolioBybitSheetsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    //STARTS material imports

    SharedModule,
    SharedMaterialImportsModule,
    MatChipsModule,
    //ENDS material imports
    HighchartsChartModule

  ],
})
export class PortfolioBybitSheetsModule { }
