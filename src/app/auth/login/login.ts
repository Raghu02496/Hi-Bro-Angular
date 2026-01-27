import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from '../../core/services/api-service';
import { CommonModule } from '@angular/common';
import { whiteSpaceValidator } from '../../core/validators/validators';
import { AuthService } from '../../core/services/auth-service';
import { EMPTY, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

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
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ){
    this.loginFrmGrp = fb.group({
      email : ['',[Validators.required, whiteSpaceValidator()]],
      password : ['',[Validators.required, whiteSpaceValidator()]]
    })

    this.activatedRoute.queryParamMap.
    pipe(
      switchMap((value)=>{
        const code = value.get('code')
        if(code){
          let request = {
            authorizationToken : code
          }
          return this.apiService.loginWithGoogle(request)
        }else{
          return EMPTY
        }
      })
    ).subscribe({
      next: (res: any)=>{
        this.authService.setAccessToken(res.accessToken);
        this.router.navigate(['/app/cases'])
      }
    })
  }

  login(){
    if(this.loginFrmGrp.valid){
      let request = {
        email : this.loginFrmGrp.get('email')?.value.trim(),
        password : this.loginFrmGrp.get('password')?.value.trim()
      }
      this.apiService.login(request).subscribe({
        next : (res:any)=>{
          if(res.ok){
            this.authService.setAccessToken(res.accessToken);
            this.router.navigate(['/app/cases'])
          }
        }
      })
    }
  }

  loginWithGoogle(){
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=1021093571994-4thj77b8qff06oitdmejmpocujijqvfp.apps.googleusercontent.com` +
    `&redirect_uri=${environment.googleRedirectUri}` +
    `&response_type=code` +
    `&scope=openid email profile`;
  }
}
