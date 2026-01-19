import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ApiService } from '../../api-service';
import { CommonModule } from '@angular/common';
import { whiteSpaceValidator } from '../../validators/validators';
import { AuthService } from '../../core/auth-service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Auth {
  loginFrmGrp !: FormGroup
  constructor(
    private fb : FormBuilder,
    private apiService : ApiService,
    private router : Router,
    private authService: AuthService
  ){
    this.loginFrmGrp = fb.group({
      userName : ['',[Validators.required, whiteSpaceValidator()]],
      password : ['',[Validators.required, whiteSpaceValidator()]]
    })
  }

  ngOnInit(){
    this.apiService.logout({}).subscribe();
    this.apiService.isLoggedIn = false;
  }

  login(){
    if(this.loginFrmGrp.valid){
      let request = {
        userName : this.loginFrmGrp.get('userName')?.value.trim(),
        password : this.loginFrmGrp.get('password')?.value.trim()
      }
      this.apiService.login(request).subscribe({
        next : (res:any)=>{
          if(res.ok){
            this.authService.setAccessToken(res.accessToken);
            this.apiService.isLoggedIn = true;
            this.router.navigate(['/app/cases'])
          }
        }
      })
    }
  }
}
