import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { CookieService } from '@ngx-toolkit/cookie';
// import { CookieService } from 'ngx-cookie-service';
import { Cookie } from 'ng2-cookies/ng2-cookies'; 


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public email: any;
  public password: any;
  // acceptedCookie: boolean;
  model: any = {};


  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    // this.acceptedCookie = this.cookieService.getItem('accept-cookie') === 'true';
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/signup']);

  } // end goToSignUp


  public goToForgotPassword: any = () => {
    this.router.navigate(['/forgotPwd']);
  }


  //------------------ form validation ------------------------------------
  onSubmit() {

    let data = {
      email: this.model.email,
      password: this.model.password
    }

    this.appService.signinFunction(data).subscribe((apiResponse) => {

      if (apiResponse.status === 200) {
        console.log(apiResponse)
        // this.cookieService.setItem('accept-cookie', 'true');
        // this.acceptedCookie = true; 
        Cookie.set("authToken", apiResponse.data.authToken);      
        //console.log("authToken in cookie sigin component: "+at);
        console.log("authToken from apiResponse in sigin component: "+apiResponse.data.authToken);
        
        Cookie.set("userId", apiResponse.data.userDetails.userId);

        Cookie.set("userName", (apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName).trim())
        //------------------------------------
        
        this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
        
        this.toastr.success(apiResponse.message)
        this.router.navigate(['/chatRoom']);  

      } else {

        this.toastr.error(apiResponse.message)

      }
    }, (err) => {
      this.toastr.error('some error occured')

    })

    } // end condition


  }
  //---------------------- form validation end ----------------------------

