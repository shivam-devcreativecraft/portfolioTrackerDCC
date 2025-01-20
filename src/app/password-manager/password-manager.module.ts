import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordManagerRoutingModule } from './password-manager-routing.module';
import { PasswordManagerComponent } from './password-manager.component';


@NgModule({
  declarations: [
    PasswordManagerComponent
  ],
  imports: [
    CommonModule,
    PasswordManagerRoutingModule
  ]
})
export class PasswordManagerModule { }
