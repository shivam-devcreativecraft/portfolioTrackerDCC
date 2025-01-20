import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradingToolsRoutingModule } from './trading-tools-routing.module';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedMaterialImportsModule,
    TradingToolsRoutingModule,
    MatChipsModule

  ]
})
export class TradingToolsModule { }
