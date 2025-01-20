import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioKucoinDashboardComponent } from './portfolio-kucoin-dashboard/portfolio-kucoin-dashboard.component';
import { PortfolioKucoinSheetsComponent } from './portfolio-kucoin-sheets/portfolio-kucoin-sheets.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio-kucoin-sheets', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { path: 'portfolio-kucoin-dashboard' , component : PortfolioKucoinDashboardComponent},
  
  { path: 'portfolio-kucoin-sheets' , 
  component : PortfolioKucoinSheetsComponent,
  loadChildren: () =>
  import('./portfolio-kucoin-sheets/portfolio-kucoin-sheets.module').then(
    (m) => m.PortfolioKucoinSheetsModule
  ),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioKucoinRoutingModule { }
