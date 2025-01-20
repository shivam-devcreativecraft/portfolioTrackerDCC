import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenOrdersAioBinanceComponent } from './open-orders-aio-binance/open-orders-aio-binance.component';
import { OpenOrdersAioBybitComponent } from './open-orders-aio-bybit/open-orders-aio-bybit.component';
import { OpenOrdersAioMexcComponent } from './open-orders-aio-mexc/open-orders-aio-mexc.component';
import { OpenOrdersAioKucoinComponent } from './open-orders-aio-kucoin/open-orders-aio-kucoin.component';
import { OpenOrdersAioGateioComponent } from './open-orders-aio-gateio/open-orders-aio-gateio.component';

const routes: Routes = [
  {path : '', component : OpenOrdersAioBinanceComponent},

  {path : 'open-orders-binance', component : OpenOrdersAioBinanceComponent},
  {path : 'open-orders-bybit', component : OpenOrdersAioBybitComponent},
  {path : 'open-orders-mexc', component : OpenOrdersAioMexcComponent},
  {path : 'open-orders-kucoin', component : OpenOrdersAioKucoinComponent},
  {path : 'open-orders-gateio', component : OpenOrdersAioGateioComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenOrdersAioSheetsRoutingModule { }
