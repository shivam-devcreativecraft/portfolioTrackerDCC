import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreebitcoEventsComponent } from './freebitco-events/freebitco-events.component';
import { FreebitcoPremiumComponent } from './freebitco-premium/freebitco-premium.component';
import { FreebitcoFunBuyingComponent } from './freebitco-fun-buying/freebitco-fun-buying.component';
import { FreebitcoMoneyFlowComponent } from './freebitco-money-flow/freebitco-money-flow.component';
import { FreebitcoBonusComponent } from './freebitco-bonus/freebitco-bonus.component';

const routes: Routes = [
  { path: '', component: FreebitcoFunBuyingComponent },
  { path: 'freebitco-fun_buying', component: FreebitcoFunBuyingComponent },
  { path: 'freebitco-bonus', component : FreebitcoBonusComponent },
  { path: 'freebitco-events', component: FreebitcoEventsComponent },
  { path: 'freebitco-premium', component: FreebitcoPremiumComponent },
  { path: 'freebitco-money_flow', component: FreebitcoMoneyFlowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioFreebitcoSheetsRoutingModule { }
