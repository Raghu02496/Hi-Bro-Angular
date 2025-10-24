import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  isLoggedIn = false
  serverAddress  = 'http://localhost:3000'

  constructor(private httpClient : HttpClient){}

  sendMessage(request: any){
    return this.httpClient.post(environment.apiUrl+'/protected/msgChatGpt',request)
  }

  getConversation(request : any){
    return this.httpClient.post(environment.apiUrl+'/protected/getConversation',request)
  }

  getCaseById(request : any){
    return this.httpClient.post(environment.apiUrl+'/protected/getCaseById',request)
  }

  login(request : any){
    return this.httpClient.post(environment.apiUrl+'/public/login',request)
  }
  
}
