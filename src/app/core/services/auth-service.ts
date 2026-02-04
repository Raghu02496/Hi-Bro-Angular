import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken : string = ''
  private apiService = inject(ApiService);

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  setAccessToken(token : string){
    this.accessToken = token;
  }

  getAccessToken(){
    return this.accessToken;
  }

  logout(){
    this.apiService.logout({}).subscribe()
    this.setAccessToken('');
  }
}
