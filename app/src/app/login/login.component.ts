import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/contants/contstants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private constant: Constants
  ) {}

  openSnackBar(message: string) { 
    // this.snackbar.open(message, 'Ok',{
    //   duration: 30000
    // }) 
  }

  login() {

    const formValues = this.form.value;

    const reqBody = {
      email: formValues.email,
      password: formValues.password
    }
    
    const baseUrl = this.constant.baseUrl;
    this.httpClient.post(baseUrl+'/login', reqBody).subscribe(
      {
        next: ((res: any) => {
          console.log(res);
          this.openSnackBar("Logged In Successfully!");
          localStorage['access_token'] = res.jwtToken;
          this.router.navigateByUrl('/processes')
        }),
        error: ((err) => {
          switch(err.status){
            case 400:
              this.openSnackBar("Invalid Credentials!");
              break;
            default:
              this.openSnackBar("Something went wrong!")
          }
          console.log(err);
        })
      }
    )


  }
}
