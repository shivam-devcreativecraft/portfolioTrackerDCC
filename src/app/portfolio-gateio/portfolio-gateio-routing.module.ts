import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioGateioSheetsComponent } from './portfolio-gateio-sheets/portfolio-gateio-sheets.component';
import { PortfolioGateioDashboardComponent } from './portfolio-gateio-dashboard/portfolio-gateio-dashboard.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio-gateio-sheets', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { path: 'portfolio-gateio-dashboard' , component : PortfolioGateioDashboardComponent},

  { path: 'portfolio-gateio-sheets' , 
  component : PortfolioGateioSheetsComponent,
  loadChildren: () =>
  import('./portfolio-gateio-sheets/portfolio-gateio-sheets.module').then(
    (m) => m.PortfolioGateioSheetsModule
  ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioGateioRoutingModule { }
