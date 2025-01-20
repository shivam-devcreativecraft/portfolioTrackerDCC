import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MexcMoneyFlowComponent } from './mexc-money-flow/mexc-money-flow.component';
// import { MexcFuturesActPositionsComponent } from './mexc-futures-act-positions/mexc-futures-act-positions.component';
import { MexcFuturesComponent } from './mexc-futures/mexc-futures.component';
import { MexcSpotTradesComponent } from './mexc-spot-trades/mexc-spot-trades.component';


const routes: Routes = [
  {path : '', component : MexcSpotTradesComponent},
  
  {path : 'mexc-spot_trades', component : MexcSpotTradesComponent},
  {path : 'mexc-money_flow', component : MexcMoneyFlowComponent},
  {path : 'mexc-futures', component : MexcFuturesComponent},
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioMexcSheetsRoutingModule { }
 