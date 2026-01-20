import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loggerInterceptor } from './core/interceptors/logger.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { appInitializer } from './core/app-initializer/appInitializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(appInitializer),
    provideHttpClient(withInterceptors([loggerInterceptor,authInterceptor]))
  ]
};
