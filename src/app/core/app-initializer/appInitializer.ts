import { inject } from "@angular/core";
import { ApiService } from "../services/api-service";

export async function appInitializer() {
    const apiService = inject(ApiService);

    const valid = await new Promise((resolve)=>{
      apiService.refresh({}).subscribe({
          next : (res:any)=>{
              if(res.ok){
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