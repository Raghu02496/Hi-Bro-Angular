import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  serverAddress  = 'http://localhost:3000'
  constructor(private httpClient : HttpClient){}

  getTodo(request: any){
    return this.httpClient.post(this.serverAddress+'/todo/getTodo',request)
  }

  addTodo(request: any){
    return this.httpClient.post(this.serverAddress+'/todo/addTodo',request)
  }

  updateTodo(request: any){
    return this.httpClient.post(this.serverAddress+'/todo/updateTodoById',request)
  }

  deleteTodo(request: any){
    return this.httpClient.post(this.serverAddress+'/todo/deleteTodoById',request)
  }
  
}
