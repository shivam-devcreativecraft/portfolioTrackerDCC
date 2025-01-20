import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioExnessDashboardComponent } from './portfolio-exness-dashboard/portfolio-exness-dashboard.component';
import { PortfolioExnessSheetsComponent } from './portfolio-exness-sheets/portfolio-exness-sheets.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio-exness-sheets', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { path: 'portfolio-exness-dashboard' , component : PortfolioExnessDashboardComponent},

  { path: 'portfolio-exness-sheets' , 
  component : PortfolioExnessSheetsComponent,
  loadChildren: () =>
  import('./portfolio-exness-sheets/portfolio-exness-sheets.module').then(
    (m) => m.PortfolioExnessSheetsModule
  ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioExnessRoutingModule { }
