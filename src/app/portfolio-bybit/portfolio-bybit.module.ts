import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { PortfolioBybitRoutingModule } from './portfolio-bybit-routing.module';
import { PortfolioBybitComponent } from './portfolio-bybit.component';
import { PortfolioBybitDashboardComponent } from './portfolio-bybit-dashboard/portfolio-bybit-dashboard.component';

import { ConfirmDialogComponent } from '../SharedComponents/confirm-dialog/confirm-dialog.component';


import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { PortfolioDashboardBybitSipComponent } from './portfolio-bybit-dashboard/portfolio-dashboard-bybit-sip/portfolio-dashboard-bybit-sip.component';
import { PortfolioDashboardBybitP2pComponent } from './portfolio-bybit-dashboard/portfolio-dashboard-bybit-p2p/portfolio-dashboard-bybit-p2p.component';
import { PortfolioDashboardBybitMoneyFlowComponent } from './portfolio-bybit-dashboard/portfolio-dashboard-bybit-money-flow/portfolio-dashboard-bybit-money-flow.component';
import { PortfolioDashboardBybitGoldVipComponent } from './portfolio-bybit-dashboard/portfolio-dashboard-bybit-gold-vip/portfolio-dashboard-bybit-gold-vip.component';
import { PortfolioDashboardBybitFuturesClosedPnlComponent } from './portfolio-bybit-dashboard/portfolio-dashboard-bybit-futures-closed-pnl/portfolio-dashboard-bybit-futures-closed-pnl.component';
import { PortfolioDashboardBybitCopyTradingComponent } from './portfolio-bybit-dashboard/portfolio-dashboard-bybit-copy-trading/portfolio-dashboard-bybit-copy-trading.component';
import { PortfolioDashboardBybitAdvanceCryptoTraderComponent } from './portfolio-bybit-dashboard/portfolio-dashboard-bybit-advance-crypto-trader/portfolio-dashboard-bybit-advance-crypto-trader.component';
import { PortfolioDashboardBybitTotalStatsComponent } from './portfolio-bybit-dashboard/portfolio-dashboard-bybit-total-stats/portfolio-dashboard-bybit-total-stats.component';
import { PortfolioDashboardBybitFuturesClosedPnlDemoComponent } from './portfolio-bybit-dashboard/portfolio-dashboard-bybit-futures-closed-pnl-demo/portfolio-dashboard-bybit-futures-closed-pnl-demo.component';
import { SharedModule } from '../SharedComponents/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    PortfolioBybitComponent,
    PortfolioBybitDashboardComponent,
    ConfirmDialogComponent,
    PortfolioDashboardBybitSipComponent,
    PortfolioDashboardBybitP2pComponent,
    PortfolioDashboardBybitMoneyFlowComponent,
    PortfolioDashboardBybitGoldVipComponent,
    PortfolioDashboardBybitFuturesClosedPnlComponent,
    PortfolioDashboardBybitCopyTradingComponent,
    PortfolioDashboardBybitAdvanceCryptoTraderComponent,
    PortfolioDashboardBybitTotalStatsComponent,
    PortfolioDashboardBybitFuturesClosedPnlDemoComponent
  ],
  providers : [DatePipe],

  imports: [
    CommonModule,
    PortfolioBybitRoutingModule,
SharedMaterialImportsModule,

HighchartsChartModule,
SharedModule

  ]
})
export class PortfolioBybitModule { }
