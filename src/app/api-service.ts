import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  serverAddress  = 'http://localhost:3000'
  constructor(private httpClient : HttpClient){}

  sendMessage(request: any){
    return this.httpClient.post(environment.apiUrl+'/x/msgChatGpt',request)
  }

  getConversation(request : any){
    return this.httpClient.post(environment.apiUrl+'/x/getConversation',request)
  }

  getCaseById(request : any){
    return this.httpClient.post(environment.apiUrl+'/x/getCaseById',request)
  }
  
}
