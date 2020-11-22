import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.component.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInFormGroup: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(private appService: AppService, private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.signInFormGroup = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  get formControls() {
    return this.signInFormGroup.controls;
  }

  register() {
    this.isFormSubmitted = true;
    if(this.signInFormGroup.invalid) {
      return;
    }
    this.appService.loginUser(this.signInFormGroup.value).subscribe((res: any) => {
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