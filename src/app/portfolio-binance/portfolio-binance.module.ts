import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';


import { PortfolioBinanceRoutingModule } from './portfolio-binance-routing.module';
import { PortfolioBinanceComponent } from './portfolio-binance.component';
import { PortfolioBinanceDashboardComponent } from './portfolio-binance-dashboard/portfolio-binance-dashboard.component';
import { FormsModule } from '@angular/forms';
import { PortfolioDashboardBinanceWithdrawCryptoComponent } from './portfolio-binance-dashboard/portfolio-dashboard-binance-withdraw-crypto/portfolio-dashboard-binance-withdraw-crypto.component';
import { PortfolioDashboardBinanceSipComponent } from './portfolio-binance-dashboard/portfolio-dashboard-binance-sip/portfolio-dashboard-binance-sip.component';
import { PortfolioDashboardBinanceP2pComponent } from './portfolio-binance-dashboard/portfolio-dashboard-binance-p2p/portfolio-dashboard-binance-p2p.component';
import { PortfolioDashboardBinanceOldWithdrawsComponent } from './portfolio-binance-dashboard/portfolio-dashboard-binance-old-withdraws/portfolio-dashboard-binance-old-withdraws.component';
import { PortfolioDashboardBinanceHoldingsComponent } from './portfolio-binance-dashboard/portfolio-dashboard-binance-holdings/portfolio-dashboard-binance-holdings.component';
import { PortfolioDashboardBinanceFuturesTradeComponent } from './portfolio-binance-dashboard/portfolio-dashboard-binance-futures-trade/portfolio-dashboard-binance-futures-trade.component';
import { PortfolioDashboardBinanceFuturesPnlComponent } from './portfolio-binance-dashboard/portfolio-dashboard-binance-futures-pnl/portfolio-dashboard-binance-futures-pnl.component';
import { PortfolioDashboardBinanceFunbuyingForFreebitcoComponent } from './portfolio-binance-dashboard/portfolio-dashboard-binance-funbuying-for-freebitco/portfolio-dashboard-binance-funbuying-for-freebitco.component';
import { PortfolioDashboardBinanceTotalStatsComponent } from './portfolio-binance-dashboard/portfolio-dashboard-binance-total-stats/portfolio-dashboard-binance-total-stats.component';


@NgModule({
  declarations: [
    PortfolioBinanceComponent,
    PortfolioBinanceDashboardComponent,
    PortfolioDashboardBinanceWithdrawCryptoComponent,
    PortfolioDashboardBinanceSipComponent,
    PortfolioDashboardBinanceP2pComponent,
    PortfolioDashboardBinanceOldWithdrawsComponent,
    PortfolioDashboardBinanceHoldingsComponent,
    PortfolioDashboardBinanceFuturesTradeComponent,
    PortfolioDashboardBinanceFuturesPnlComponent,
    PortfolioDashboardBinanceFunbuyingForFreebitcoComponent,
    PortfolioDashboardBinanceTotalStatsComponent
  ],
  providers : [DatePipe],

  imports: [
    CommonModule,
    PortfolioBinanceRoutingModule,
    FormsModule
  ]
})
export class PortfolioBinanceModule { }
