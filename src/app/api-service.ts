import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  serverAddress  = 'http://localhost:3000'
  constructor(private httpClient : HttpClient){}

  sendMessage(request: any){
    return this.httpClient.post(this.serverAddress+'/x/msgChatGpt',request)
  }

  getConversation(request : any){
    return this.httpClient.post(this.serverAddress+'/x/getConversation',request)
  }

  getCaseById(request : any){
    return this.httpClient.post(this.serverAddress+'/x/getCaseById',request)
  }
  
}
