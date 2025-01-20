import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsDetailHistoryComponent } from './assetsDetailHistory/assets-detail-history.component';
import { AssetsDetailExchangeComponent } from './assetsDetailExchange/assets-detail-exchange.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'assets-detail-exchange', // Redirect to the dashboard when accessing the base path
    pathMatch: 'full'
  },
  {path: 'assets-detail-history', component : AssetsDetailHistoryComponent},
  {path: 'assets-detail-exchange', component : AssetsDetailExchangeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsDetailRoutingModule { }
