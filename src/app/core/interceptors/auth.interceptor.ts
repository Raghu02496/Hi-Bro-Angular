import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  defer,
  mergeMap,
  Observable,
  retry,
  tap,
} from 'rxjs';
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
        next: (res: HttpEvent<any>) => {
          if (res instanceof HttpResponse) {
            if (res.body.ok) {
              authService.setAccessToken(res.body.accessToken);
              apiService.openGate();
            }
          }
        },
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
