import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SearchSpotCoinDialogComponent } from '../SharedComponents/search-spot-coin-dialog/search-spot-coin-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialImportsModule } from '../shared-material-imports/shared-material-imports.module';
import { GoogledriveComponent } from '../SharedComponents/googledrive/googledrive.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from '../api-interceptor';
// import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { ConsoleService } from '../services/console.service';
import { } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider, FacebookLoginProvider,
  GoogleSigninButtonDirective, SocialLoginModule,
  SocialAuthServiceConfig, GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';

import {


} from '@abacritt/angularx-social-login';
import { AddToGoogledriveComponent } from '../SharedComponents/googledrive/add-to-googledrive/add-to-googledrive.component';
// import { FolderItemComponent } from '../SharedComponents/googledrive/folder-item/folder-item.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SearchSpotCoinDialogComponent,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleSigninButtonModule,
    // SocialLoginModule,
    SharedMaterialImportsModule
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],

  // providers: [
  //   { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },

  //   {
  //     provide: 'SocialAuthServiceConfig',
  //     useValue: {
  //       autoLogin: false,
  //       providers: [
  //         {
  //           id: GoogleLoginProvider.PROVIDER_ID,
  //           provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID)
  //         }
  //       ],
  //       onError: (err) => {
  //         console.error('Social login error:', err);
  //       }
  //     } as SocialAuthServiceConfig,
  //   },

  //   ConsoleService
  // ],
})
export class DashboardModule { }
