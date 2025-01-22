import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

import { TradingviewComponent } from '../tradingview/tradingview.component';
// import { ExchangeDataComponent } from '../SharedComponents/exchange-data/exchange-data.component';

import { ErrorComponent } from '../SharedComponents/error/error.component';
import { HistoryComponent } from '../history/history.component';
import { SpotTradesComponent } from '../spot-trades/spot-trades.component';
import { FuturesTradesComponent } from '../futures-trades/futures-trades.component';
// import { AssetsDetailComponent } from '../SharedComponents/assetsDetail/assets-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full',
  },
  { path: 'dashboard', component: DashboardComponent, },
  { path: 'history', component: HistoryComponent },
  { path: 'spot-trades', component: SpotTradesComponent },
  { path: 'futures-trades', component: FuturesTradesComponent },
  { path: 'tradingview', component: TradingviewComponent },
  { path: '**', component: ErrorComponent }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
