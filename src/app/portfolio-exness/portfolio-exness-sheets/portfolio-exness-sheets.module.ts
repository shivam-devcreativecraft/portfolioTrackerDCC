import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioExnessSheetsRoutingModule } from './portfolio-exness-sheets-routing.module';

import { ExnessRealComponent } from './exness-real/exness-real.component';
import { ExnessDemoComponent } from './exness-demo/exness-demo.component';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [

    ExnessRealComponent,
    ExnessDemoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PortfolioExnessSheetsRoutingModule,
    SharedMaterialImportsModule,
    SharedModule,
    MatChipsModule
  ]
})
export class PortfolioExnessSheetsModule { }
