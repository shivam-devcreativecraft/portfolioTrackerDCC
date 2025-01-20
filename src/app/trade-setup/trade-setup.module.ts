import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TradeSetupRoutingModule } from './trade-setup-routing.module';
import { TradeSetupComponent } from './trade-setup.component';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TradeSetupFuturesComponent } from './trade-setup-futures/trade-setup-futures.component';
import { TradeSetupSpotComponent } from './trade-setup-spot/trade-setup-spot.component';
import { AddTradingSetupEntryComponent } from './add-trading-setup-entry/add-trading-setup-entry.component';
import { MatChipsModule } from '@angular/material/chips';
import { InfluencerPnlCalenderComponent } from './influencer-pnl-calender/influencer-pnl-calender.component';


@NgModule({
  declarations: [
    TradeSetupComponent,
    TradeSetupFuturesComponent,
    TradeSetupSpotComponent,
    AddTradingSetupEntryComponent,
    InfluencerPnlCalenderComponent,

    
  ],
  providers: [DatePipe],

  imports: [
    CommonModule,
    TradeSetupRoutingModule,
    SharedMaterialImportsModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule
  ]
})
export class TradeSetupModule { }
