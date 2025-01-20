import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioGateioRoutingModule } from './portfolio-gateio-routing.module';
import { PortfolioGateioComponent } from './portfolio-gateio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { PortfolioGateioDashboardComponent } from './portfolio-gateio-dashboard/portfolio-gateio-dashboard.component';
import { SharedModule } from '../SharedComponents/shared.module';


@NgModule({
  declarations: [
    PortfolioGateioComponent,
    PortfolioGateioDashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedMaterialImportsModule,
    PortfolioGateioRoutingModule,
    SharedModule
  ]
})
export class PortfolioGateioModule { }
