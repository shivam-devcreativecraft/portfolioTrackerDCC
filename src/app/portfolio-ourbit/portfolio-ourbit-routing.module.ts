import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioOurbitSheetsComponent } from './portfolio-ourbit-sheets/portfolio-ourbit-sheets.component';
import { PortfolioOurbitDashboardComponent } from './portfolio-ourbit-dashboard/portfolio-ourbit-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio-ourbit-sheets', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { path: 'portfolio-ourbit-dashboard' , component : PortfolioOurbitDashboardComponent},

  { path: 'portfolio-ourbit-sheets' , 
  component : PortfolioOurbitSheetsComponent,
  loadChildren: () =>
  import('./portfolio-ourbit-sheets/portfolio-ourbit-sheets.module').then(
    (m) => m.PortfolioOurbitSheetsModule
  ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioOurbitRoutingModule { }
