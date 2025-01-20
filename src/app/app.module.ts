import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DeltaExchangeComponent } from './delta-exchange/delta-exchange.component';
import { TradeDetailsModalComponent } from './delta-exchange/trade-details-modal/trade-details-modal.component';
import { SharedMaterialImportsModule } from './shared-material-imports/shared-material-imports.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MasterControlComponent } from './SharedComponents/master-control/master-control.component';
import { AddDemoTradingDeltaFuturesComponent } from './delta-exchange/add-demo-trading-delta-futures/add-demo-trading-delta-futures.component';

@NgModule({
  declarations: [
    AppComponent,
    DeltaExchangeComponent,
    // TradeDetailsModalComponent
  ],
  imports: [
    BrowserModule,
    HighchartsChartModule,
    SharedMaterialImportsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    AddDemoTradingDeltaFuturesComponent,
    MasterControlComponent
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
