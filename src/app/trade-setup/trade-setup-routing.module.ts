import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradeSetupFuturesComponent } from './trade-setup-futures/trade-setup-futures.component';
import { TradeSetupSpotComponent } from './trade-setup-spot/trade-setup-spot.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trade-setup-futures', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { 
    path: 'trade-setup-futures', 
    component: TradeSetupFuturesComponent },

  {
    path: 'trade-setup-spot',
    component: TradeSetupSpotComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeSetupRoutingModule { }
