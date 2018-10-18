import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  model: any = {};
  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;  
  constructor(public appService: AppService, public router: Router,private toastr: ToastrService,
    private location: Location) { }

  ngOnInit() {
  }

  public goToSignIn: any = () => {

    // this.router.navigate(['/']);
    this.location.back();

  } // end goToSignIn

  onSubmit() {
    let data = {
      firstName: this.model.firstName,
      lastName: this.model.lastName,
      mobileNumber : this.model.mobNum,
      email: this.model.email,
      password: this.model.password,
      createdOn: Date.now()
    }

    console.log(data);

    this.appService.signupFunction(data).subscribe((apiResponse) => {

        console.log(apiResponse);

        if (apiResponse.status === 200) {

          this.toastr.success('Signup successful');

          setTimeout(() => {

            this.goToSignIn();

          }, 2000);

        } else {

          this.toastr.error(apiResponse.message);

        }

      }, (err) => {

        this.toastr.error('some error occured');
        console.log("Error message: " +err.message)

      });
  }
}
