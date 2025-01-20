import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KucoinMoneyFlowComponent } from './kucoin-money-flow/kucoin-money-flow.component';
import { KucoinP2pComponent } from './kucoin-p2p/kucoin-p2p.component';
import { KucoinSpotTradesComponent } from './kucoin-spot-trades/kucoin-spot-trades.component';
import { KucoinFuturesComponent } from './kucoin-futures/kucoin-futures.component';

const routes: Routes = [
  { path: '', component: KucoinSpotTradesComponent },
  { path: 'kucoin-spot_trades', component: KucoinSpotTradesComponent },

  { path: 'kucoin-money_flow', component: KucoinMoneyFlowComponent },
  { path: 'kucoin-p2p', component: KucoinP2pComponent },
  { path: 'kucoin-futures', component: KucoinFuturesComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioKucoinSheetsRoutingModule { }
