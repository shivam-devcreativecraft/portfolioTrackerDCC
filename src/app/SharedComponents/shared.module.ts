import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartAnalysisComponent } from './PortfolioSheetsComponents/chart-analysis/chart-analysis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateEntryComponent } from './PortfolioSheetsComponents/update-entry/update-entry.component';
import { MatChipsModule } from '@angular/material/chips';
import { MasterControlComponent } from './master-control/master-control.component';
// import { ResizableModule } from 'angular-resizable-element';


@NgModule({
  declarations: [
    ChartAnalysisComponent,

    UpdateEntryComponent,
    MasterControlComponent,

    
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
      UpdateEntryComponent,

    //dashboardCompoinents





    ]
})
export class SharedModule { }
