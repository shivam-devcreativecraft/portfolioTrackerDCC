import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartAnalysisComponent } from './chart-analysis/chart-analysis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { AddComponent } from '../SharedComponents/add/add.component';
// import { ResizableModule } from 'angular-resizable-element';


@NgModule({
  declarations: [
    ChartAnalysisComponent,
    AddComponent,

    
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
    [
      ChartAnalysisComponent,
    AddComponent,

    //dashboardCompoinents





    ]
})
export class SharedModule { }
