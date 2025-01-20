import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioBinanceSheetsRoutingModule } from './portfolio-binance-sheets-routing.module';
import { PortfolioBinanceSheetsComponent } from './portfolio-binance-sheets.component';

//STARTS material imports

import {  HttpClientModule } from '@angular/common/http';
import { BinanceP2pComponent } from './binance-p2p/binance-p2p.component';
import { BinanceSpotTradesComponent } from './binance-spot-trades/binance-spot-trades.component';
import { FormsModule } from '@angular/forms';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { BinanceFunbuyingForFreebitcoComponent } from './binance-funbuying-for-freebitco/binance-funbuying-for-freebitco.component';
import { BinanceWithdrawCryptoComponent } from './binance-withdraw-crypto/withdraw-crypto.component';
import { BinanceFuturesPNLComponent } from './binance-futures-pnl/binance-futures-pnl.component';
// import { AddComponent } from './add/add.component';
import { MatChipsModule } from '@angular/material/chips';
import { BinanceOldWithdrawsComponent } from './binance-old-withdraws/binance-old-withdraws.component';
import { BinanceFuturesTradeComponent } from './binance-futures-trade/binance-futures-trade.component';
import { SharedModule } from 'src/app/SharedComponents/shared.module';


@NgModule({
  declarations: [
    PortfolioBinanceSheetsComponent,
  
    BinanceP2pComponent,
    BinanceSpotTradesComponent,
    BinanceFunbuyingForFreebitcoComponent,
    BinanceWithdrawCryptoComponent,
    BinanceFuturesPNLComponent,
    // AddComponent,
    BinanceOldWithdrawsComponent,
    BinanceFuturesTradeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PortfolioBinanceSheetsRoutingModule,
    SharedModule,
     SharedMaterialImportsModule ,     //ENDS material imports
 MatChipsModule
      
  ]
})
export class PortfolioBinanceSheetsModule { }
