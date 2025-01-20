import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioMexcSheetsComponent } from './portfolio-mexc-sheets/portfolio-mexc-sheets.component';
import { PortfolioMexcDashboardComponent } from './portfolio-mexc-dashboard/portfolio-mexc-dashboard.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio-mexc-sheets', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { path: 'portfolio-mexc-dashboard' , component : PortfolioMexcDashboardComponent},

  { path: 'portfolio-mexc-sheets' , 
  component : PortfolioMexcSheetsComponent,
  loadChildren: () =>
  import('./portfolio-mexc-sheets/portfolio-mexc-sheets.module').then(
    (m) => m.PortfolioMexcSheetsModule
  ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioMexcRoutingModule { }
