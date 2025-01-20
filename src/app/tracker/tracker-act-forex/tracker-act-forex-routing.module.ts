import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActForexDemoComponent } from './act-forex-demo/act-forex-demo.component';
import { ActForexRealComponent } from './act-forex-real/act-forex-real.component';

const routes: Routes = [
  {path : 'act_forex-real', component : ActForexRealComponent},
  {path : 'act_forex-demo', component : ActForexDemoComponent},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackerActForexRoutingModule { }
