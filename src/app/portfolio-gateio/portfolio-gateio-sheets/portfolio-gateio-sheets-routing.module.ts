import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GateioMoneyFlowComponent } from './gateio-money-flow/gateio-money-flow.component';
import { GateioSpotTradesComponent } from './gateio-spot-trades/gateio-spot-trades.component';
import { GateioP2pComponent } from './gateio-p2p/gateio-p2p.component';
import { GateioFuturesComponent } from './gateio-futures/gateio-futures.component';

const routes: Routes = [
  {path : '', component : GateioSpotTradesComponent},
  {path : 'gateio-spot_trades', component : GateioSpotTradesComponent},

  {path : 'gateio-money_flow', component : GateioMoneyFlowComponent},
  {path : 'gateio-p2p', component : GateioP2pComponent},
  {path : 'gateio-futures', component : GateioFuturesComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioGateioSheetsRoutingModule { }
