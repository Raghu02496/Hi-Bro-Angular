import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken : string = ''

  setAccessToken(token : string){
    this.accessToken = token;
  }

  getAccessToken(){
    return this.accessToken;
  }
}
