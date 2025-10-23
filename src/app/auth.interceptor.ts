import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api-service';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  
    const apiService = inject(ApiService)
    let cloned = req
    
    const isProtectedRoute = req.url.split('/')[3] === 'protected'
    
    if(isProtectedRoute){
      cloned = req.clone({
        setHeaders: {
          authorization: `Bearer ${apiService.key}`
        }
      });
    }
  
    return next(cloned)
  }