import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  isLoggedIn = false
  connectSocket : Subject<void> = new Subject()
  socket !: Socket
  messageObservable$ !: Observable<string>
  constructor(private httpClient : HttpClient){
    this.connectWebSocket();
  }

  connectWebSocket(){
    this.connectSocket.subscribe({
      next : ()=>{
        if(this.isLoggedIn){
          this.socket = io(environment.apiUrl,{ withCredentials : true });

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
    return this.httpClient.post(environment.apiUrl+'/protected/msgChatGpt',request)
  }

  getConversation(request : any){
    return this.httpClient.post(environment.apiUrl+'/protected/getConversation',request)
  }

  getCaseById(request : any){
    return this.httpClient.post(environment.apiUrl+'/protected/getCaseById',request)
  }

  listCases(request: any){
    return this.httpClient.post(environment.apiUrl+'/protected/listCases',request)
  }

  login(request : any){
    return this.httpClient.post(environment.apiUrl+'/public/login',request)
  }

  logout(request : any){
    return this.httpClient.post(environment.apiUrl+'/public/logout',request)
  }

  refresh(request : any){
    return this.httpClient.post(environment.apiUrl+'/refresh',request)
  }

  status(request : any){
    return this.httpClient.post(environment.apiUrl+'/protected/status',request)
  }

  listUsers(request: any){
    return this.httpClient.post(environment.apiUrl+'/protected/listUsers',request)
  }

  sendSocket(payload : any){
    this.socket.emit('sendMessage',payload)
  }
  
}
