import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioFreebitcoSheetsRoutingModule } from './portfolio-freebitco-sheets-routing.module';
import { PortfolioFreebitcoSheetsComponent } from './portfolio-freebitco-sheets.component';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { MatChipsModule } from '@angular/material/chips';
import { FreebitcoEventsComponent } from './freebitco-events/freebitco-events.component';
import { FreebitcoFunBuyingComponent } from './freebitco-fun-buying/freebitco-fun-buying.component';
import { FreebitcoPremiumComponent } from './freebitco-premium/freebitco-premium.component';
import { EightDecimalPlacePipe } from './pipes/eight-decimal-place.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountdownTimerComponent } from '../../SharedComponents/countdown-timer/countdown-timer.component';
import { FreebitcoMoneyFlowComponent } from './freebitco-money-flow/freebitco-money-flow.component';
import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { FreebitcoBonusComponent } from './freebitco-bonus/freebitco-bonus.component';


@NgModule({
  declarations: [
    EightDecimalPlacePipe,

    PortfolioFreebitcoSheetsComponent,
    FreebitcoEventsComponent,
    FreebitcoFunBuyingComponent,
    FreebitcoPremiumComponent,


    FreebitcoMoneyFlowComponent,
    FreebitcoBonusComponent,


  ],
  imports: [
    CommonModule,
    SharedMaterialImportsModule,
    MatChipsModule,
    PortfolioFreebitcoSheetsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class PortfolioFreebitcoSheetsModule { }
