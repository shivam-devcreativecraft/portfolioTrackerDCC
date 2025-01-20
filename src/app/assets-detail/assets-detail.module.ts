import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsDetailComponent } from './assets-detail.component';
import { AssetsDetailExchangeComponent } from './assetsDetailExchange/assets-detail-exchange.component';
import { AssetsDetailHistoryComponent } from './assetsDetailHistory/assets-detail-history.component';
import { AssetsDetailRoutingModule } from './assets-detail-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSelectModule } from '@angular/material/select';
import { TradeDetailsModalComponent } from './trade-details-modal/trade-details-modal.component';

@NgModule({
  declarations: [
    AssetsDetailExchangeComponent,
    AssetsDetailHistoryComponent,
    TradeDetailsModalComponent
  ],
  imports: [
    CommonModule,
    AssetsDetailRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HighchartsChartModule,
    MatAutocompleteModule,
    SharedMaterialImportsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    MatSelectModule,
  ]
})
export class AssetsDetailModule { }
