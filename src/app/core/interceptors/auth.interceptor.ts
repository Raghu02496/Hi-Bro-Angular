import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../services/api-service';
import { AuthService } from '../services/auth-service';
import { SKIP_AUTH_INTERCEPTOR } from './skip-interceptor.token';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {

    if(req.context.get(SKIP_AUTH_INTERCEPTOR)){
      let cloned = req.clone({
        withCredentials: true
      });
      return next(cloned);
    }

    const authService = inject(AuthService);

    let cloned = req.clone({
      withCredentials: true,
      setHeaders: {
        Authorization: `Bearer ${authService.getAccessToken()}`
      }
    });

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401){
          location.reload();
        }
        return throwError(() => error);
      })
    )

  }