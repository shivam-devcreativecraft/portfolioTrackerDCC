import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

import { TradingviewComponent } from '../tradingview/tradingview.component';
// import { ExchangeDataComponent } from '../SharedComponents/exchange-data/exchange-data.component';

import { DemoTradingComponent } from '../demo-trading/demo-trading.component';
import { ErrorComponent } from '../SharedComponents/error/error.component';
// import { AssetsDetailComponent } from '../SharedComponents/assetsDetail/assets-detail.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'open-orders-aio', // Redirect to the dashboard when accessing the base path
    redirectTo: 'demo-trading', // Redirect to the dashboard when accessing the base path

    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: () =>
      import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'demo-trading',
    component: DemoTradingComponent,
    loadChildren: () =>
      import('../demo-trading/demo-trading.module').then((m) => m.DemoTradingModule),
  },
  {
    path: 'tradingview',
    component: TradingviewComponent

  },
  {path : '**', component: ErrorComponent}
 
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
