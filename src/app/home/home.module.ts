import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { SharedModule } from '../SharedComponents/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HistoryComponent } from '../history/history.component';
import { SpotTradesComponent } from '../spot-trades/spot-trades.component';
import { FuturesTradesComponent } from '../futures-trades/futures-trades.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    DashboardComponent,
    HistoryComponent,
    SpotTradesComponent,
    FuturesTradesComponent,
    
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleSigninButtonModule,
    SharedMaterialImportsModule,
    SharedModule,
    MatChipsModule,
    HighchartsChartModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth())
  ]
})
export class HomeModule { }
