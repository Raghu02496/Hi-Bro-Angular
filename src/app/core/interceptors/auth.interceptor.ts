import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, defer, mergeMap, Observable, retry, retryWhen, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { SKIP_AUTH_INTERCEPTOR } from './skip-interceptor.token';
import { ApiService } from '../services/api-service';

export function authInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  if (req.context.get(SKIP_AUTH_INTERCEPTOR)) {
    let cloned = req.clone({
      withCredentials: true,
    });
    return next(cloned);
  }

  const authService = inject(AuthService);
  const apiService = inject(ApiService);

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
