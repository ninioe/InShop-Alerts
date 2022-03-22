import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
isSubmited = false;
loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.loginForm = this.fb.group({
      user: ['test@gmail.com', Validators.required],
      password: ['test1234', Validators.required]
    })
  }

  get f(){
    return this.loginForm.controls;
  }

  onLogin({ value, valid }: { value: any, valid: boolean }){
    this.isSubmited = true;
    if(!valid) return;
    
    this.authService.login(value.user, value.password).subscribe(res => {
      console.log(res);
      this.router.navigate(['/alerts']);
    });
  }

}
