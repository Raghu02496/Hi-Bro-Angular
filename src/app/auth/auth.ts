import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ApiService } from '../api-service';
import { CommonModule } from '@angular/common';
import { whiteSpaceValidator } from '../validators/validators';

@Component({
  selector: 'app-auth',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth {

  loginFrmGrp !: FormGroup
  timer = signal(50);
  constructor(
    private fb : FormBuilder,
    private apiService : ApiService,
    private router : Router
  ){
    this.loginFrmGrp = fb.group({
      userName : ['',[Validators.required, whiteSpaceValidator()]],
      password : ['',[Validators.required, whiteSpaceValidator()]]
    })
  }

  ngOnInit(){
    this.startTimer();
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
            this.apiService.isLoggedIn = true;
            this.router.navigate(['/cases'])
          }
        }
      })
    }
  }

  startTimer(){
    let interval = setInterval(()=>{
      if(this.timer() > 0){
        this.timer.update((val)=> val-1);
      }else{
        clearInterval(interval);
      }
    },1000)
  }

}
