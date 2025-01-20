import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioFreebitcoDashboardComponent } from './portfolio-freebitco-dashboard/portfolio-freebitco-dashboard.component';
import { PortfolioFreebitcoSheetsComponent } from './portfolio-freebitco-sheets/portfolio-freebitco-sheets.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio-freebitco-dashboard', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { path: 'portfolio-freebitco-dashboard' , component : PortfolioFreebitcoDashboardComponent},

  { path: 'portfolio-freebitco-sheets' , 
  component : PortfolioFreebitcoSheetsComponent,
  loadChildren: () =>
  import('./portfolio-freebitco-sheets/portfolio-freebitco-sheets.module').then(
    (m) => m.PortfolioFreebitcoSheetsModule
  ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioFreebitcoRoutingModule { }
