import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  
  return next(req).pipe(
    tap((val)=>{
      let response = val as HttpResponse<any>
      console.log('request:',req.body,'\nresponse:',response.body)
    })
  )
}
