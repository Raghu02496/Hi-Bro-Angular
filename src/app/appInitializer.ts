import { inject } from "@angular/core";
import { ApiService } from "./api-service";

export async function appInitializer() {
    const apiService = inject(ApiService);

    const valid = await new Promise((resolve)=>{
      apiService.status({}).subscribe({
          next : (response:any)=>{
              if(response.ok){
                apiService.isLoggedIn = true;  
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