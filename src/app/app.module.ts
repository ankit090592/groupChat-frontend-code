import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
//router module used for app level route
import { RouterModule, Routes } from '@angular/router';
import { UserModule } from './user/user.module';

// import { CookieModule } from '@ngx-toolkit/cookie';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SigninComponent } from './user/signin/signin.component';
import { SharedModule } from './shared/shared.module';
import { ChatModule } from './chat/chat.module';
import { AppService } from './app.service';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    SharedModule,
    ChatModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,// required animations module
    RouterModule.forRoot([
      { path: 'signin', component: SigninComponent, pathMatch: 'full' },
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      { path: '*', component: SigninComponent },
      { path: '**', component: SigninComponent }
    ]),
    ToastrModule.forRoot(), // ToastrModule added
    // CookieModule.forRoot()
  ],
  providers: [AppService,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
