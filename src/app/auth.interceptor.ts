import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiService } from './api-service';
import { Router } from '@angular/router';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  
    const apiService = inject(ApiService)
    const router = inject(Router)
    let cloned = req
    
    const isProtectedRoute = req.url.split('/')[3] === 'protected'
    
    if(isProtectedRoute){
      cloned = req.clone({
        setHeaders: {
          authorization: `Bearer ${apiService.key}`
        }
      });
    }
  
    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        apiService.key = ""
        router.navigate(['/login'])
        return throwError(() => error);
      })
    )

  }