import { CanActivateFn } from '@angular/router';
import { ApiService } from '../services/api-service';
import { inject } from '@angular/core';

export const checkLoggedInGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService)
  return apiService.isLoggedIn;
};
