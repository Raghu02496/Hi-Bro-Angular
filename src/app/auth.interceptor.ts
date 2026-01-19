import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api-service';
import { AuthService } from './core/auth-service';

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
        apiService.isLoggedIn = false;
        router.navigate(['/login'])
        return throwError(() => error);
      })
    )

  }