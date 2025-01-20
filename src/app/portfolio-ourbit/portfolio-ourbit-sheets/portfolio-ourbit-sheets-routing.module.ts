import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OurbitMoneyFlowComponent } from './ourbit-money-flow/ourbit-money-flow.component';
import { OurbitFuturesComponent } from './ourbit-futures/ourbit-futures.component';
import { OurbitFuturesTransfersComponent } from './ourbit-futures-transfers/ourbit-futures-transfers.component';
import { OurbitSpotTradesComponent } from './ourbit-spot-trades/ourbit-spot-trades.component';

const routes: Routes = [
  {path : '', component : OurbitFuturesComponent},
  
  {path : 'ourbit-futures_transfers', component : OurbitFuturesTransfersComponent},
  {path : 'ourbit-money_flow', component : OurbitMoneyFlowComponent},
  {path : 'ourbit-futures', component : OurbitFuturesComponent},
  {path : 'ourbit-spot_trades', component : OurbitSpotTradesComponent}
  

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioOurbitSheetsRoutingModule { }
