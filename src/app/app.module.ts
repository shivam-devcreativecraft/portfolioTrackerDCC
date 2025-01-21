import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  SidenavComponent } from './SharedComponents/sidenav/sidenav.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from './SharedComponents/error/error.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { SharedMaterialImportsModule } from './shared-material-imports/shared-material-imports.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';

import { 
 
  GoogleSigninButtonDirective,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { TradingviewComponent } from './tradingview/tradingview.component';
import { SharedModule } from './SharedComponents/shared.module';
import { MatChipsModule } from '@angular/material/chips';
import { LoaderComponent } from './loader/loader.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

// ENDS material imports

// Add Firebase imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
  
    ErrorComponent,
    LoginComponent,
    TradingviewComponent,
    LoaderComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    // DisableNumberInputScrollDirective,
    
    // PortfolioNotesAddComponent
    
    

  ],
  // providers : [DatePipe],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    //STARTS material imports
    SharedMaterialImportsModule,
    SharedModule,
     ToastrModule.forRoot(),
     FormsModule,
     ReactiveFormsModule,
     GoogleSigninButtonModule,
     MatChipsModule,
     MatListModule,
     MatTooltipModule,
     // Firebase setup
     AngularFireModule.initializeApp(environment.firebaseConfig),
     AngularFirestoreModule,
     AngularFireAuthModule,
     provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
     provideAuth(() => getAuth()),
     provideStorage(() => getStorage()),
     provideFirestore(() => getFirestore()),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    },
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
