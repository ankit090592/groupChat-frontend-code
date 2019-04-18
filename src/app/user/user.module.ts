import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieModule } from '@ngx-toolkit/cookie';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CookieModule.forRoot(),
    RouterModule.forChild([
      { path: 'signup', component: SignupComponent },
      {path: 'forgotPwd', component: ForgotPasswordComponent }
    ])
  ],
  declarations: [SigninComponent, SignupComponent, ForgotPasswordComponent]
})
export class UserModule { }