import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackerActForexRoutingModule } from './tracker-act-forex-routing.module';
import { TrackerActForexComponent } from './tracker-act-forex.component';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';
import { ActForexRealComponent } from './act-forex-real/act-forex-real.component';
import { ActForexDemoComponent } from './act-forex-demo/act-forex-demo.component';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';

import {
 
  GoogleSigninButtonDirective,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TrackerActForexComponent,
    ActForexRealComponent,
    ActForexDemoComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    TrackerActForexRoutingModule,
    SharedMaterialImportsModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
  ],


  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID)
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],


})
export class TrackerActForexModule { }
