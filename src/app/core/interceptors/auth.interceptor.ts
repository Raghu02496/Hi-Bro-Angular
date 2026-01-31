import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, defer, mergeMap, Observable, retry, retryWhen, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { SKIP_AUTH_INTERCEPTOR } from './skip-interceptor.token';
import { ApiService } from '../services/api-service';

export function authInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  const apiService = inject(ApiService);

  if (req.context.get(SKIP_AUTH_INTERCEPTOR)) {
    let cloned = req.clone({
      withCredentials: true,
    });

    return next(cloned).pipe(
      tap({
        next: (res) => {
          apiService.openGate();
        }
      })
    );
  }

  return defer(() => {
    let cloned = req.clone({
      withCredentials: true,
      setHeaders: {
        Authorization: `Bearer ${authService.getAccessToken()}`,
      },
    });

    return apiService.waitUntillGateOpen().pipe(mergeMap((value) => next(cloned)));
  }).pipe(
    retry({
      delay: (error, retryCount) => {
        if (error.status === 401) {
          apiService.closeGate();
          apiService.refresh({}).subscribe();

          if (retryCount === 3) {
            throw error;
          }
        }
        return apiService.waitUntillGateOpen();
      },
    })
  );
}
