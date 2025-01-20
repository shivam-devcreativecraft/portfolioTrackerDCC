import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeltaExchangeComponent } from './delta-exchange/delta-exchange.component';

const routes: Routes = [

  {path: '', component  : DeltaExchangeComponent},
  {path: 'delta-exchange', component : DeltaExchangeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoTradingSheetsRoutingModule { }
