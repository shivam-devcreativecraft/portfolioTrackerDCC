import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BybitP2pComponent } from './bybit-p2p/bybit-p2p.component';
import { BybitCopyTradingComponent } from './bybit-copy-trading/bybit-copy-trading.component';
import { BybitMoneyFlowComponent } from './bybit-money-flow/bybit-money-flow.component';
import { BybitFuturesClosedPnlComponent } from './bybit-futures-closed-pnl/bybit-futures-closed-pnl.component';
import { BybitSpotTradesComponent } from './bybit-spot-trades/bybit-spot-trades.component';
import { BybitFuturesClosedPnlDemoComponent } from './bybit-futures-closed-pnl-demo/bybit-futures-closed-pnl-demo.component';





const routes: Routes = [

  {path : '', component : BybitSpotTradesComponent},


  {path : 'bybit-spot_trades', component : BybitSpotTradesComponent},
  
  {path : 'bybit-p2p', component : BybitP2pComponent},
  {path : 'bybit-copy_trading', component : BybitCopyTradingComponent},
  {path : 'bybit-money_flow', component : BybitMoneyFlowComponent},
  {path : 'bybit-futures_closed_pnl', component : BybitFuturesClosedPnlComponent},
  {path : 'bybit-futures_closed_pnl_demo', component : BybitFuturesClosedPnlDemoComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioBybitSheetsRoutingModule { }
