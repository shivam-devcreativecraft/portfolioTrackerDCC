import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioDeltaRoutingModule } from './portfolio-delta-routing.module';
import { PortfolioDeltaComponent } from './portfolio-delta.component';


@NgModule({
  declarations: [
    PortfolioDeltaComponent
  ],
  imports: [
    CommonModule,
    PortfolioDeltaRoutingModule
  ]
})
export class PortfolioDeltaModule { }
