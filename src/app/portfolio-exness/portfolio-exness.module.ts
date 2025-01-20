import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioExnessRoutingModule } from './portfolio-exness-routing.module';
import { PortfolioExnessComponent } from './portfolio-exness.component';
import { PortfolioExnessDashboardComponent } from './portfolio-exness-dashboard/portfolio-exness-dashboard.component';
import { PortfolioExnessSheetsComponent } from './portfolio-exness-sheets/portfolio-exness-sheets.component';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';


@NgModule({
  declarations: [
    PortfolioExnessComponent,
    PortfolioExnessDashboardComponent,
    PortfolioExnessSheetsComponent
  ],
  imports: [
    CommonModule,
    PortfolioExnessRoutingModule,
    SharedMaterialImportsModule

  ]
})
export class PortfolioExnessModule { }
