import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioBybitDashboardComponent } from './portfolio-bybit-dashboard/portfolio-bybit-dashboard.component';
import { PortfolioBybitSheetsComponent } from './portfolio-bybit-sheets/portfolio-bybit-sheets.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio-bybit-sheets', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { path: 'portfolio-bybit-dashboard' , component : PortfolioBybitDashboardComponent},

  { path: 'portfolio-bybit-sheets' , 
  component : PortfolioBybitSheetsComponent,
  loadChildren: () =>
  import('./portfolio-bybit-sheets/portfolio-bybit-sheets.module').then(
    (m) => m.PortfolioBybitSheetsModule
  ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioBybitRoutingModule { }
