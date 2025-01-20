import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { FuturesComponent } from './PortfolioSheetsComponents/futures/futures.component';
import { MoneyFlowComponent } from './PortfolioSheetsComponents/money-flow/money-flow.component';
import { P2pComponent } from './PortfolioSheetsComponents/p2p/p2p.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartAnalysisComponent } from './PortfolioSheetsComponents/chart-analysis/chart-analysis.component';
import { NewOrdersComponent } from './PortfolioSheetsComponents/new-orders/new-orders.component';
import { TradeDetailsComponent } from './trade-details/trade-details.component';
import { HistoryComponent } from './PortfolioSheetsComponents/history/history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpenOrdersExchangeComponent } from './PortfolioSheetsComponents/open-orders-exchange/open-orders-exchange.component';
import { FuturesClosedPnlComponent } from './PortfolioSheetsComponents/futures-closed-pnl/futures-closed-pnl.component';
import { ExnessComponent } from './PortfolioSheetsComponents/exness/exness.component';
import { UpdateEntryComponent } from './PortfolioSheetsComponents/update-entry/update-entry.component';
import { MatChipsModule } from '@angular/material/chips';
import { OpenOrdersSheetComponent } from './PortfolioSheetsComponents/open-orders-sheet/open-orders-sheet.component';
import { MasterControlComponent } from './master-control/master-control.component';
import { SpotTradesComponent } from './PortfolioSheetsComponents/spot-trades/spot-trades.component';
import { AddNewComponent } from './PortfolioSheetsComponents/add-new/add-new.component';
import { OpenOrdersAioSharedComponent } from './PortfolioSheetsComponents/open-orders-aio-shared/open-orders-aio-shared.component';
import { LoggingComponent } from './logging/logging.component';
import { VideoDialogComponent } from './PortfolioSheetsComponents/video-dialog/video-dialog.component';
import { SafeUrlPipe } from './PortfolioSheetsComponents/video-dialog/safe-url.pipe';
import { DashboardFuturesComponent } from './PortfolioDashboardComponents/dashboard-futures/dashboard-futures.component';
import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';
import { PortfolioDashboardSharedComponent } from './PortfolioDashboardComponents/portfolio-dashboard-shared/portfolio-dashboard-shared.component';
import { GoogledriveComponent } from './googledrive/googledrive.component';
// import { ResizableModule } from 'angular-resizable-element';


@NgModule({
  declarations: [
    FuturesComponent,
    MoneyFlowComponent,
    P2pComponent,
    ChartAnalysisComponent,

    TradeDetailsComponent,
    HistoryComponent,
    OpenOrdersExchangeComponent,
    FuturesClosedPnlComponent,
    ExnessComponent,
    UpdateEntryComponent,
    OpenOrdersSheetComponent,
    MasterControlComponent,
    SpotTradesComponent,
    AddNewComponent,
    OpenOrdersAioSharedComponent,
    LoggingComponent,
    VideoDialogComponent,
    SafeUrlPipe,
    DashboardFuturesComponent,
    CountdownTimerComponent,
    PortfolioDashboardSharedComponent,
    
  ],
  providers: [DatePipe],

  imports: [
    CommonModule,
    SharedMaterialImportsModule,
    HighchartsChartModule,
    SharedMaterialImportsModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule
    // ResizableModule
  ],
  exports:
    [FuturesComponent,
      MoneyFlowComponent,
      P2pComponent,
      ChartAnalysisComponent,
      OpenOrdersExchangeComponent,
      FuturesClosedPnlComponent,
      ExnessComponent,
      UpdateEntryComponent,
      OpenOrdersSheetComponent,
    SpotTradesComponent,
    AddNewComponent,
    OpenOrdersAioSharedComponent,
    LoggingComponent,

    //dashboardCompoinents
    DashboardFuturesComponent,
    CountdownTimerComponent,
    PortfolioDashboardSharedComponent





    ]
})
export class SharedModule { }
