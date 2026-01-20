import { inject } from "@angular/core";
import { ApiService } from "../services/api-service";
import { AuthService } from "../services/auth-service";

export async function appInitializer() {
    const apiService = inject(ApiService);
    const authService = inject(AuthService);

    const valid = await new Promise((resolve)=>{
      apiService.refresh({}).subscribe({
          next : (res:any)=>{
              if(res.ok){
                apiService.isLoggedIn = true;
                authService.setAccessToken(res.accessToken);
                resolve(true);
              }else{
                resolve(false)
              }
          },
          error : ()=>{
              resolve(false);
          }
      })
    })
    return valid
  }