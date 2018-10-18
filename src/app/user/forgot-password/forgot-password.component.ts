import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  model: any = {};
  public email: any
  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  onSubmit() {
    let data = {
      email: this.model.email      
    }
    this.appService.sendForgottenPwdFunction(data)
      .subscribe((apiResponse) => {
        console.log("forgotPwd email:"+this.model.email)
        if (apiResponse.status == 200) {
          this.toastr.success("Mail Sent SuccessFully", "Success!");
          setTimeout(() => {
            this.router.navigate(['/signin']);
          }, 2000);
        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          this.toastr.error("Some Error Occurred", "Error!");
        });

  }//end of send password 

}
