import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackerActForexComponent } from './tracker-act-forex/tracker-act-forex.component';
import { TrackerActFuturesComponent } from './tracker-act-futures/tracker-act-futures.component';

const routes: Routes = [
  { path: '', redirectTo: 'tracker-act-forex', pathMatch: 'full' },
  {
    path: 'tracker-act-forex',
    component: TrackerActForexComponent,
    loadChildren: () =>
      import('./tracker-act-forex/tracker-act-forex.module').then((m) => m.TrackerActForexModule),
  },
  {
    path: 'tracker-act-futures',
    component: TrackerActFuturesComponent,
    loadChildren: () =>
      import('./tracker-act-futures/tracker-act-futures.module').then(
        (m) => m.TrackerActFuturesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackerRoutingModule {}
