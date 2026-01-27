import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject, tap } from 'rxjs';
import { AuthService } from './auth-service';
import { SKIP_AUTH_INTERCEPTOR } from '../interceptors/skip-interceptor.token';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  connectSocket : Subject<void> = new Subject()
  socket !: Socket
  messageObservable$ !: Observable<string>
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ){
    this.connectWebSocket();
  }

  connectWebSocket(){
    this.connectSocket.subscribe({
      next : ()=>{
        if(this.authService.isLoggedIn()){
          this.socket = io(environment.apiUrl,{ 
            withCredentials : true,
            auth : {
              accessToken : this.authService.getAccessToken()
            }}
          );

          this.messageObservable$ = new Observable((subscriber)=>{
            this.socket.on('sendMessage',(msg)=>{
              subscriber.next(msg)
            })
          })
        }
      }
    })
  }

  recieveMessage(){
    return this.messageObservable$;
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
    return this.httpClient.post(environment.apiUrl+'/public/auth/loginWithEmail',request)
  }

  loginWithGoogle(request : any){
    return this.httpClient.post(environment.apiUrl+'/public/auth/loginWithGoogle',request)
  }

  logout(request : any){
    return this.httpClient.post(environment.apiUrl+'/protected/game/logout',request)
  }

  refresh(request : any){
    return this.httpClient.post(environment.apiUrl+'/protected/auth/refresh',request, {
      context : new HttpContext().set(SKIP_AUTH_INTERCEPTOR, true)
    })
    .pipe(
      tap({
        next: (value: any)=>{
          this.authService.setAccessToken(value.accessToken);
        }
      })
    )
  }

  listUsers(request: any){
    return this.httpClient.post(environment.apiUrl+'/protected/game/listUsers',request)
  }

  sendSocket(payload : any){
    this.socket.emit('sendMessage',payload)
  }
  
}
