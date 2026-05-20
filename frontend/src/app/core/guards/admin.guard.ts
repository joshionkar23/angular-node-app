import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();
  if (!authService.isAuthenticated() || !user) {
    return router.createUrlTree(['/auth']);
  }

  return user.role === 'admin' ? true : router.createUrlTree(['/dashboard']);
};
