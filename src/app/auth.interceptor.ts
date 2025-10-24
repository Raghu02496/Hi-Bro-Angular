import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api-service';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {

    const router = inject(Router)
    const apiService = inject(ApiService)

    let cloned = req
    
    const isProtectedRoute = req.url.split('/')[3] === 'protected'
    
    if(isProtectedRoute){
      cloned = req.clone({
        withCredentials: true
      });
    }

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        apiService.isLoggedIn = false;
        router.navigate(['/login'])
        return throwError(() => error);
      })
    )

  }