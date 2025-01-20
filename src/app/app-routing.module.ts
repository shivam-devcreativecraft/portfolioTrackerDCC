import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidenavComponent } from './SharedComponents/sidenav/sidenav.component';
import { AuthGuard } from './auth.guard';
const routes: Routes = [
 
  {path : 'login', component : LoginComponent},

  {
    path: '',
    component: SidenavComponent,
    canActivate: [AuthGuard], // Apply AuthGuard to the root path
    loadChildren: () =>
      import('./home/home.module').then(
        (m) => m.HomeModule
      ),
  },



  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
