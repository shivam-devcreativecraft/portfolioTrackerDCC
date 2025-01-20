import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { SharedModule } from '../SharedComponents/shared.module';
import { PortfolioNotesComponent } from '../portfolio-notes/portfolio-notes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { AddToGoogledriveComponent } from '../SharedComponents/googledrive/add-to-googledrive/add-to-googledrive.component';
import { GoogledriveComponent } from '../SharedComponents/googledrive/googledrive.component';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';


@NgModule({
  declarations: [PortfolioNotesComponent,
    GoogledriveComponent,
    AddToGoogledriveComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleSigninButtonModule,
    SharedMaterialImportsModule,
    MatChipsModule,
 
    
    
  ]
})
export class HomeModule { }
