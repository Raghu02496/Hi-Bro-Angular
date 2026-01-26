import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../services/api-service';
import { AuthService } from '../services/auth-service';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {

    const router = inject(Router)
    const apiService = inject(ApiService)
    const authService = inject(AuthService);

    let cloned = req

    cloned = req.clone({
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