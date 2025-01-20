import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenOrdersAioDashboardComponent } from './open-orders-aio-dashboard/open-orders-aio-dashboard.component';
import { OpenOrdersAioSheetsComponent } from './open-orders-sheets/open-orders-aio-sheets.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'open-orders-aio-dashboard', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  { path: 'open-orders-aio-dashboard' , component : OpenOrdersAioDashboardComponent},

  { path: 'open-orders-aio-sheets' , 
  component : OpenOrdersAioSheetsComponent,
  loadChildren: () =>
  import('./open-orders-sheets/open-orders-aio-sheets.module').then(
    (m) => m.OpenOrdersAioSheetsModule
  ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenOrdersAioRoutingModule { }
