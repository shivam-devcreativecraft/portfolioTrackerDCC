import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoTradingSheetsComponent } from './demo-trading-sheets/demo-trading-sheets.component';
import { DemoTradingDashboardComponent } from './demo-trading-dashboard/demo-trading-dashboard.component';
// demo-trading


const routes: Routes = [
  {
    path: '',
    redirectTo: 'demo-trading-sheets', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { path: 'demo-trading-dashboard' , component : DemoTradingDashboardComponent},


  { path: 'demo-trading-sheets' , 
  component : DemoTradingSheetsComponent,
  loadChildren: () =>
  import('./demo-trading-sheets/demo-trading-sheets.module').then(
    (m) => m.DemoTradingSheetsModule
  ),
  },


];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoTradingRoutingModule { }
