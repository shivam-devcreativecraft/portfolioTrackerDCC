import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BinanceP2pComponent } from './binance-p2p/binance-p2p.component';
import { BinanceFunbuyingForFreebitcoComponent } from './binance-funbuying-for-freebitco/binance-funbuying-for-freebitco.component';
import { BinanceFuturesPNLComponent } from './binance-futures-pnl/binance-futures-pnl.component'; 
import { BinanceWithdrawCryptoComponent } from './binance-withdraw-crypto/withdraw-crypto.component'; 
import { BinanceOldWithdrawsComponent } from './binance-old-withdraws/binance-old-withdraws.component';
import { BinanceFuturesTradeComponent } from './binance-futures-trade/binance-futures-trade.component';
import { BinanceSpotTradesComponent } from './binance-spot-trades/binance-spot-trades.component';

const routes: Routes = [
  {path : '', component : BinanceSpotTradesComponent},
  {path : 'binance-p2p', component : BinanceP2pComponent},
  {path : 'binance-spot_trades', component : BinanceSpotTradesComponent},
  {path : 'binance-FunBuySell_For_FreeBitco', component : BinanceFunbuyingForFreebitcoComponent},
  {path : 'binance-futures_pnl', component : BinanceFuturesPNLComponent},
  {path : 'binance-money_flow_crypto' , component : BinanceWithdrawCryptoComponent},
  {path : 'binance-old_withdraws', component : BinanceOldWithdrawsComponent},
  {path : 'binance-futures_trade', component : BinanceFuturesTradeComponent}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioBinanceSheetsRoutingModule { }
