import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

export function loggerInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {

  return next(req).pipe(
    tap((val)=>{
      let response = val as HttpResponse<any>
      if(!environment.production){
        console.log('request:',req.body,'\nresponse:',response.body)
      }
    })
  )
}
