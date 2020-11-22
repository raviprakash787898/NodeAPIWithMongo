import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.component.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  registerFormGroup: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(private appService: AppService, private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.registerFormGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  get formControls() {
    return this.registerFormGroup.controls;
  }

  register() {
    this.isFormSubmitted = true;
    if(this.registerFormGroup.invalid) {
      return;
    }
    this.appService.registerUser(this.registerFormGroup.value).subscribe((res: any) => {
      if(res.message == "Success") {
        this.authService.setLocalStorage('auth-token', res.token);
        this.authService.setLocalStorage('userInfo', res.Data);
        this.router.navigate(['/home']);
      }
    },
    (error) => {
      console.error(error.error.message);
    })
  }

}
