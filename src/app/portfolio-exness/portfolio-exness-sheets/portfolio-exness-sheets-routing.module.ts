import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExnessDemoComponent } from './exness-demo/exness-demo.component';
import { ExnessRealComponent } from './exness-real/exness-real.component';


const routes: Routes = [
  {path : '', component : ExnessDemoComponent },
  {path : 'exness-demo', component : ExnessDemoComponent },

  {path : 'exness-real', component : ExnessRealComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioExnessSheetsRoutingModule { }
