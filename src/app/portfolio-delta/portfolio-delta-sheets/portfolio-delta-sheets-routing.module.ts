import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeltaFuturesComponent } from './delta-futures/delta-futures.component';
import { DeltaOptionsComponent } from './delta-options/delta-options.component';
import { DeltaMoneyFlowComponent } from './delta-money-flow/delta-money-flow.component';

const routes: Routes = [
  {path : '', component : DeltaMoneyFlowComponent},
  {path : 'delta-money_flow', component : DeltaMoneyFlowComponent},

  {path:'delta-futures', component : DeltaFuturesComponent},
  {path : 'delta-options', component : DeltaOptionsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioDeltaSheetsRoutingModule { }
