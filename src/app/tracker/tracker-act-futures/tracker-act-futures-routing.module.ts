import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActFuturesRealComponent } from './act-futures-real/act-futures-real.component';
import { ActFuturesDemoComponent } from './act-futures-demo/act-futures-demo.component';

const routes: Routes = [
  {path : 'act_futures-real', component : ActFuturesRealComponent},
  {path : 'act_futures-demo', component :ActFuturesDemoComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackerActFuturesRoutingModule { }
