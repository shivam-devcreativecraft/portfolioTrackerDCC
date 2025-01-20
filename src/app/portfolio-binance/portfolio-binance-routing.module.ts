import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioBinanceDashboardComponent } from './portfolio-binance-dashboard/portfolio-binance-dashboard.component';
import { PortfolioBinanceSheetsComponent } from './portfolio-binance-sheets/portfolio-binance-sheets.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio-binance-sheets', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { path: 'portfolio-binance-dashboard' , component : PortfolioBinanceDashboardComponent},

  { path: 'portfolio-binance-sheets' , 
  component : PortfolioBinanceSheetsComponent,
  loadChildren: () =>
  import('./portfolio-binance-sheets/portfolio-binance-sheets.module').then(
    (m) => m.PortfolioBinanceSheetsModule
  ), 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioBinanceRoutingModule { }
