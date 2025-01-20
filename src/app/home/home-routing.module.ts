import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PortfolioBybitComponent } from '../portfolio-bybit/portfolio-bybit.component';
import { PortfolioBinanceComponent } from '../portfolio-binance/portfolio-binance.component';
import { PortfolioMexcComponent } from '../portfolio-mexc/portfolio-mexc.component';
import { TradingToolsComponent } from '../trading-tools/trading-tools.component';
import { PortfolioExnessComponent } from '../portfolio-exness/portfolio-exness.component';
import { PortfolioFreebitcoComponent } from '../portfolio-freebitco/portfolio-freebitco.component';
import { PasswordManagerComponent } from '../password-manager/password-manager.component';
import { TrackerComponent } from '../tracker/tracker.component';
import { PortfolioDeltaComponent } from '../portfolio-delta/portfolio-delta.component';

import { TradingviewComponent } from '../tradingview/tradingview.component';
// import { ExchangeDataComponent } from '../SharedComponents/exchange-data/exchange-data.component';
import { PortfolioKucoinComponent } from '../portfolio-kucoin/portfolio-kucoin.component';
import { PortfolioGateioComponent } from '../portfolio-gateio/portfolio-gateio.component';
import { TradeSetupComponent } from '../trade-setup/trade-setup.component';
import { AssetsDetailComponent } from '../assets-detail/assets-detail.component';
import {  PortfolioNotesComponent } from '../portfolio-notes/portfolio-notes.component';
import { OpenOrdersAioComponent } from '../open-orders-aio/open-orders-aio.component';
import { LoggingComponent } from '../SharedComponents/logging/logging.component';
import { WatchlistComponent } from '../watchlist/watchlist.component';
import { PortfolioOurbitComponent } from '../portfolio-ourbit/portfolio-ourbit.component';
import { DemoTradingComponent } from '../demo-trading/demo-trading.component';
import { GoogledriveComponent } from '../SharedComponents/googledrive/googledrive.component';
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
    path: 'assets',
    component: AssetsDetailComponent,
    loadChildren: () =>
      import('../assets-detail/assets-detail.module').then(
        (m) => m.AssetsDetailModule
      ),

  },
  {
    path: 'open-orders-aio', 
    component: OpenOrdersAioComponent,
    loadChildren: () =>
      import('../open-orders-aio/open-orders-aio.module').then(
        (m) => m.OpenOrdersAioModule
      ),

  },
  {
    path: 'google-drive', 
    component: GoogledriveComponent
   },
  {
    path: 'portfolio-bybit',
    component: PortfolioBybitComponent,
    loadChildren: () =>
      import('../portfolio-bybit/portfolio-bybit.module').then(
        (m) => m.PortfolioBybitModule
      ),
  },
  {
    path: 'portfolio-binance',
    component: PortfolioBinanceComponent,
    loadChildren: () =>
      import('../portfolio-binance/portfolio-binance.module').then(
        (m) => m.PortfolioBinanceModule
      ),
  },
  {
    path: 'portfolio-mexc',
    component: PortfolioMexcComponent,
    loadChildren: () =>
      import('../portfolio-mexc/portfolio-mexc.module').then(
        (m) => m.PortfolioMexcModule
      ),
  },
  {
    path: 'portfolio-kucoin',
    component: PortfolioKucoinComponent,

    loadChildren: () =>
      import('../portfolio-kucoin/portfolio-kucoin.module').then(
        (m) => m.PortfolioKucoinModule
      ),
  },
  {
    path: 'portfolio-gateio',
    component: PortfolioGateioComponent,

    loadChildren: () =>
      import('../portfolio-gateio/portfolio-gateio.module').then(
        (m) => m.PortfolioGateioModule
      ),
  },
  {
    path: 'portfolio-ourbit',
    component: PortfolioOurbitComponent,

    loadChildren: () =>
      import('../portfolio-ourbit/portfolio-ourbit.module').then(
        (m) => m.PortfolioOurbitModule
      ),
  },
  {
    path: 'portfolio-exness',
    component: PortfolioExnessComponent,

    loadChildren: () =>
      import('../portfolio-exness/portfolio-exness.module').then(
        (m) => m.PortfolioExnessModule
      ),
  },
  {
    path: 'portfolio-freebitco',
    component: PortfolioFreebitcoComponent,

    loadChildren: () =>
      import('../portfolio-freebitco/portfolio-freebitco.module').then(
        (m) => m.PortfolioFreebitcoModule
      ),
  },

  {
    path: 'portfolio-delta',
    component: PortfolioDeltaComponent,

    loadChildren: () =>
      import('../portfolio-delta/portfolio-delta.module').then(
        (m) => m.PortfolioDeltaModule
      ),
  },


  {
    path: 'tracker',
    component: TrackerComponent,
    loadChildren: () =>
      import('../tracker/tracker.module').then((m) => m.TrackerModule),
  },
  {
    path: 'demo-trading',
    component: DemoTradingComponent,
    loadChildren: () =>
      import('../demo-trading/demo-trading.module').then((m) => m.DemoTradingModule),
  },

  {
    path: 'trade-setup',
    component: TradeSetupComponent,
    loadChildren: () =>
      import('../trade-setup/trade-setup.module').then((m) => m.TradeSetupModule),
  },


  {
    path: 'password-manager',
    component: PasswordManagerComponent,
    loadChildren: () =>
      import('../password-manager/password-manager.module').then(
        (m) => m.PasswordManagerModule
      ),
  },

  {
    path: 'trading-tools',
    component: TradingToolsComponent,
    loadChildren: () =>
      import('../trading-tools/trading-tools.module').then(
        (m) => m.TradingToolsModule
      ),
  },
  {
    path: 'tradingview',
    component: TradingviewComponent

  },
  {
    path: 'portfolio-notes',
    component:  PortfolioNotesComponent,

  },
  {
    path:'logging',
    component : LoggingComponent
  },
  {
    path:'watchlist',
    component : WatchlistComponent
  }
  // {path : 'exchange-data', component : ExchangeDataComponent},
  // {path : 'assets-detail', component : AssetsDetailComponent}

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
