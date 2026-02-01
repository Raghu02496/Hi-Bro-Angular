import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, filter, Observable, Subject, take, tap } from 'rxjs';
import { AuthService } from './auth-service';
import { SKIP_AUTH_INTERCEPTOR } from '../interceptors/skip-interceptor.token';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private gate$ : BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private httpClient: HttpClient
  ){
    
  }

  waitUntillGateOpen() {
    return this.gate$.asObservable()
    .pipe(
      filter((value)=> value === true),
      take(1)
    )
  }

  openGate(){
    this.gate$.next(true);
  }

  closeGate(){
    this.gate$.next(false);
  }

  sendMessage(request: any){
    return this.httpClient.post(environment.apiUrl+'/protected/game/msgChatGpt',request)
  }

  getConversation(request : any){
    return this.httpClient.post(environment.apiUrl+'/protected/game/getConversation',request)
  }

  getCaseById(request : any){
    return this.httpClient.post(environment.apiUrl+'/protected/game/getCaseById',request)
  }

  listCases(request: any){
    return this.httpClient.post(environment.apiUrl+'/protected/game/listCases',request)
  }

  login(request : any){
    return this.httpClient.post(environment.apiUrl+'/public/auth/loginWithEmail',request, {
      context : new HttpContext().set(SKIP_AUTH_INTERCEPTOR, true)
    })
  }

  loginWithGoogle(request : any){
    return this.httpClient.post(environment.apiUrl+'/public/auth/loginWithGoogle',request, {
      context : new HttpContext().set(SKIP_AUTH_INTERCEPTOR, true)
    })
  }

  logout(request : any){
    return this.httpClient.post(environment.apiUrl+'/protected/game/logout',request)
  }

  refresh(request : any){
    return this.httpClient.post(environment.apiUrl+'/protected/auth/refresh',request, {
      context : new HttpContext().set(SKIP_AUTH_INTERCEPTOR, true)
    })
  }

  listUsers(request: any){
    return this.httpClient.post(environment.apiUrl+'/protected/game/listUsers',request)
  }

}
