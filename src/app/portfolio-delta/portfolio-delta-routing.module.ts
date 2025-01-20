import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioDeltaDashboardComponent } from './portfolio-delta-dashboard/portfolio-delta-dashboard.component';
import { PortfolioDeltaSheetsComponent } from './portfolio-delta-sheets/portfolio-delta-sheets.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio-delta-sheets', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { path: 'portfolio-delta-dashboard' , component : PortfolioDeltaDashboardComponent},

  { path: 'portfolio-delta-sheets' , 
  component : PortfolioDeltaSheetsComponent,
  loadChildren: () =>
  import('./portfolio-delta-sheets/portfolio-delta-sheets.module').then(
    (m) => m.PortfolioDeltaSheetsModule
  ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioDeltaRoutingModule { }
